<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Picture;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

use function Laravel\Prompts\alert;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy('id', 'desc')->paginate(10);
        return view('admin.pages.user.list', [
            'items' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.user.create', [
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'is_active' => 'nullable|string',
            'password' => 'required|required_with:password_confirmation|same:password_confirmation|min:8',
            'password_confirmation' => 'required|min:8',
            'about' => 'nullable|string',
            'image' => 'nullable',
            'role' => 'nullable|string'
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }
        $user = User::create($this->getMassUpdateFields($request));
        if ($request->has('role')) {
            $user->assignRole($request->input('role'));
        }
        if ($request->hasFile('image')) {
            dd($request->file('image'));
        }
        alert("success", "User was added");
        return redirect(dashboard_route('dashboard.users.index'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return view('admin.pages.user.edit', [
            'item' => $user,
            'user_role' => $user->getRoleNames()->first(),
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'is_active' => 'nullable|string',
            'about' => 'nullable|string',
            'image' => 'nullable',
            'role' => 'nullable|string'
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }
        if ($user) {
            $user->update($this->getMassUpdateFields($request));
            if ($request->has('role')) {
                $user->syncRoles([$request->input('role')]);
            }

            if ($request->hasFile('image')) {
                dd($request->file('image'));
            }
            alert("success", "User was edited");
        } else {
            alert("warning", 'User not found');
        }
        return redirect(dashboard_route('dashboard.users.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user) {
            $user->delete();
            alert("success", "User was deleted");
        } else {
            alert("warning", 'User not found');
        }
        return redirect(dashboard_route('dashboard.users.index'));
    }

    public function profileUpdate(Request $request, User $user) 
    {
        $user->name = $request->input("name");
        $user->email = $request->input("email");
        $user->phone = $request->input("phone");
        $user->save();
        alert("success", "Profile has been updated");
        return redirect(dashboard_route('dashboard.profile'));
    }

    public function userUpdatePassword(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|required_with:password_confirmation|same:password_confirmation|min:8',
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }
        if (Hash::check($request->current_password, $user->password)) {
            $user->password = Hash::make($request->input("password"));
            $user->save();
            alert("success", "Password has been updated");
        } else {
            alert("error", "Password does not match");
        }
        
        return redirect(dashboard_route('dashboard.profile'));
    }

    private function getMassUpdateFields($request)
    {
        return array_merge(
            $request->only(['name', 'phone', 'email', 'about', 'is_active']),
            [
                'password' => Hash::make($request->input('password')),
                'is_active' => $request->filled('is_active') == 'on',
            ]
        );
    }
}
