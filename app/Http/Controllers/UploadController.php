<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\UploadHandler;

class UploadController extends Controller
{
    protected $uploadHandler;

    /**
     * UploadController constructor.
     */
    public function __construct(UploadHandler $uploadHandler)
    {
        $this->uploadHandler = $uploadHandler;
    }

    public function uploadFile(Request $request)
    {
        if($request->hasFile('file'))
        {
            $returnObj = [];
            try
            {
                if(is_null($request->input('filename')))
                {
                    $ext = $request->file('file')->getClientOriginalExtension();
                    $filename = $this->uploadHandler->generateUniqueFilename($ext);
                }
                else
                {
                    $filename = $request->input('filename');
                }

                $this->uploadHandler->uploadFile($request->file('file'), $filename, public_path(config('app.upload_path')));

                $returnObj['success'] = 1;
                $returnObj['filename'] = $filename;
            }
            catch(\Exception $ex)
            {
                $returnObj['success'] = 0;
                $returnObj['error_message'] = $ex->getMessage();
            }

            return response()->json($returnObj);
        }
    }

    public function deleteFile(Request $request)
    {
        if(!is_null($request->input('filename')))
        {
            $this->uploadHandler->removeFile(public_path(config('app.upload_path')), $request->input('filename'), false);
        }
    }
}
