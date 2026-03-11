<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\Priority;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Task> */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(TaskStatus::cases()),
            'due_date' => fake()->optional(0.7)->dateTimeBetween('now', '+3 months'),
            'priority_id' => fn () => Priority::query()->inRandomOrder()->value('id'),
        ];
    }
}
