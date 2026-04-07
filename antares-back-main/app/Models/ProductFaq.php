<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductFaq extends Model implements TranslatableContract
{
    use Translatable, SoftDeletes;

    public $translatedAttributes = ['title', 'content'];
    protected $fillable = [
        'product_id',
        'is_active',
    ];

    protected $attributes = [
        "is_active" => false
    ];

    // ****** BEGIN Actions ************



    // ****** END Actions ************

    // ****** BEGIN Relations ************

    public function product()
    {
       return $this->belongsTo(Product::class, 'product_id') ;
    }

    // ****** END Relations ************
}
