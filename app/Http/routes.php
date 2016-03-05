<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::get('/', 'AngularController@serveApp');

Route::get('/test', 'HomeController@testMethod');

Route::group(['prefix' => 'api'], function()
{
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
    Route::post('authenticate', 'AuthenticateController@authenticate');

    Route::resource('product', 'ProductController');
    Route::resource('customer', 'CustomerController');
    Route::resource('workorder', 'WorkOrderController');
    Route::resource('event', 'EventController');
    Route::resource('unit', 'UnitController');
    Route::resource('material', 'MaterialController');

    Route::get('search/{query}', 'SearchController@index');
});

/*
Route::group(['middleware' => 'web'], function () {
    Route::auth();
    Route::get('/data', 'DataController@index');
    //Route::get('/', 'HomeController@index');

});
*/