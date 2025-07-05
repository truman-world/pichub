import Compressor from 'compressorjs';
import SparkMD5 from 'spark-md5';

export class ImageUploader {
    constructor(options = {}) {
        this.options = {
            endpoint: '/api/v1/upload',
            chunkSize: 5 * 1024 * 1024, // 5MB chunks
            maxConcurrent: 3,
            maxRetries: 3,
            retryDelay: 1000,
            compressionQuality: 0.8,
            maxWidth: 4096,
            maxHeight: 4096,
            ...options
        };
        
        this.queue = [];
        this.activeUploads = new Map();
        this.chunks = new Map();
    }
    
    addToQueue(fileData) {
        this.queue.push(fileData);
        this.processQueue();
    }
    
    async processQueue() {
        while (this.queue.length > 0 && this.activeUploads.size < this.options.maxConcurrent) {
            const fileData = this.queue.shift();
            this.startUpload(fileData);
        }
    }
    
    async startUpload(fileData) {
        try {
            fileData.startTime = Date.now();
            this.activeUploads.set(fileData.id, fileData);
            
            // Process image before upload
            const processedFile = await this.processImage(fileData.file);
            
            // Calculate file hash for deduplication
            const hash = await this.calculateFileHash(processedFile);
            
            // Check if file needs chunking
            if (processedFile.size > this.options.chunkSize) {
                await this.uploadChunked(fileData, processedFile, hash);
            } else {
                await this.uploadDirect(fileData, processedFile, hash);
            }
            
        } catch (error) {
            this.handleUploadError(fileData, error);
        }
    }
    
    async processImage(file) {
        return new Promise((resolve, reject) => {
            // Skip processing for non-images
            if (!file.type.startsWith('image/')) {
                resolve(file);
                return;
            }
            
            new Compressor(file, {
                quality: this.options.compressionQuality,
                maxWidth: this.options.maxWidth,
                maxHeight: this.options.maxHeight,
                convertSize: 5000000, // Convert to JPEG if > 5MB
                mimeType: 'auto',
                
                beforeDraw(context, canvas) {
                    // Fix orientation based on EXIF data
                    context.save();
                },
                
                success(result) {
                    resolve(result);
                },
                
                error(err) {
                    reject(err);
                }
            });
        });
    }
    
    async calculateFileHash(file) {
        return new Promise((resolve, reject) => {
            const spark = new SparkMD5.ArrayBuffer();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                spark.append(e.target.result);
                resolve(spark.end());
            };
            
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }
    
    async uploadDirect(fileData, file, hash) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('hash', hash);
        formData.append('name', fileData.name);
        
        const xhr = new XMLHttpRequest();
        fileData.xhr = xhr;
        
        // Progress tracking
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                const speed = this.calculateSpeed(e.loaded, fileData.startTime);
                const remaining = this.calculateTimeRemaining(e.loaded, e.total, fileData.startTime);
                
                if (this.options.onProgress) {
                    this.options.onProgress(fileData, progress, speed, remaining);
                }
            }
        });
        
        // Promise wrapper for XHR
        return new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    this.handleUploadSuccess(fileData, response);
                    resolve(response);
                } else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.onabort = () => reject(new Error('Upload cancelled'));
            
            xhr.open('POST', this.options.endpoint);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').content);
            xhr.send(formData);
        });
    }
    
    async uploadChunked(fileData, file, hash) {
        const chunks = this.createChunks(file);
        const uploadId = this.generateUploadId();
        
        this.chunks.set(fileData.id, {
            total: chunks.length,
            uploaded: 0,
            chunks: chunks,
            uploadId: uploadId
        });
        
        // Initialize chunk upload
        await this.initializeChunkUpload(fileData, file, hash, uploadId, chunks.length);
        
        // Upload chunks with concurrency control
        const chunkPromises = [];
        for (let i = 0; i < chunks.length; i++) {
            chunkPromises.push(this.uploadChunk(fileData, chunks[i], i, uploadId));
            
            // Limit concurrent chunk uploads
            if (chunkPromises.length >= 3 || i === chunks.length - 1) {
                await Promise.all(chunkPromises);
                chunkPromises.length = 0;
            }
        }
        
        // Complete chunk upload
        await this.completeChunkUpload(fileData, uploadId);
    }
    
    createChunks(file) {
        const chunks = [];
        let start = 0;
        
        while (start < file.size) {
            const end = Math.min(start + this.options.chunkSize, file.size);
            chunks.push(file.slice(start, end));
            start = end;
        }
        
        return chunks;
    }
    
    async initializeChunkUpload(fileData, file, hash, uploadId, totalChunks) {
        const response = await fetch(`${this.options.endpoint}/chunk/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                uploadId: uploadId,
                fileName: fileData.name,
                fileSize: file.size,
                fileType: file.type,
                hash: hash,
                totalChunks: totalChunks
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to initialize chunk upload');
        }
        
        return response.json();
    }
    
    async uploadChunk(fileData, chunk, index, uploadId) {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', index.toString());
        
        const response = await fetch(`${this.options.endpoint}/chunk/upload`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Failed to upload chunk ${index}`);
        }
        
        // Update progress
        const chunkInfo = this.chunks.get(fileData.id);
        chunkInfo.uploaded++;
        
        const progress = Math.round((chunkInfo.uploaded / chunkInfo.total) * 100);
        if (this.options.onProgress) {
            this.options.onProgress(fileData, progress, '', '');
        }
        
        return response.json();
    }
    
    async completeChunkUpload(fileData, uploadId) {
        const response = await fetch(`${this.options.endpoint}/chunk/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                uploadId: uploadId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to complete chunk upload');
        }
        
        const result = await response.json();
        this.handleUploadSuccess(fileData, result);
        
        // Clean up
        this.chunks.delete(fileData.id);
        
        return result;
    }
    
    async handleUploadSuccess(fileData, response) {
        this.activeUploads.delete(fileData.id);
        
        if (this.options.onSuccess) {
            this.options.onSuccess(fileData, response);
        }
        
        // Process next item in queue
        this.processQueue();
    }
    
    async handleUploadError(fileData, error) {
        console.error('Upload error:', error);
        
        fileData.retryCount = (fileData.retryCount || 0) + 1;
        
        if (fileData.retryCount < this.options.maxRetries) {
            // Exponential backoff retry
            const delay = this.options.retryDelay * Math.pow(2, fileData.retryCount - 1);
            
            setTimeout(() => {
                this.queue.unshift(fileData);
                this.processQueue();
            }, delay);
        } else {
            this.activeUploads.delete(fileData.id);
            
            if (this.options.onError) {
                this.options.onError(fileData, error.message);
            }
            
            this.processQueue();
        }
    }
    
    cancel(fileData) {
        // Cancel XHR if active
        if (fileData.xhr) {
            fileData.xhr.abort();
        }
        
        // Remove from queue and active uploads
        this.queue = this.queue.filter(f => f.id !== fileData.id);
        this.activeUploads.delete(fileData.id);
        this.chunks.delete(fileData.id);
        
        this.processQueue();
    }
    
    retry(fileData) {
        fileData.retryCount = 0;
        fileData.status = 'pending';
        this.addToQueue(fileData);
    }
    
    clearQueue() {
        // Cancel all active uploads
        for (const [id, fileData] of this.activeUploads) {
            this.cancel(fileData);
        }
        
        // Clear queue
        this.queue = [];
    }
    
    calculateSpeed(loaded, startTime) {
        const duration = (Date.now() - startTime) / 1000; // in seconds
        const speed = loaded / duration; // bytes per second
        
        if (speed > 1024 * 1024) {
            return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;
        } else if (speed > 1024) {
            return `${(speed / 1024).toFixed(2)} KB/s`;
        } else {
            return `${speed.toFixed(2)} B/s`;
        }
    }
    
    calculateTimeRemaining(loaded, total, startTime) {
        const duration = (Date.now() - startTime) / 1000;
        const speed = loaded / duration;
        const remaining = (total - loaded) / speed;
        
        if (remaining > 3600) {
            return `${Math.floor(remaining / 3600)}h ${Math.floor((remaining % 3600) / 60)}m`;
        } else if (remaining > 60) {
            return `${Math.floor(remaining / 60)}m ${Math.floor(remaining % 60)}s`;
        } else {
            return `${Math.floor(remaining)}s`;
        }
    }
    
    generateUploadId() {
        return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Export for use in other modules
window.ImageUploader = ImageUploader;
