<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['status', 'priority_id', 'date_from', 'date_to', 'tag_id']);

        return TaskResource::collection($this->taskService->list($filters));
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->create($request->validated());

        return (new TaskResource($task))
            ->response()
            ->setStatusCode(201);
    }

    public function show(int $id): TaskResource
    {
        return new TaskResource($this->taskService->show($id));
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        return new TaskResource($this->taskService->update($task, $request->validated()));
    }

    public function destroy(Task $task): JsonResponse
    {
        $this->taskService->delete($task);

        return response()->json(null, 204);
    }
}
