<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create
                            {--email= : Admin email address}
                            {--password= : Admin password}
                            {--name= : Admin display name}
                            {--role=Super Admin : Role to assign}';

    protected $description = 'Create or update a super admin user';

    public function handle(): int
    {
        $email    = $this->option('email')    ?: $this->ask('Email');
        $password = $this->option('password') ?: $this->secret('Password');
        $name     = $this->option('name')     ?: $this->ask('Name', 'Super Admin');
        $role     = $this->option('role');

        $validator = Validator::make(
            ['email' => $email, 'password' => $password, 'name' => $name],
            [
                'email'    => 'required|email',
                'password' => 'required|min:8',
                'name'     => 'required|string',
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name'              => $name,
                'password'          => Hash::make($password),
                'email_verified_at' => now(),
                'is_active'         => true,
            ]
        );

        $user->syncRoles([$role]);

        $action = $user->wasRecentlyCreated ? 'created' : 'updated';
        $this->info("Admin user {$action} successfully.");
        $this->table(['Field', 'Value'], [
            ['Email', $user->email],
            ['Name',  $user->name],
            ['Role',  $role],
        ]);

        return self::SUCCESS;
    }
}
