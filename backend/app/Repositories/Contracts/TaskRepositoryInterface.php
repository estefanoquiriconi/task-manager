<?php

namespace App\Repositories\Contracts;

use App\Models\Task;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TaskRepositoryInterface
{
    /** @param  array<string, mixed>  $filters */
    public function all(array $filters = []): LengthAwarePaginator;

    public function find(int $id): Task;

    /** @param  array<string, mixed>  $data */
    public function create(array $data): Task;

    /** @param  array<string, mixed>  $data */
    public function update(Task $task, array $data): Task;

    public function delete(Task $task): void;
}
