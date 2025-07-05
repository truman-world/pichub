@extends('layouts.app')

@section('title', '欢迎使用 PicHub')

@section('content')
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
        <h1 class="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
            新一代智能图床解决方案
        </h1>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            轻量、快速、安全。完全掌控您的数字图像资产。
        </p>
    </div>

    <!-- 上传组件的占位符 -->
    <div class="mt-12 bg-white p-8 rounded-xl shadow-lg border">
        <div class="w-full h-48 flex justify-center items-center border-2 border-dashed border-slate-300 rounded-lg">
            <p class="text-slate-500">上传功能即将上线...</p>
        </div>
    </div>
</div>
@endsection
