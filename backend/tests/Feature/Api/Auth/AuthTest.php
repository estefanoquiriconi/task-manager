<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('registers a new user', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['user' => ['id', 'name', 'email']])
        ->assertJsonMissing(['token']);

    $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
});

it('rejects registration with duplicate email', function () {
    User::factory()->create(['email' => 'john@example.com']);

    $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

it('rejects registration with weak password', function () {
    $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'short',
        'password_confirmation' => 'short',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('password');
});

it('rejects registration without password confirmation', function () {
    $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('password');
});

it('logs in with valid credentials', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $response->assertSuccessful()
        ->assertJsonStructure(['user' => ['id', 'name', 'email']])
        ->assertJsonMissing(['token']);
});

it('rejects login with wrong password', function () {
    User::factory()->create([
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'wrong_password',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

it('rejects login with non-existent email', function () {
    $this->postJson('/api/login', [
        'email' => 'nobody@example.com',
        'password' => 'password123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

it('logs out and invalidates session', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->postJson('/api/logout')
        ->assertNoContent();
});

it('returns current user', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
        ->getJson('/api/user')
        ->assertSuccessful()
        ->assertJsonPath('id', $user->id)
        ->assertJsonPath('email', $user->email);
});

it('returns 401 for unauthenticated request to tasks', function () {
    seedLookupTables();

    $this->getJson('/api/tasks')
        ->assertUnauthorized();
});

it('returns 401 for unauthenticated request to priorities', function () {
    $this->getJson('/api/priorities')
        ->assertUnauthorized();
});
