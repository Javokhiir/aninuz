<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $users = User::orderBy('id', 'desc')->paginate($perPage);
        return response()->json($users);
    }

    public function show(User $user)
    {
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'about' => $user->about,
            'is_active' => $user->is_active,
            'role' => $user->getRoleNames()->first(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string',
            'password' => 'required|min:8',
            'role' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'about' => $request->input('about'),
            'password' => Hash::make($request->input('password')),
            'is_active' => $request->input('is_active', true),
        ]);
        if ($request->has('role')) {
            $user->assignRole($request->input('role'));
        }
        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user->update([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'about' => $request->input('about'),
            'is_active' => $request->input('is_active', $user->is_active),
        ]);
        if ($request->has('role')) {
            $user->syncRoles([$request->input('role')]);
        }
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function profileUpdate(Request $request)
    {
        $user = $request->user();
        $user->name = $request->input('name', $user->name);
        $user->email = $request->input('email', $user->email);
        $user->phone = $request->input('phone', $user->phone);
        $user->about = $request->input('about', $user->about);
        $user->save();
        return response()->json(['message' => 'Profile updated', 'user' => $user]);
    }

    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = $request->user();
        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }
        $user->password = Hash::make($request->input('password'));
        $user->save();
        return response()->json(['message' => 'Password updated']);
    }
}
