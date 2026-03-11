<?php

namespace Database\Seeders;

use App\Enums\PriorityLevel;
use App\Models\Priority;
use Illuminate\Database\Seeder;

class PrioritySeeder extends Seeder
{
    public function run(): void
    {
        foreach (PriorityLevel::cases() as $level) {
            Priority::create(['name' => $level]);
        }
    }
}
