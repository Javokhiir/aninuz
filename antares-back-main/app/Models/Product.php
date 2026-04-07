<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model implements TranslatableContract
{
    use Translatable, SoftDeletes;

    const STATUS_ACTIVE = "ACTIVE";
    const STATUS_WAITING_FOR_IMAGES = "WAITING_FOR_IMAGES";
    const STATUS_NOT_MODERATED = "NOT_MODERATED";
    const STATUS_DISABLED = "DISABLED";

    const LEAD_IMAGE = "LEAD_IMAGE";

    const STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_WAITING_FOR_IMAGES,
        self::STATUS_NOT_MODERATED,
        self::STATUS_DISABLED
    ];

    public $translatedAttributes = ['title', 'content', 'table_content', 'table_content_second'];
    protected $fillable = [
        'slug',
        'quantity',
        'status',
        'is_featured',
        'is_new',
        'articul',
        'price',
        'sale_price',
        'brand',
    ];

    protected $attributes = [
        "is_featured" => false,
        "is_new" => false,
        "quantity" => 0,
    ];

    // ****** BEGIN Actions ************

    public static function boot()
    {
        parent::boot();
        self::saving(function (self $instance) {
            $instance->slug = empty($instance->slug) ? Str::slug($instance->translate('en')->title) : $instance->slug;
        });
    }

    public function leadImage()
    {
        $this->loadMissing('images');
        return $this->images->where('pivot.meta', self::LEAD_IMAGE)->first();
    }

    public function getFinalPriceAttribute()
    {
        if ($this->sale_price && $this->sale_price <= $this->price) {
            return $this->sale_price;
        }

        return $this->price;
    }

    public function mainCategory()
     {
         return $this->categories()->doesntHave('children')->first() ?? $this->categories()->first();
     }

    public function scopeActive($q)
    {
        return $q->translated()->where('products.status', self::STATUS_ACTIVE);
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
            case self::STATUS_ACTIVE:
                $class = "success";
                break;
            case self::STATUS_NOT_MODERATED:
            case self::STATUS_WAITING_FOR_IMAGES:
                $class = "warning";
                break;
            case self::STATUS_DISABLED:
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

    public function categories()
    {
        return $this->belongsToMany(Category::class, "product_has_categories", "product_id", "category_id");
    }

    public function attributeOptions()
    {
        return $this->belongsToMany(AttributeOption::class, 'product_has_attribute_option', 'product_id', 'attribute_option_id');
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, "order_has_products", "product_id", "order_id")
            ->withPivot(['quantity', 'price']);
    }

    public function faqs()
    {
        return $this->hasMany(ProductFaq::class, 'product_id');
    }

    // ****** END Relations ************
}
