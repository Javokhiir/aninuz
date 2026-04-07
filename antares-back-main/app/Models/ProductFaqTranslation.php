<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductFaqTranslation extends Model
{
    public $timestamps = false;
    protected $fillable = ['title', 'content'];
}
