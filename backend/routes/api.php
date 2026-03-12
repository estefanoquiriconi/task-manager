<?php

use App\Http\Controllers\Api\PriorityController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tasks', TaskController::class);
Route::get('priorities', PriorityController::class);
Route::get('tags', TagController::class);
