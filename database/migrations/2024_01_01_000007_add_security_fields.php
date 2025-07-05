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
        Schema::table('images', function (Blueprint $table) {
            $table->json('metadata')->nullable()->after('hash');
            $table->json('thumbnails')->nullable()->after('metadata');
            $table->timestamp('optimized_at')->nullable()->after('expires_at');
            
            // Add index for optimized_at
            $table->index('optimized_at');
        });
        
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 50);
            $table->string('model_type', 50)->nullable();
            $table->bigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at');
            
            // Indexes
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
            $table->index('action');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropColumn(['metadata', 'thumbnails', 'optimized_at']);
        });
        
        Schema::dropIfExists('audit_logs');
    }
};
