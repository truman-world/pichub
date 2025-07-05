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
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('username', 50)->unique()->index();
            $table->string('email', 100)->unique()->index();
            $table->string('password');
            $table->enum('role', ['USER', 'ADMIN'])->default('USER');
            $table->string('api_token', 80)->unique()->nullable();
            $table->bigInteger('storage_used')->default(0);
            $table->bigInteger('storage_limit')->default(1073741824); // 1GB
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes
            $table->index('role');
            $table->index('is_active');
            $table->index(['is_active', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
