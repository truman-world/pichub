<div x-data="uploadZone()" 
     x-init="init()"
     @drop.prevent="handleDrop"
     @dragover.prevent="isDragging = true"
     @dragleave.prevent="isDragging = false"
     @paste.window="handlePaste"
     class="relative">
    
    <!-- Upload Area -->
    <div @click="$refs.fileInput.click()"
         :class="{
             'border-2 border-dashed border-gray-300 dark:border-gray-600': !isDragging && !isUploading,
             'border-2 border-solid border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging,
             'border-2 border-solid border-gray-300 dark:border-gray-600': isUploading
         }"
         class="relative overflow-hidden rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500">
        
        <!-- Default State -->
        <div x-show="!isDragging && !isUploading && uploadQueue.length === 0" x-transition>
            <svg class="mx-auto h-12 w-12 text-gray-400 transition-transform duration-200 hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {{ __('Click to upload or drag and drop') }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {{ __('PNG, JPG, GIF, WebP up to 100MB') }}
            </p>
        </div>
        
        <!-- Dragging State -->
        <div x-show="isDragging" x-transition>
            <svg class="mx-auto h-12 w-12 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p class="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ __('Drop files here to upload') }}
            </p>
        </div>
        
        <!-- Hidden File Input -->
        <input type="file" 
               x-ref="fileInput" 
               @change="handleFileSelect" 
               multiple 
               accept="image/*"
               class="hidden">
    </div>
    
    <!-- Upload Queue -->
    <div x-show="uploadQueue.length > 0" x-transition class="mt-4 space-y-2">
        <template x-for="(file, index) in uploadQueue" :key="file.id">
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center space-x-4">
                    <!-- Preview -->
                    <div class="flex-shrink-0">
                        <img x-show="file.preview" 
                             :src="file.preview" 
                             class="h-16 w-16 object-cover rounded"
                             :alt="file.name">
                        <div x-show="!file.preview" 
                             class="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    
                    <!-- File Info -->
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" x-text="file.name"></p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            <span x-text="formatFileSize(file.size)"></span>
                            <span x-show="file.status === 'uploading'" class="ml-2">
                                • <span x-text="file.uploadSpeed"></span>
                                • <span x-text="file.timeRemaining"></span>
                            </span>
                        </p>
                        
                        <!-- Progress Bar -->
                        <div x-show="file.status === 'uploading'" class="mt-2">
                            <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                     :style="`width: ${file.progress}%`"></div>
                            </div>
                        </div>
                        
                        <!-- Status Messages -->
                        <div x-show="file.status === 'error'" class="mt-2">
                            <p class="text-sm text-red-600 dark:text-red-400" x-text="file.error"></p>
                            <button @click="retryUpload(index)" 
                                    class="text-sm text-blue-600 hover:text-blue-500 mt-1">
                                {{ __('Retry') }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex-shrink-0">
                        <!-- Uploading -->
                        <div x-show="file.status === 'uploading'" class="flex items-center space-x-2">
                            <span class="text-sm text-gray-500" x-text="`${file.progress}%`"></span>
                            <button @click="cancelUpload(index)" 
                                    class="text-gray-400 hover:text-red-600 transition-colors">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Success -->
                        <div x-show="file.status === 'success'" class="flex items-center space-x-2">
                            <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <button @click="copyLink(file.url)" 
                                    class="text-sm text-blue-600 hover:text-blue-500">
                                {{ __('Copy Link') }}
                            </button>
                        </div>
                        
                        <!-- Error -->
                        <div x-show="file.status === 'error'">
                            <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
    
    <!-- URL Import Modal -->
    <div x-show="showUrlModal" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         @click.away="showUrlModal = false"
         class="fixed inset-0 z-50 overflow-y-auto" 
         style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {{ __('Import from URL') }}
                    </h3>
                    <input type="url" 
                           x-model="importUrl" 
                           @keyup.enter="importFromUrl"
                           placeholder="https://example.com/image.jpg"
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <div class="mt-4 flex justify-end space-x-3">
                        <button @click="showUrlModal = false" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500">
                            {{ __('Cancel') }}
                        </button>
                        <button @click="importFromUrl" 
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            {{ __('Import') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="mt-4 flex items-center justify-center space-x-4">
        <button @click="showUrlModal = true" 
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
            <svg class="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {{ __('Import from URL') }}
        </button>
        
        <button @click="clearQueue" 
                x-show="uploadQueue.length > 0"
                class="text-sm text-red-600 hover:text-red-500">
            <svg class="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {{ __('Clear All') }}
        </button>
    </div>
</div>

@push('scripts')
<script>
function uploadZone() {
    return {
        isDragging: false,
        isUploading: false,
        uploadQueue: [],
        showUrlModal: false,
        importUrl: '',
        uploader: null,
        
        init() {
            this.uploader = new ImageUploader({
                endpoint: '{{ route('api.v1.upload') }}',
                maxConcurrent: 3,
                onProgress: this.handleProgress.bind(this),
                onSuccess: this.handleSuccess.bind(this),
                onError: this.handleError.bind(this)
            });
        },
        
        handleFileSelect(event) {
            const files = Array.from(event.target.files);
            this.addToQueue(files);
            event.target.value = '';
        },
        
        handleDrop(event) {
            this.isDragging = false;
            const files = Array.from(event.dataTransfer.files);
            this.addToQueue(files);
        },
        
        handlePaste(event) {
            const items = event.clipboardData.items;
            const files = [];
            
            for (let item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const file = item.getAsFile();
                    if (file) files.push(file);
                }
            }
            
            if (files.length > 0) {
                this.addToQueue(files);
            }
        },
        
        async addToQueue(files) {
            for (let file of files) {
                // Validate file
                if (!this.validateFile(file)) continue;
                
                const fileData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    name: file.name,
                    size: file.size,
                    status: 'pending',
                    progress: 0,
                    preview: null,
                    url: null,
                    error: null,
                    uploadSpeed: '',
                    timeRemaining: ''
                };
                
                // Generate preview for images
                if (file.type.startsWith('image/')) {
                    fileData.preview = await this.generatePreview(file);
                }
                
                this.uploadQueue.push(fileData);
                this.uploader.addToQueue(fileData);
            }
        },
        
        validateFile(file) {
            const maxSize = 100 * 1024 * 1024; // 100MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            
            if (file.size > maxSize) {
                window.notify('{{ __('Error') }}', '{{ __('File size exceeds 100MB limit') }}', 'error');
                return false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                window.notify('{{ __('Error') }}', '{{ __('Invalid file type') }}', 'error');
                return false;
            }
            
            return true;
        },
        
        generatePreview(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        },
        
        handleProgress(fileData, progress, speed, remaining) {
            const index = this.uploadQueue.findIndex(f => f.id === fileData.id);
            if (index !== -1) {
                this.uploadQueue[index].status = 'uploading';
                this.uploadQueue[index].progress = progress;
                this.uploadQueue[index].uploadSpeed = speed;
                this.uploadQueue[index].timeRemaining = remaining;
            }
        },
        
        handleSuccess(fileData, response) {
            const index = this.uploadQueue.findIndex(f => f.id === fileData.id);
            if (index !== -1) {
                this.uploadQueue[index].status = 'success';
                this.uploadQueue[index].url = response.data.url;
                
                window.notify('{{ __('Success') }}', '{{ __('Image uploaded successfully') }}', 'success');
                
                // Auto copy link
                this.copyLink(response.data.url);
                
                // Emit event for parent components
                this.$dispatch('image-uploaded', response.data);
            }
        },
        
        handleError(fileData, error) {
            const index = this.uploadQueue.findIndex(f => f.id === fileData.id);
            if (index !== -1) {
                this.uploadQueue[index].status = 'error';
                this.uploadQueue[index].error = error;
            }
        },
        
        retryUpload(index) {
            const fileData = this.uploadQueue[index];
            fileData.status = 'pending';
            fileData.progress = 0;
            fileData.error = null;
            this.uploader.retry(fileData);
        },
        
        cancelUpload(index) {
            const fileData = this.uploadQueue[index];
            this.uploader.cancel(fileData);
            this.uploadQueue.splice(index, 1);
        },
        
        async importFromUrl() {
            if (!this.importUrl) return;
            
            try {
                const response = await fetch(this.importUrl);
                const blob = await response.blob();
                const file = new File([blob], this.getFilenameFromUrl(this.importUrl), {
                    type: blob.type
                });
                
                this.addToQueue([file]);
                this.showUrlModal = false;
                this.importUrl = '';
            } catch (error) {
                window.notify('{{ __('Error') }}', '{{ __('Failed to import image from URL') }}', 'error');
            }
        },
        
        getFilenameFromUrl(url) {
            const parts = url.split('/');
            return parts[parts.length - 1] || 'imported-image';
        },
        
        copyLink(url) {
            navigator.clipboard.writeText(url).then(() => {
                window.notify('{{ __('Success') }}', '{{ __('Link copied to clipboard') }}', 'success');
            });
        },
        
        clearQueue() {
            this.uploadQueue = [];
            this.uploader.clearQueue();
        },
        
        formatFileSize(bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Bytes';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        }
    };
}
</script>
@endpush
