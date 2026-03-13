<?php

use App\Models\Priority;
use App\Models\Tag;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    seedLookupTables();
    $this->user = authenticateUser();
});

it('returns a paginated list of tasks', function () {
    Task::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = $this->getJson('/api/tasks');

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'title', 'description', 'status', 'due_date', 'priority', 'tags', 'created_at', 'updated_at'],
            ],
            'links',
            'meta',
        ])
        ->assertJsonCount(3, 'data');
});

it('returns an empty paginated list when no tasks exist', function () {
    $response = $this->getJson('/api/tasks');

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data');
});

it('creates a task without tags', function () {
    $priority = Priority::first();

    $response = $this->postJson('/api/tasks', [
        'title' => 'New Task',
        'status' => 'pendiente',
        'priority_id' => $priority->id,
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.title', 'New Task')
        ->assertJsonPath('data.status', 'pendiente')
        ->assertJsonCount(0, 'data.tags');

    $this->assertDatabaseHas('tasks', ['title' => 'New Task', 'user_id' => $this->user->id]);
});

it('creates a task with tags', function () {
    $priority = Priority::first();
    $tags = Tag::take(2)->pluck('id')->toArray();

    $response = $this->postJson('/api/tasks', [
        'title' => 'Tagged Task',
        'status' => 'pendiente',
        'priority_id' => $priority->id,
        'tags' => $tags,
    ]);

    $response->assertCreated()
        ->assertJsonCount(2, 'data.tags');

    $task = Task::first();
    expect($task->tags)->toHaveCount(2);
});

it('shows a single task with relations', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);
    $tag = Tag::first();
    $task->tags()->attach($tag);

    $response = $this->getJson("/api/tasks/{$task->id}");

    $response->assertSuccessful()
        ->assertJsonPath('data.id', $task->id)
        ->assertJsonStructure([
            'data' => ['id', 'title', 'priority' => ['id', 'name'], 'tags'],
        ])
        ->assertJsonCount(1, 'data.tags');
});

it('returns 404 for a non-existent task', function () {
    $response = $this->getJson('/api/tasks/9999');

    $response->assertNotFound();
});

it('updates a task title only', function () {
    $task = Task::factory()->create(['title' => 'Original Title', 'user_id' => $this->user->id]);

    $response = $this->putJson("/api/tasks/{$task->id}", [
        'title' => 'Updated Title',
    ]);

    $response->assertSuccessful()
        ->assertJsonPath('data.title', 'Updated Title')
        ->assertJsonPath('data.status', $task->status->value);
});

it('clears tags when empty array is sent', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);
    $task->tags()->attach(Tag::take(2)->pluck('id'));

    $response = $this->putJson("/api/tasks/{$task->id}", [
        'tags' => [],
    ]);

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data.tags');

    expect($task->fresh()->tags)->toHaveCount(0);
});

it('preserves tags when key is absent', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);
    $task->tags()->attach(Tag::take(2)->pluck('id'));

    $response = $this->putJson("/api/tasks/{$task->id}", [
        'title' => 'Changed Title',
    ]);

    $response->assertSuccessful()
        ->assertJsonCount(2, 'data.tags');
});

it('soft deletes a task', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);

    $response = $this->deleteJson("/api/tasks/{$task->id}");

    $response->assertNoContent();
    $this->assertSoftDeleted('tasks', ['id' => $task->id]);
});

it('excludes soft-deleted tasks from index and show', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);
    $task->delete();

    $this->getJson('/api/tasks')
        ->assertSuccessful()
        ->assertJsonCount(0, 'data');

    $this->getJson("/api/tasks/{$task->id}")
        ->assertNotFound();
});

it('cannot access another user\'s tasks', function () {
    $otherUser = \App\Models\User::factory()->create();
    $task = Task::factory()->create(['user_id' => $otherUser->id]);

    $this->getJson('/api/tasks')
        ->assertSuccessful()
        ->assertJsonCount(0, 'data');

    $this->getJson("/api/tasks/{$task->id}")
        ->assertNotFound();

    $this->putJson("/api/tasks/{$task->id}", ['title' => 'Hacked'])
        ->assertNotFound();

    $this->deleteJson("/api/tasks/{$task->id}")
        ->assertNotFound();
});
