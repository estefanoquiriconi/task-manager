<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $tasks = Task::factory()->count(15)->create();

        $tagIds = Tag::pluck('id');

        $tasks->each(function (Task $task) use ($tagIds) {
            $task->tags()->attach($tagIds->random(rand(1, 3)));
        });
    }
}
