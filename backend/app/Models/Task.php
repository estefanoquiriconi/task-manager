<?php

namespace App\Models;

use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
        'priority_id',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'due_date' => 'date',
        ];
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(Priority::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'task_tag');
    }
}
