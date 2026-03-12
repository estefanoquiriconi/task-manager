<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const TOKEN_NAME = 'auth-token';

    /**
     * @param  array{name: string, email: string, password: string}  $data
     * @return array{user: User, token: string}
     */
    public function register(array $data): array
    {
        $user = User::create($data);

        return [
            'user' => $user,
            'token' => $this->createToken($user),
        ];
    }

    /**
     * @param  array{email: string, password: string}  $credentials
     * @return array{user: User, token: string}
     */
    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        return [
            'user' => $user,
            'token' => $this->createToken($user),
        ];
    }

    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    private function createToken(User $user): string
    {
        return $user->createToken(self::TOKEN_NAME)->plainTextToken;
    }
}
