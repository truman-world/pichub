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
        Schema::create('images', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename', 100)->unique();
            $table->string('original_name', 255);
            $table->string('path', 500);
            $table->bigInteger('size');
            $table->string('mime_type', 50);
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('hash', 64)->index(); // SHA256
            $table->bigInteger('views')->default(0);
            $table->boolean('is_public')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            // Composite index for user images listing
            $table->index(['user_id', 'created_at']);
            // Index for public images
            $table->index(['is_public', 'created_at']);
            // Index for expired images cleanup
            $table->index('expires_at');
            // Index for mime type filtering
            $table->index('mime_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
