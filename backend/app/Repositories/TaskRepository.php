<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TaskRepository implements TaskRepositoryInterface
{
    /** @param  array<string, mixed>  $filters */
    public function all(array $filters = []): LengthAwarePaginator
    {
        return Task::query()
            ->with(['priority', 'tags'])
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['priority_id'] ?? null, fn ($query, $priorityId) => $query->where('priority_id', $priorityId))
            ->when($filters['date_from'] ?? null, fn ($query, $dateFrom) => $query->whereDate('due_date', '>=', $dateFrom))
            ->when($filters['date_to'] ?? null, fn ($query, $dateTo) => $query->whereDate('due_date', '<=', $dateTo))
            ->when($filters['tag_id'] ?? null, fn ($query, $tagId) => $query->whereHas('tags', fn ($q) => $q->where('tags.id', $tagId)))
            ->latest()
            ->paginate();
    }

    public function find(int $id): Task
    {
        return Task::with(['priority', 'tags'])->findOrFail($id);
    }

    /** @param  array<string, mixed>  $data */
    public function create(array $data): Task
    {
        return Task::create($data);
    }

    /** @param  array<string, mixed>  $data */
    public function update(Task $task, array $data): Task
    {
        $task->update($data);

        return $task;
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}
