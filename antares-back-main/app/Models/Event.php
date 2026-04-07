<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Support\Str;

class Event extends Model implements TranslatableContract
{
    use Translatable;

    const LEAD_IMAGE = "LEAD_IMAGE";

    const STATUS_PUBLISHED = "PUBLISHED";
    const STATUS_DRAFT = "DRAFT";

    const STATUSES = [
        self::STATUS_PUBLISHED,
        self::STATUS_DRAFT
    ];
    protected $translatedAttributes = ['title', 'content'];

    protected $fillable = [
        'status', 
        'slug',
        'date',
        'address',
        'published_at'
    ];

    // ****** BEGIN Actions ************

    public static function boot()
    {
        parent::boot();
        self::saving(function (self $instance) {
            $instance->slug = empty($instance->slug) ? Str::slug($instance->translate('en')->title) : $instance->slug;
        });
    }

    public function scopePublished($q)
    {
        return $q->where('status', self::STATUS_PUBLISHED);
    }

    public function leadImage()
    {
        return $this->images->where('pivot.meta', self::LEAD_IMAGE)->first();
    }

    public function statusLabel(): string
    {
        $class = $this->getStatusClassName();
        $status = ucfirst(str_replace("_", " ", $this->status));
        return "<span class='badge text-bg-$class'>{$status}</span>";
    }

    public function getStatusClassName(): string
    {
        $class = "";
        switch ($this->status) {
            case self::STATUS_PUBLISHED:
                $class = "success";
                break;
            case self::STATUS_DRAFT:
                $class = "danger";
                break;
        }
        return $class;
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
