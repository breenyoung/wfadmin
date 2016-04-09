<?php
/**
 * Created by PhpStorm.
 * User: Breen
 * Date: 4/5/2016
 * Time: 7:30 PM
 */

namespace App;

use Illuminate\Support\Facades\File;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class UploadHandler
{
    public function uploadFile(UploadedFile $file, $fileName, $path)
    {
        try
        {
            if ($file->isValid())
            {
                $file->move($path, $fileName);
            }
        }
        catch(\Exception $ex)
        {
            throw $ex;
        }
    }

    public function isImage(UploadedFile $file)
    {
        $result = false;

        $extensions = ['jpg', 'jpeg', 'gif', 'png'];
        $mimeTypes = ['image/jpeg', 'image/jpeg', 'image/gif', 'image/png'];

        $fileExt = $file->getClientOriginalExtension();
        $fileMime = $file->getMimeType();

        if(in_array($fileExt, $extensions, true) && in_array($fileMime, $mimeTypes, true))
        {
            $result = true;
        }

        return $result;
    }

    public function getNewImageExtension($newFile, $oldFile)
    {
        $newPathInfo = pathinfo($newFile);
        $oldPathInfo = pathinfo($oldFile);

        if($newPathInfo['extension'] !== $oldPathInfo['extension'])
        {
            return $oldPathInfo['filename'] . '.' . $newPathInfo['extension'];
        }

        return $oldFile;
    }

    public function removeFile($path, $filename, $ignoreErrors = true)
    {
        try
        {
            File::delete($path . '/' . $filename);
        }
        catch(\Exception $ex)
        {
            if(!$ignoreErrors)
            {
                throw $ex;
            }
        }
    }

    public function generateUniqueFilename($extension)
    {
        return Uuid::uuid4()->toString() . "." . $extension;
    }
}