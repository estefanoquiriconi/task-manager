<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TaskService
{
    public function __construct(
        private TaskRepositoryInterface $repository,
    ) {}

    /** @param  array<string, mixed>  $filters */
    public function list(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->all($filters);
    }

    /** @param  array<string, mixed>  $data */
    public function create(array $data): Task
    {
        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        $data['user_id'] = auth()->id();

        $task = $this->repository->create($data);

        if ($tags !== null) {
            $task->tags()->sync($tags);
        }

        return $task->load(['priority', 'tags']);
    }

    public function show(int $id): Task
    {
        return $this->repository->find($id);
    }

    /** @param  array<string, mixed>  $data */
    public function update(Task $task, array $data): Task
    {
        $hasTags = array_key_exists('tags', $data);
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        $task = $this->repository->update($task, $data);

        if ($hasTags) {
            $task->tags()->sync($tags);
        }

        return $task->load(['priority', 'tags']);
    }

    public function delete(Task $task): void
    {
        $this->repository->delete($task);
    }
}
