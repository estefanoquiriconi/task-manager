<?php

use App\Models\Priority;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    seedLookupTables();
    $this->user = authenticateUser();
});

// --- Store (POST) ---

it('requires title', function () {
    $this->postJson('/api/tasks', [
        'status' => 'pendiente',
        'priority_id' => Priority::first()->id,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('requires status', function () {
    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'priority_id' => Priority::first()->id,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});

it('requires priority_id', function () {
    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'status' => 'pendiente',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('priority_id');
});

it('rejects title longer than 255 chars', function () {
    $this->postJson('/api/tasks', [
        'title' => str_repeat('a', 256),
        'status' => 'pendiente',
        'priority_id' => Priority::first()->id,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('title');
});

it('rejects invalid status', function () {
    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'status' => 'invalid_status',
        'priority_id' => Priority::first()->id,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});

it('rejects non-existent priority_id', function () {
    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'status' => 'pendiente',
        'priority_id' => 9999,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('priority_id');
});

it('rejects past due_date', function () {
    $this->travelTo(now());

    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'status' => 'pendiente',
        'priority_id' => Priority::first()->id,
        'due_date' => now()->subDay()->toDateString(),
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('due_date');
});

it('accepts due_date equal to today', function () {
    $this->travelTo(now());

    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'status' => 'pendiente',
        'priority_id' => Priority::first()->id,
        'due_date' => now()->toDateString(),
    ])->assertCreated();
});

it('rejects non-existent tag ids', function () {
    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'status' => 'pendiente',
        'priority_id' => Priority::first()->id,
        'tags' => [9999],
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('tags.0');
});

it('accepts null description and due_date', function () {
    $this->postJson('/api/tasks', [
        'title' => 'A Task',
        'status' => 'pendiente',
        'priority_id' => Priority::first()->id,
        'description' => null,
        'due_date' => null,
    ])->assertCreated();
});

// --- Update (PUT) ---

it('allows partial update without required fields', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);

    $this->putJson("/api/tasks/{$task->id}", [
        'title' => 'Only Title',
    ])->assertSuccessful()
        ->assertJsonPath('data.title', 'Only Title');
});

it('rejects invalid status on update', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);

    $this->putJson("/api/tasks/{$task->id}", [
        'status' => 'invalid_status',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});

it('rejects non-existent priority_id on update', function () {
    $task = Task::factory()->create(['user_id' => $this->user->id]);

    $this->putJson("/api/tasks/{$task->id}", [
        'priority_id' => 9999,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('priority_id');
});

it('rejects past due_date on update', function () {
    $this->travelTo(now());

    $task = Task::factory()->create(['user_id' => $this->user->id]);

    $this->putJson("/api/tasks/{$task->id}", [
        'due_date' => now()->subDay()->toDateString(),
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('due_date');
});
