<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class Picture extends Model
{
    protected $dates = [
        'created_at',
        'updated_at',
        'processed_at'
    ];

    protected $fillable = [
        'path', 'width', 'height',
        'preview_path', 'preview_width', 'preview_height',
        'thumb_path', 'thumb_width', 'thumb_height',
        'path_webp', 'preview_path_webp', 'extra',
        'extension',
        'tmp'
    ];

    /** START ---> Accessors and virtual fields **/

    public function getIsProcessedAttribute()
    {
        return (bool)$this->processed_at;
    }

    public function getUrlAttribute()
    {
        if ($this->processed_at) {
            return self::_makeUrl($this->path);
        }
        return null;
    }

    public function getUrlWebpAttribute()
    {
        if ($this->processed_at) {
            return self::_makeUrl($this->path_webp);
        }
        return null;
    }

    public function getPreviewUrlAttribute()
    {
        return self::_makeUrl($this->preview_path);
    }

    public function getPreviewUrlWebpAttribute()
    {
        return self::_makeUrl($this->preview_path_webp);
    }

    public function getThumbUrlAttribute()
    {
        return self::_makeUrl($this->thumb_path);
    }


    /** Accessors and virtual fields ---> END**/

    private function _makeUrl($path)
    {
        return Storage::disk("common")->url($path);
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'height' => $this->height,
            'width' => $this->width,
            'url' => $this->url,
            'url_webp' => $this->url_webp,
            'preview_url' => $this->preview_url,
            'preview_url_webp' => $this->preview_url_webp,
            'thumb_url' => $this->thumb_url,
        ];
    }
}
