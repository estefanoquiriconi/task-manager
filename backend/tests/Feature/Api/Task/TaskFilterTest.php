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

it('filters by status', function () {
    Task::factory()->create(['status' => 'pendiente', 'user_id' => $this->user->id]);
    Task::factory()->create(['status' => 'completada', 'user_id' => $this->user->id]);

    $this->getJson('/api/tasks?status=pendiente')
        ->assertSuccessful()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.status', 'pendiente');
});

it('filters by priority_id', function () {
    $priorities = Priority::all();
    Task::factory()->create(['priority_id' => $priorities[0]->id, 'user_id' => $this->user->id]);
    Task::factory()->create(['priority_id' => $priorities[1]->id, 'user_id' => $this->user->id]);

    $this->getJson("/api/tasks?priority_id={$priorities[0]->id}")
        ->assertSuccessful()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.priority.id', $priorities[0]->id);
});

it('filters by date_from', function () {
    Task::factory()->create(['due_date' => '2026-03-10', 'user_id' => $this->user->id]);
    Task::factory()->create(['due_date' => '2026-03-20', 'user_id' => $this->user->id]);

    $this->getJson('/api/tasks?date_from=2026-03-15')
        ->assertSuccessful()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.due_date', '2026-03-20');
});

it('filters by date_to', function () {
    Task::factory()->create(['due_date' => '2026-03-10', 'user_id' => $this->user->id]);
    Task::factory()->create(['due_date' => '2026-03-20', 'user_id' => $this->user->id]);

    $this->getJson('/api/tasks?date_to=2026-03-15')
        ->assertSuccessful()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.due_date', '2026-03-10');
});

it('filters by date range', function () {
    Task::factory()->create(['due_date' => '2026-03-05', 'user_id' => $this->user->id]);
    Task::factory()->create(['due_date' => '2026-03-15', 'user_id' => $this->user->id]);
    Task::factory()->create(['due_date' => '2026-03-25', 'user_id' => $this->user->id]);

    $this->getJson('/api/tasks?date_from=2026-03-10&date_to=2026-03-20')
        ->assertSuccessful()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.due_date', '2026-03-15');
});

it('filters by tag_id', function () {
    $tag = Tag::first();
    $taskWithTag = Task::factory()->create(['user_id' => $this->user->id]);
    $taskWithTag->tags()->attach($tag);
    Task::factory()->create(['user_id' => $this->user->id]);

    $this->getJson("/api/tasks?tag_id={$tag->id}")
        ->assertSuccessful()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $taskWithTag->id);
});

it('returns tasks ordered by latest', function () {
    $old = Task::factory()->create(['title' => 'Old Task', 'created_at' => now()->subMinute(), 'user_id' => $this->user->id]);
    $new = Task::factory()->create(['title' => 'New Task', 'created_at' => now(), 'user_id' => $this->user->id]);

    $this->getJson('/api/tasks')
        ->assertSuccessful()
        ->assertJsonPath('data.0.id', $new->id);
});

it('paginates with 15 per page', function () {
    Task::factory()->count(20)->create(['user_id' => $this->user->id]);

    $page1 = $this->getJson('/api/tasks');
    $page1->assertSuccessful()
        ->assertJsonCount(15, 'data')
        ->assertJsonPath('meta.total', 20);

    $page2 = $this->getJson('/api/tasks?page=2');
    $page2->assertSuccessful()
        ->assertJsonCount(5, 'data');
});

it('does not show tasks from other users', function () {
    $otherUser = \App\Models\User::factory()->create();
    Task::factory()->count(3)->create(['user_id' => $otherUser->id]);
    Task::factory()->count(2)->create(['user_id' => $this->user->id]);

    $this->getJson('/api/tasks')
        ->assertSuccessful()
        ->assertJsonCount(2, 'data');
});
