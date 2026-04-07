<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    protected $dates = [
        'created_at',
        'updated_at',
        'processed_at'
    ];

    protected $fillable = [
        'name',
        'mime_type',
        'path',
        'file_hash',
        'size',
    ];

    // ****** BEGIN Actions ************

    public function getIsProcessedAttribute()
    {
        return (bool)$this->processed_at;
    }

    public function getUrlAttribute()
    {
        return self::_makeUrl($this->path);
    }

    private function _makeUrl($path)
    {
        return Storage::disk("common")->url($path);
    }

    // ****** END Actions ************

    // ****** BEGIN Relations ************

    public function loads()
    {
        return $this->morphedByMany(Catalog::class, 'entity', "entity_has_files");
    }

    // ****** END Relations ************
}
