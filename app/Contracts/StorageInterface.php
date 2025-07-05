<?php

namespace App\Contracts;

interface StorageInterface
{
    public function store(string $path, $contents): bool;
    public function get(string $path);
    public function exists(string $path): bool;
    public function delete(string $path): bool;
    public function size(string $path): int;
    public function url(string $path): string;
    public function temporaryUrl(string $path, \DateTimeInterface $expiration): string;
}
