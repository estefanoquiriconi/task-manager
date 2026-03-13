<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(User $user): void
    {
        $tasks = Task::factory()->count(15)->create(['user_id' => $user->id]);

        $tagIds = Tag::pluck('id');

        $tasks->each(function (Task $task) use ($tagIds) {
            $task->tags()->attach($tagIds->random(rand(1, 3)));
        });
    }
}
