<?php

namespace Database\Seeders;

use App\Enums\TagType;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        foreach (TagType::cases() as $type) {
            Tag::create(['name' => $type]);
        }
    }
}
