<?php

namespace App\Models;

use Astrotomic\Translatable\Translatable;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model implements TranslatableContract
{
    use Translatable;

    const TYPE_METRIC = "METRIC";
    const TYPE_IMPERIAL = "IMPERIAL";

    const TYPES = [
        self::TYPE_METRIC,
        self::TYPE_IMPERIAL
    ];

    protected $translatedAttributes = ['title'];

    protected $fillable = [
        'selectable',
        'icon'
    ];

    protected $casts = [
        'selectable' => 'boolean'
    ];

    // ****** BEGIN Actions ************

    public function scopeSelectable($q)
    {
        return $q->where('selectable', true);
    }

    // ****** BEGIN Relations ************

    public function options()
    {
        return $this->hasMany(AttributeOption::class);
    }

    // ****** END Relations ************
}
