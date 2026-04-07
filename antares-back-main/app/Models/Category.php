<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Support\Str;

class Category extends Model implements TranslatableContract
{
    use HasFactory, Translatable;

    const LEAD_IMAGE = "LEAD_IMAGE";
    protected $translatedAttributes = ['title', 'content'];

    protected $fillable = [
        'slug',
        'parent_id',
        'order',
        'brand',
        'is_visible',
    ];

    protected $casts = [
        'is_visible' => "boolean"
    ];

    protected $attributes = [
        "is_visible" => false,
    ];

    // ****** BEGIN Actions ************

    public static function boot()
    {
        parent::boot();
        self::saving(function (self $instance) {
            $instance->slug = empty($instance->slug) ? Str::slug($instance->translate('en')->title) : $instance->slug;
        });
    }

    public function parents()
    {
        $ids = [];
        $c = $this;
        while ($c) {
            array_push($ids, $c->id);
            $c = $c->parent;
        }
        return $ids;
    }

    public function scopeTop($q)
    {
        return $q->whereNull('parent_id')->orderBy('order');
    }

    public function scopeVisible($q)
    {
        return $q->where('is_visible', true);
    }

    public function leadImage()
    {
        return $this->images->where('pivot.meta', self::LEAD_IMAGE)->first();
    }

    // ****** END Actions ************

    // ****** BEGIN Relations ************

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id', 'id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id', 'id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_has_categories', 'category_id', 'product_id');
    }

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
