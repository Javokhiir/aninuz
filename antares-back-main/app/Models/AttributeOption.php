<?php

namespace App\Models;

use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Illuminate\Database\Eloquent\Model;

class AttributeOption extends Model implements TranslatableContract
{
    use Translatable;

    protected $translatedAttributes = ['value'];
    protected $fillable = ['attribute_id'];
    public $timestamps = false;
    public $useTranslationFallback = true;

    // ****** BEGIN Relations ************

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }

    // ****** END Relations ************
}