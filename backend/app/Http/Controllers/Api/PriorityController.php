<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Priority;
use Illuminate\Database\Eloquent\Collection;

class PriorityController extends Controller
{
    /** @return Collection<int, Priority> */
    public function __invoke(): Collection
    {
        return Priority::all();
    }
}
