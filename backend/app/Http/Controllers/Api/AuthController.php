<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $auth = $this->authService->register($request->validated());

        return response()->json([
            'user' => new UserResource($auth['user']),
            'token' => $auth['token'],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $auth = $this->authService->login($request->validated());

        return response()->json([
            'user' => new UserResource($auth['user']),
            'token' => $auth['token'],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(null, 204);
    }

    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }
}
