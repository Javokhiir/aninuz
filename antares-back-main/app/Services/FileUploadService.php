<?php

namespace App\Services;

use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    public function upload(UploadedFile $uploadedFile)
    {
        $name = Str::slug(pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME));
        $ext = $uploadedFile->extension();
        $disk = Storage::disk('common');
        $disk->putFileAs('/files', $uploadedFile, $name.'.'.$ext);
        $fileHash = md5($name) . Str::random(20) . time();
        $file = File::create([
            'name' => $name.'.'.$ext,
            'mime_type' => $uploadedFile->getClientMimeType(),
            'path' => "files/{$name}.{$ext}",
            'file_hash' => $fileHash,
            'size' => $disk->size("files/{$name}.{$ext}")
        ]);
        return $file;
    }
}