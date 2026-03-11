<?php

namespace App\Models;

use App\Enums\TagType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'name',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'name' => TagType::class,
        ];
    }

    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_tag');
    }
}
