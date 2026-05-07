<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Mail\AdminPasswordCodeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'about' => $user->about,
            'role' => $user->getRoleNames()->first(),
        ]);
    }

    public function requestPasswordCode(Request $request)
    {
        $cacheKey = 'admin_pwd_code_' . $request->user()->id;

        // Prevent spam: 1 code per 60 seconds
        if (Cache::has($cacheKey . '_lock')) {
            return response()->json([
                'message' => 'Kod allaqachon yuborilgan. Iltimos, 60 soniya kuting.',
            ], 429);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put($cacheKey, Hash::make($code), now()->addMinutes(10));
        Cache::put($cacheKey . '_lock', true, now()->addSeconds(60));

        Mail::to('ceo@anin.uz')->send(
            new AdminPasswordCodeMail($code, $request->user()->email)
        );

        return response()->json([
            'message' => 'Tasdiqlash kodi ceo@anin.uz manziliga yuborildi.',
        ]);
    }

    public function changePasswordWithCode(Request $request)
    {
        $request->validate([
            'code'                  => 'required|string|size:6',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $cacheKey = 'admin_pwd_code_' . $request->user()->id;
        $hashed   = Cache::get($cacheKey);

        if (!$hashed || !Hash::check($request->input('code'), $hashed)) {
            return response()->json([
                'message' => 'Tasdiqlash kodi noto\'g\'ri yoki muddati o\'tgan.',
            ], 422);
        }

        Cache::forget($cacheKey);
        Cache::forget($cacheKey . '_lock');

        $user = $request->user();
        $user->password = Hash::make($request->input('password'));
        $user->save();

        // Revoke all other active tokens for security
        $user->tokens()
            ->where('id', '!=', $request->user()->currentAccessToken()->id)
            ->delete();

        return response()->json(['message' => 'Parol muvaffaqiyatli o\'zgartirildi.']);
    }
}
