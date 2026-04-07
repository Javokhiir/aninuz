<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Support\Str;

class Service extends Model implements TranslatableContract
{
    use Translatable;

    const LEAD_IMAGE = "LEAD_IMAGE";
    protected $translatedAttributes = ['title', 'content'];

    protected $fillable = [
        'slug', 
        'is_active'
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

    public function leadImage()
    {
        return $this->images->where('pivot.meta', self::LEAD_IMAGE)->first();
    }

    // ****** END Actions ************

    // ****** BEGIN Relations ************

    public function images()
    {
        return $this->morphToMany(
            Picture::class,
            'entity',
            'entity_has_images'
        )->withPivot('meta');
    }

    // ****** END Relations ************
}
