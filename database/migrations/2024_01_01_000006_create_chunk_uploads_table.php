<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chunk_uploads', function (Blueprint $table) {
            $table->id();
            $table->string('upload_id')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->bigInteger('file_size');
            $table->string('file_type', 50);
            $table->string('hash', 64);
            $table->integer('total_chunks');
            $table->integer('uploaded_chunks')->default(0);
            $table->json('chunk_data');
            $table->timestamp('expires_at');
            $table->timestamps();
            
            $table->index(['user_id', 'created_at']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chunk_uploads');
    }
};
