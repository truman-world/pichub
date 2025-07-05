<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Image;
use App\Models\User;

class ImagePolicy
{
    /**
     * Determine whether the user can view the image.
     */
    public function view(User $user, Image $image): bool
    {
        return $user->id === $image->user_id || $image->is_public;
    }

    /**
     * Determine whether the user can update the image.
     */
    public function update(User $user, Image $image): bool
    {
        return $user->id === $image->user_id;
    }

    /**
     * Determine whether the user can delete the image.
     */
    public function delete(User $user, Image $image): bool
    {
        return $user->id === $image->user_id;
    }
}
