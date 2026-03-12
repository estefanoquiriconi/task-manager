<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

class TagController extends Controller
{
    /** @return Collection<int, Tag> */
    public function __invoke(): Collection
    {
        return Tag::all();
    }
}
