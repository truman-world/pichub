<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'image',
                'max:102400', // 100MB
                'mimes:jpeg,jpg,png,gif,webp,bmp,svg',
            ],
            'hash' => ['nullable', 'string', 'size:64'],
            'name' => ['nullable', 'string', 'max:255'],
            'album_id' => ['nullable', 'exists:albums,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'file.required' => __('Please select a file to upload.'),
            'file.image' => __('The file must be an image.'),
            'file.max' => __('The file size must not exceed 100MB.'),
            'file.mimes' => __('The file must be a valid image format.'),
        ];
    }
}
