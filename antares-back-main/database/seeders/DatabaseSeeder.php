<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionAndGroupSeeder::class,
        ]);

        User::factory(10)->create();

        if (User::whereEmail('admin@domain.com')->doesntExist()) {
            $user = User::create([
                'name' => 'Admin',
                'email' =>  'admin@domain.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'is_active' => 1
            ]);

            $user->assignRole('Super Admin');
        }
    }
}
