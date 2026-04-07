<?php

namespace App\Services;

use App\Jobs\ProcessImage;
use App\Models\Picture;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

class ImageUploadService
{
    public function upload(UploadedFile $uploadedFile, string $config)
    {
        $param = config("image.options." . $config);
        $path = md5(pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME)) . Str::random(20) . time();
        $file = Picture::create([
            'path' => $path . "." . $param['extension'],
            'width' => $param['main_width'],
            'height' => $param['main_height'],
            'preview_path' => $path . "_preview." . $param['extension'],
            "preview_width" => $param['preview_width'],
            'preview_height' => $param['preview_height'],
            'thumb_path' => $path . "_thumb." . $param['extension'],
            'thumb_width' => $param['thumb_width'],
            'thumb_height' => $param['thumb_height'],
            'path_webp' => $path . ".webp",
            'preview_path_webp' => $path . "_preview.webp",
            'extension' => $param['extension'],
            'tmp' => $uploadedFile->store('tmp', 'common')
        ]);
        $this->processImage($file, isset($param['upsize']) ? $param['upsize'] : true);
        return $file;
    }

    public function processImage($instance, $upsize = true)
    {
        $disk = Storage::disk('common');
        Log::info($instance->tmp);
        $image = Image::read($disk->get($instance->tmp));
        // if ($this->upsize) {
        //     $imgRatio = $image->width() / $image->height();
        //     $targetRatio = $this->pictureModel->width / $this->pictureModel->height;
        //     if ($imgRatio > $targetRatio) {
        //         $image->resizeCanvas(floor($image->width()), floor($image->width() / $targetRatio), 'center', false, 'ffffff');
        //     } elseif ($imgRatio < $targetRatio) {
        //         $image->resizeCanvas(floor($image->height() * $targetRatio), floor($image->height()), 'center', false, 'ffffff');
        //     }
        // }
        $image->resize($instance->width, $instance->height);
        $extension = $instance->extension;
        $disk->put($instance->path, $image->encodeByExtension($extension, 100));
        $disk->put($instance->path_webp, $image->encodeByExtension('webp', 100));

        $image->resize($instance->preview_width, $instance->preview_height);
        $disk->put($instance->preview_path, $image->encodeByExtension($extension, 100));
        $disk->put($instance->preview_path_webp, $image->encodeByExtension('webp', 100));

        $image->resize($instance->thumb_width, $instance->thumb_height);
        $disk->put($instance->thumb_path, $image->encodeByExtension($extension), 90);

        $instance->processed_at = now();
        if ($disk->exists($instance->tmp)) {
            $disk->delete($instance->tmp);
            $instance->tmp = null;
        }
        $instance->save();
    }
}