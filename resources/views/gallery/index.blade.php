@extends('layouts.app')

@section('title', __('Gallery'))

@section('content')
<div x-data="galleryManager()" x-init="init()" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with Actions -->
    <div class="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="py-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {{ __('My Gallery') }}
                    </h1>
                    
                    <!-- View Toggle -->
                    <div class="flex items-center space-x-4">
                        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button @click="viewMode = 'grid'" 
                                    :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''"
                                    class="px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                </svg>
                            </button>
                            <button @click="viewMode = 'list'" 
                                    :class="viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''"
                                    class="px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 transition-all">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Filter Toggle -->
                        <button @click="showFilters = !showFilters" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                            </svg>
                            {{ __('Filters') }}
                            <span x-show="activeFiltersCount > 0" class="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full" x-text="activeFiltersCount"></span>
                        </button>
                    </div>
                </div>
                
                <!-- Batch Actions Bar -->
                <div x-show="selectedImages.length > 0" x-transition class="mt-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div class="flex items-center space-x-4">
                        <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                            <span x-text="selectedImages.length"></span> {{ __('images selected') }}
                        </span>
                        
                        <button @click="selectAll" class="text-sm text-blue-600 hover:text-blue-500">
                            {{ __('Select All') }}
                        </button>
                        
                        <button @click="deselectAll" class="text-sm text-blue-600 hover:text-blue-500">
                            {{ __('Deselect All') }}
                        </button>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button @click="batchDownload" 
                                class="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600">
                            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                            </svg>
                            {{ __('Download') }}
                        </button>
                        
                        <button @click="showMoveToAlbumModal = true" 
                                class="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600">
                            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            {{ __('Move to Album') }}
                        </button>
                        
                        <button @click="confirmBatchDelete" 
                                class="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">
                            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            {{ __('Delete') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex gap-6">
            <!-- Filters Sidebar -->
            <aside x-show="showFilters" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 -translate-x-4" x-transition:enter-end="opacity-100 translate-x-0" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100 translate-x-0" x-transition:leave-end="opacity-0 -translate-x-4" class="w-64 flex-shrink-0">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ __('Filters') }}</h3>
                    
                    <!-- Date Range -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Date Range') }}
                        </label>
                        <div class="space-y-2">
                            <input type="date" x-model="filters.dateFrom" @change="applyFilters" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300">
                            <input type="date" x-model="filters.dateTo" @change="applyFilters" 
                                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300">
                        </div>
                    </div>
                    
                    <!-- File Type -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('File Type') }}
                        </label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" x-model="filters.types" value="jpeg" @change="applyFilters" 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">JPEG</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" x-model="filters.types" value="png" @change="applyFilters" 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">PNG</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" x-model="filters.types" value="gif" @change="applyFilters" 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">GIF</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" x-model="filters.types" value="webp" @change="applyFilters" 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">WebP</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Size Range -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Size Range') }}
                        </label>
                        <div class="space-y-2">
                            <select x-model="filters.sizeRange" @change="applyFilters" 
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300">
                                <option value="">{{ __('All Sizes') }}</option>
                                <option value="0-1">{{ __('< 1MB') }}</option>
                                <option value="1-5">{{ __('1MB - 5MB') }}</option>
                                <option value="5-10">{{ __('5MB - 10MB') }}</option>
                                <option value="10-50">{{ __('10MB - 50MB') }}</option>
                                <option value="50+">{{ __('> 50MB') }}</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Albums -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ __('Album') }}
                        </label>
                        <select x-model="filters.albumId" @change="applyFilters" 
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300">
                            <option value="">{{ __('All Albums') }}</option>
                            <template x-for="album in albums" :key="album.id">
                                <option :value="album.id" x-text="album.name"></option>
                            </template>
                        </select>
                    </div>
                    
                    <!-- Clear Filters -->
                    <button @click="clearFilters" 
                            class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                        {{ __('Clear Filters') }}
                    </button>
                </div>
            </aside>
            
            <!-- Main Content -->
            <main class="flex-1">
                <!-- Loading State -->
                <div x-show="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <template x-for="i in 12">
                        <div class="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </template>
                </div>
                
                <!-- Grid View -->
                <div x-show="!loading && viewMode === 'grid'" 
                     x-ref="imageGrid"
                     class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                     x-init="initMasonry()">
                    <template x-for="image in images" :key="image.id">
                        <div class="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
                             :class="selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''"
                             @click="viewMode === 'grid' && !$event.target.closest('.image-actions') ? toggleSelection(image.id) : null">
                            
                            <!-- Image -->
                            <img :src="image.thumbnail_url" 
                                 :alt="image.original_name"
                                 loading="lazy"
                                 class="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105"
                                 @click="!selectedImages.length && openLightbox(image)">
                            
                            <!-- Selection Checkbox -->
                            <div class="absolute top-2 left-2">
                                <input type="checkbox" 
                                       :checked="selectedImages.includes(image.id)"
                                       @click.stop="toggleSelection(image.id)"
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm">
                            </div>
                            
                            <!-- Hover Overlay -->
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-end">
                                <div class="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                    <p class="text-white text-sm font-medium truncate" x-text="image.original_name"></p>
                                    <p class="text-gray-300 text-xs" x-text="image.human_size + ' • ' + image.dimensions"></p>
                                    
                                    <!-- Quick Actions -->
                                    <div class="image-actions flex items-center space-x-2 mt-2">
                                        <button @click.stop="copyLink(image.url)" 
                                                class="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                                title="{{ __('Copy Link') }}">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                            </svg>
                                        </button>
                                        
                                        <button @click.stop="openCodeGenerator(image)" 
                                                class="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                                title="{{ __('Generate Code') }}">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                            </svg>
                                        </button>
                                        
                                        <button @click.stop="editImage(image)" 
                                                class="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                                title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        
                                        <button @click.stop="deleteImage(image)" 
                                                class="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                                title="{{ __('Delete') }}">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                
                <!-- List View -->
                <div x-show="!loading && viewMode === 'list'" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th class="px-6 py-3 text-left">
                                    <input type="checkbox" @change="$event.target.checked ? selectAll() : deselectAll()" 
                                           class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {{ __('Preview') }}
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {{ __('Name') }}
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {{ __('Size') }}
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {{ __('Type') }}
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {{ __('Uploaded') }}
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {{ __('Views') }}
                                </th>
                                <th class="relative px-6 py-3">
                                    <span class="sr-only">{{ __('Actions') }}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <template x-for="image in images" :key="image.id">
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" 
                                               :checked="selectedImages.includes(image.id)"
                                               @change="toggleSelection(image.id)"
                                               class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <img :src="image.thumbnail_url" 
                                             :alt="image.original_name"
                                             class="h-10 w-10 rounded object-cover cursor-pointer"
                                             @click="openLightbox(image)">
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100" x-text="image.original_name"></div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400" x-text="image.dimensions"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" x-text="image.human_size"></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" x-text="image.mime_type"></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" x-text="formatDate(image.created_at)"></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" x-text="image.views"></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex items-center justify-end space-x-2">
                                            <button @click="copyLink(image.url)" 
                                                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                    title="{{ __('Copy Link') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                </svg>
                                            </button>
                                            <button @click="openCodeGenerator(image)" 
                                                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                    title="{{ __('Generate Code') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                                </svg>
                                            </button>
                                            <button @click="deleteImage(image)" 
                                                    class="text-red-400 hover:text-red-600"
                                                    title="{{ __('Delete') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
                
                <!-- Empty State -->
                <div x-show="!loading && images.length === 0" class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{{ __('No images') }}</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ __('Get started by uploading your first image.') }}</p>
                    <div class="mt-6">
                        <a href="{{ route('upload') }}" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            {{ __('Upload Image') }}
                        </a>
                    </div>
                </div>
                
                <!-- Load More -->
                <div x-show="hasMore && !loading" x-intersect="loadMore" class="text-center py-8">
                    <button @click="loadMore" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8l-8 8-8-8"></path>
                        </svg>
                        {{ __('Load More') }}
                    </button>
                </div>
            </main>
        </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div x-show="lightboxImage" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         @click="closeLightbox"
         @keydown.escape.window="closeLightbox"
         class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
         style="display: none;">
        <button @click="closeLightbox" class="absolute top-4 right-4 text-white hover:text-gray-300">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
        
        <img x-show="lightboxImage" 
             :src="lightboxImage?.url" 
             :alt="lightboxImage?.original_name"
             class="max-w-full max-h-full object-contain"
             @click.stop>
        
        <!-- Image Info -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div class="text-white">
                <h3 class="text-lg font-semibold" x-text="lightboxImage?.original_name"></h3>
                <p class="text-sm opacity-75">
                    <span x-text="lightboxImage?.human_size"></span> • 
                    <span x-text="lightboxImage?.dimensions"></span> • 
                    <span x-text="lightboxImage?.views + ' views'"></span>
                </p>
            </div>
        </div>
    </div>
    
    <!-- Code Generator Modal -->
    <div x-show="codeGeneratorImage" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         @click.away="closeCodeGenerator"
         class="fixed inset-0 z-50 overflow-y-auto"
         style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {{ __('Embed Code Generator') }}
                    </h3>
                </div>
                
                <div class="p-6">
                    <!-- Format Tabs -->
                    <div class="flex space-x-1 mb-4">
                        <button @click="codeFormat = 'url'" 
                                :class="codeFormat === 'url' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'"
                                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            URL
                        </button>
                        <button @click="codeFormat = 'html'" 
                                :class="codeFormat === 'html' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'"
                                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            HTML
                        </button>
                        <button @click="codeFormat = 'markdown'" 
                                :class="codeFormat === 'markdown' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'"
                                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            Markdown
                        </button>
                        <button @click="codeFormat = 'bbcode'" 
                                :class="codeFormat === 'bbcode' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'"
                                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            BBCode
                        </button>
                        <button @click="codeFormat = 'rst'" 
                                :class="codeFormat === 'rst' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'"
                                class="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            RST
                        </button>
                    </div>
                    
                    <!-- Options -->
                    <div class="mb-4 space-y-3">
                        <div class="flex items-center space-x-4">
                            <label class="flex items-center">
                                <input type="checkbox" x-model="codeOptions.useThumbnail" @change="generateCode"
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ __('Use thumbnail') }}</span>
                            </label>
                            
                            <label class="flex items-center">
                                <input type="checkbox" x-model="codeOptions.includeLink" @change="generateCode"
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ __('Include link') }}</span>
                            </label>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <label class="text-sm text-gray-700 dark:text-gray-300">{{ __('Size') }}:</label>
                            <select x-model="codeOptions.size" @change="generateCode"
                                    class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300">
                                <option value="original">{{ __('Original') }}</option>
                                <option value="large">{{ __('Large (600px)') }}</option>
                                <option value="medium">{{ __('Medium (300px)') }}</option>
                                <option value="small">{{ __('Small (150px)') }}</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Code Output -->
                    <div class="relative">
                        <textarea readonly
                                  x-model="generatedCode"
                                  class="w-full h-32 px-3 py-2 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                  @click="$event.target.select()"></textarea>
                        
                        <button @click="copyCode" 
                                class="absolute top-2 right-2 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                            {{ __('Copy') }}
                        </button>
                    </div>
                    
                    <!-- Preview -->
                    <div class="mt-4">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ __('Preview') }}:</h4>
                        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-md" x-html="codePreview"></div>
                    </div>
                </div>
                
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end">
                    <button @click="closeCodeGenerator" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500">
                        {{ __('Close') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Move to Album Modal -->
    <div x-show="showMoveToAlbumModal" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         @click.away="showMoveToAlbumModal = false"
         class="fixed inset-0 z-50 overflow-y-auto"
         style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {{ __('Move to Album') }}
                    </h3>
                    
                    <select x-model="targetAlbumId" 
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300">
                        <option value="">{{ __('Select Album') }}</option>
                        <template x-for="album in albums" :key="album.id">
                            <option :value="album.id" x-text="album.name"></option>
                        </template>
                    </select>
                    
                    <div class="mt-6 flex justify-end space-x-3">
                        <button @click="showMoveToAlbumModal = false" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500">
                            {{ __('Cancel') }}
                        </button>
                        <button @click="batchMoveToAlbum" 
                                :disabled="!targetAlbumId"
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ __('Move') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
<script>
function galleryManager() {
    return {
        images: [],
        albums: [],
        selectedImages: [],
        loading: false,
        hasMore: true,
        page: 1,
        viewMode: 'grid',
        showFilters: false,
        filters: {
            dateFrom: '',
            dateTo: '',
            types: [],
            sizeRange: '',
            albumId: ''
        },
        activeFiltersCount: 0,
        lightboxImage: null,
        codeGeneratorImage: null,
        codeFormat: 'url',
        codeOptions: {
            useThumbnail: false,
            includeLink: true,
            size: 'original'
        },
        generatedCode: '',
        codePreview: '',
        showMoveToAlbumModal: false,
        targetAlbumId: '',
        masonry: null,
        
        async init() {
            await this.loadImages();
            await this.loadAlbums();
            this.calculateActiveFilters();
            
            // Initialize infinite scroll
            this.initInfiniteScroll();
        },
        
        async loadImages(append = false) {
            this.loading = true;
            
            try {
                const params = new URLSearchParams({
                    page: this.page,
                    ...this.filters
                });
                
                const response = await fetch(`/api/v1/images?${params}`);
                const data = await response.json();
                
                if (append) {
                    this.images.push(...data.data);
                } else {
                    this.images = data.data;
                }
                
                this.hasMore = data.meta.current_page < data.meta.last_page;
                
                // Reinitialize masonry after images load
                this.$nextTick(() => {
                    if (this.viewMode === 'grid' && this.masonry) {
                        this.masonry.reloadItems();
                        this.masonry.layout();
                    }
                });
                
            } catch (error) {
                console.error('Failed to load images:', error);
                window.notify('{{ __('Error') }}', '{{ __('Failed to load images') }}', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        async loadAlbums() {
            try {
                const response = await fetch('/api/v1/albums');
                const data = await response.json();
                this.albums = data.data;
            } catch (error) {
                console.error('Failed to load albums:', error);
            }
        },
        
        initMasonry() {
            this.$nextTick(() => {
                if (this.$refs.imageGrid) {
                    this.masonry = new Masonry(this.$refs.imageGrid, {
                        itemSelector: '.grid > div',
                        columnWidth: '.grid > div',
                        percentPosition: true
                    });
                }
            });
        },
        
        initInfiniteScroll() {
            // Intersection Observer for infinite scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && this.hasMore && !this.loading) {
                        this.loadMore();
                    }
                });
            });
            
            // Observe the load more trigger element
            this.$nextTick(() => {
                const trigger = document.querySelector('[x-intersect]');
                if (trigger) {
                    observer.observe(trigger);
                }
            });
        },
        
        async loadMore() {
            if (!this.hasMore || this.loading) return;
            
            this.page++;
            await this.loadImages(true);
        },
        
        async applyFilters() {
            this.page = 1;
            this.selectedImages = [];
            await this.loadImages();
            this.calculateActiveFilters();
        },
        
        clearFilters() {
            this.filters = {
                dateFrom: '',
                dateTo: '',
                types: [],
                sizeRange: '',
                albumId: ''
            };
            this.applyFilters();
        },
        
        calculateActiveFilters() {
            let count = 0;
            if (this.filters.dateFrom || this.filters.dateTo) count++;
            if (this.filters.types.length > 0) count++;
            if (this.filters.sizeRange) count++;
            if (this.filters.albumId) count++;
            this.activeFiltersCount = count;
        },
        
        toggleSelection(imageId) {
            const index = this.selectedImages.indexOf(imageId);
            if (index > -1) {
                this.selectedImages.splice(index, 1);
            } else {
                this.selectedImages.push(imageId);
            }
        },
        
        selectAll() {
            this.selectedImages = this.images.map(img => img.id);
        },
        
        deselectAll() {
            this.selectedImages = [];
        },
        
        openLightbox(image) {
            this.lightboxImage = image;
            document.body.style.overflow = 'hidden';
        },
        
        closeLightbox() {
            this.lightboxImage = null;
            document.body.style.overflow = '';
        },
        
        openCodeGenerator(image) {
            this.codeGeneratorImage = image;
            this.generateCode();
        },
        
        closeCodeGenerator() {
            this.codeGeneratorImage = null;
        },
        
        generateCode() {
            if (!this.codeGeneratorImage) return;
            
            const img = this.codeGeneratorImage;
            const url = this.codeOptions.useThumbnail ? img.thumbnail_url : img.url;
            const fullUrl = img.url;
            
            switch (this.codeFormat) {
                case 'url':
                    this.generatedCode = url;
                    this.codePreview = `<img src="${url}" alt="${img.original_name}" style="max-width: 100%;">`;
                    break;
                    
                case 'html':
                    if (this.codeOptions.includeLink) {
                        this.generatedCode = `<a href="${fullUrl}"><img src="${url}" alt="${img.original_name}"></a>`;
                    } else {
                        this.generatedCode = `<img src="${url}" alt="${img.original_name}">`;
                    }
                    this.codePreview = this.generatedCode;
                    break;
                    
                case 'markdown':
                    if (this.codeOptions.includeLink) {
                        this.generatedCode = `[![${img.original_name}](${url})](${fullUrl})`;
                    } else {
                        this.generatedCode = `![${img.original_name}](${url})`;
                    }
                    this.codePreview = `<img src="${url}" alt="${img.original_name}" style="max-width: 100%;">`;
                    break;
                    
                case 'bbcode':
                    if (this.codeOptions.includeLink) {
                        this.generatedCode = `[url=${fullUrl}][img]${url}[/img][/url]`;
                    } else {
                        this.generatedCode = `[img]${url}[/img]`;
                    }
                    this.codePreview = `<img src="${url}" alt="${img.original_name}" style="max-width: 100%;">`;
                    break;
                    
                case 'rst':
                    this.generatedCode = `.. image:: ${url}\n   :alt: ${img.original_name}`;
                    if (this.codeOptions.includeLink) {
                        this.generatedCode += `\n   :target: ${fullUrl}`;
                    }
                    this.codePreview = `<img src="${url}" alt="${img.original_name}" style="max-width: 100%;">`;
                    break;
            }
        },
        
        copyCode() {
            navigator.clipboard.writeText(this.generatedCode).then(() => {
                window.notify('{{ __('Success') }}', '{{ __('Code copied to clipboard') }}', 'success');
            });
        },
        
        copyLink(url) {
            navigator.clipboard.writeText(url).then(() => {
                window.notify('{{ __('Success') }}', '{{ __('Link copied to clipboard') }}', 'success');
            });
        },
        
        async deleteImage(image) {
            if (!confirm('{{ __('Are you sure you want to delete this image?') }}')) {
                return;
            }
            
            try {
                const response = await fetch(`/api/v1/images/${image.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    this.images = this.images.filter(img => img.id !== image.id);
                    window.notify('{{ __('Success') }}', '{{ __('Image deleted successfully') }}', 'success');
                } else {
                    throw new Error('Failed to delete image');
                }
            } catch (error) {
                window.notify('{{ __('Error') }}', '{{ __('Failed to delete image') }}', 'error');
            }
        },
        
        async confirmBatchDelete() {
            if (!confirm(`{{ __('Are you sure you want to delete :count images?', ['count' => '${this.selectedImages.length}']) }}`)) {
                return;
            }
            
            try {
                const response = await fetch('/api/v1/images/batch-delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        ids: this.selectedImages
                    })
                });
                
                if (response.ok) {
                    this.images = this.images.filter(img => !this.selectedImages.includes(img.id));
                    this.selectedImages = [];
                    window.notify('{{ __('Success') }}', '{{ __('Images deleted successfully') }}', 'success');
                } else {
                    throw new Error('Failed to delete images');
                }
            } catch (error) {
                window.notify('{{ __('Error') }}', '{{ __('Failed to delete images') }}', 'error');
            }
        },
        
        async batchDownload() {
            try {
                const response = await fetch('/api/v1/images/batch-download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        ids: this.selectedImages
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    window.location.href = data.download_url;
                } else {
                    throw new Error('Failed to prepare download');
                }
            } catch (error) {
                window.notify('{{ __('Error') }}', '{{ __('Failed to prepare download') }}', 'error');
            }
        },
        
        async batchMoveToAlbum() {
            if (!this.targetAlbumId) return;
            
            try {
                const response = await fetch('/api/v1/images/batch-move', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        ids: this.selectedImages,
                        album_id: this.targetAlbumId
                    })
                });
                
                if (response.ok) {
                    this.showMoveToAlbumModal = false;
                    this.targetAlbumId = '';
                    this.selectedImages = [];
                    window.notify('{{ __('Success') }}', '{{ __('Images moved to album successfully') }}', 'success');
                } else {
                    throw new Error('Failed to move images');
                }
            } catch (error) {
                window.notify('{{ __('Error') }}', '{{ __('Failed to move images') }}', 'error');
            }
        },
        
        editImage(image) {
            // TODO: Implement edit functionality
            console.log('Edit image:', image);
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        }
    };
}
</script>
@endpush
@endsection
