<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Support\Str;

class Brand extends Model implements TranslatableContract
{
    use Translatable;

    protected $translatedAttributes = ['title', 'content'];

    protected $fillable = [
        'slug',
        'color', 
        'svg',
        'is_active',
    ];

    protected $casts = [
        'is_active' => "boolean"
    ];

    protected $attributes = [
        "is_active" => false,
    ];

    // ****** BEGIN Actions ************

    public static function boot()
    {
        parent::boot();
        self::saving(function (self $instance) {
            $instance->slug = empty($instance->slug) ? Str::slug($instance->translate('en')->title) : $instance->slug;
        });
    }

    public function scopeActive($q)
    {
        return $q->where('is_active', true);
    }

    // ****** END Actions ************

    // ****** BEGIN Relations ************



    // ****** END Relations ************
}
