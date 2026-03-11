<?php

namespace App\Models;

use App\Enums\PriorityLevel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Priority extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'name',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'name' => PriorityLevel::class,
        ];
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
