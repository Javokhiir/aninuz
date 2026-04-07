<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Catalog extends Model
{
    protected $dates = [
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'title',
        'is_active',
    ];

    // ****** BEGIN Actions ************

    public function getFileAttribute()
    {
        return $this->files->first();
    }

    public function scopeActive($q)
    {
        return $q->where('is_active', true);
    }

    // ****** END Actions ************

    // ****** BEGIN Relations ************

    public function files()
    {
        return $this->morphToMany(
            File::class,
            'entity',
            'entity_has_files'
        )->withPivot('meta');
    }

    // ****** END Relations ************
}
