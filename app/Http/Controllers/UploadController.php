<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class UploadController extends Controller
{
    public function uploadFile(Request $request)
    {
        if($request->hasFile('file') && $request->input('id') && $request->input('uploadType'))
        {
            $ext = $request->file('file')->getClientOriginalExtension();

            $request->file('file')->move(public_path(config('app.upload_path')));
        }
    }
}
