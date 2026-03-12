<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    seedLookupTables();
    authenticateUser();
});

it('returns all priorities', function () {
    $response = $this->getJson('/api/priorities');

    $response->assertSuccessful()
        ->assertJsonCount(3);

    $names = collect($response->json())->pluck('name')->sort()->values()->all();
    expect($names)->toBe(['ALTA', 'BAJA', 'MEDIA']);
});

it('returns correct structure', function () {
    $response = $this->getJson('/api/priorities');

    $response->assertSuccessful()
        ->assertJsonStructure([
            '*' => ['id', 'name', 'created_at', 'updated_at'],
        ]);
});
