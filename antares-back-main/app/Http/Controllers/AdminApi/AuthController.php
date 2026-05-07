<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Mail\AdminPasswordCodeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        /** @var User $user */
        $user  = Auth::user();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->getRoleNames()->first(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user  = $request->user();
        $token = $user->currentAccessToken();

        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'about' => $user->about,
            'role'  => $user->getRoleNames()->first(),
        ]);
    }

    public function requestPasswordCode(Request $request): JsonResponse
    {
        /** @var User $user */
        $user     = $request->user();
        $cacheKey = 'admin_pwd_code_' . $user->id;

        if (Cache::has($cacheKey . '_lock')) {
            return response()->json([
                'message' => 'Kod allaqachon yuborilgan. Iltimos, 60 soniya kuting.',
            ], 429);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put($cacheKey, Hash::make($code), now()->addMinutes(10));
        Cache::put($cacheKey . '_lock', true, now()->addSeconds(60));

        Mail::to('ceo@anin.uz')->send(
            new AdminPasswordCodeMail($code, $user->email)
        );

        return response()->json([
            'message' => 'Tasdiqlash kodi ceo@anin.uz manziliga yuborildi.',
        ]);
    }

    public function changePasswordWithCode(Request $request): JsonResponse
    {
        $request->validate([
            'code'                  => 'required|string|size:6',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        /** @var User $user */
        $user     = $request->user();
        $cacheKey = 'admin_pwd_code_' . $user->id;
        $hashed   = Cache::get($cacheKey);

        if (!$hashed || !Hash::check($request->input('code'), $hashed)) {
            return response()->json([
                'message' => "Tasdiqlash kodi noto'g'ri yoki muddati o'tgan.",
            ], 422);
        }

        Cache::forget($cacheKey);
        Cache::forget($cacheKey . '_lock');

        $user->password = Hash::make($request->input('password'));
        $user->save();

        $currentToken = $user->currentAccessToken();
        $currentId    = $currentToken instanceof PersonalAccessToken ? $currentToken->id : 0;

        $user->tokens()->where('id', '!=', $currentId)->delete();

        return response()->json(['message' => "Parol muvaffaqiyatli o'zgartirildi."]);
    }
}
