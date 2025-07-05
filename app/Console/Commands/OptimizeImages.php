<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Image;
use App\Services\ImageService;
use Illuminate\Console\Command;

class OptimizeImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize {--limit=100}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize images that haven\'t been optimized yet';

    /**
     * Execute the console command.
     */
    public function handle(ImageService $imageService): int
    {
        $limit = (int) $this->option('limit');
        
        $images = Image::whereNull('optimized_at')
            ->take($limit)
            ->get();
        
        $this->info("Optimizing {$images->count()} images...");
        
        $progressBar = $this->output->createProgressBar($images->count());
        $progressBar->start();
        
        foreach ($images as $image) {
            try {
                $imageService->optimizeImage($image);
                $image->update(['optimized_at' => now()]);
            } catch (\Exception $e) {
                $this->error("\nFailed to optimize image {$image->id}: {$e->getMessage()}");
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->info("\nOptimization complete!");
        
        return Command::SUCCESS;
    }
}
