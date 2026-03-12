<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    seedLookupTables();
});

it('returns all tags', function () {
    $response = $this->getJson('/api/tags');

    $response->assertSuccessful()
        ->assertJsonCount(3);

    $names = collect($response->json())->pluck('name')->sort()->values()->all();
    expect($names)->toBe(['DEV', 'QA', 'RRHH']);
});

it('returns correct structure', function () {
    $response = $this->getJson('/api/tags');

    $response->assertSuccessful()
        ->assertJsonStructure([
            '*' => ['id', 'name', 'created_at', 'updated_at'],
        ]);
});
