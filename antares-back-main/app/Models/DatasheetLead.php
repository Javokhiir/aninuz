<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * An email captured in exchange for a product datasheet download.
 */
class DatasheetLead extends Model
{
    protected $fillable = [
        'email',
        'product_slug',
        'product_id',
        'locale',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
