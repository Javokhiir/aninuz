<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionAndGroupSeeder extends Seeder
{
    const GROUPS_NAME = [
        'Super Admin',
        'Administrator',
    ];

    const PERMS_NAME = [

    ];
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::GROUPS_NAME as $group_name) {
            Role::findOrCreate($group_name);
        }

        foreach (self::PERMS_NAME as $perm_name) {
            Permission::findOrCreate($perm_name);
        }
    }
}
