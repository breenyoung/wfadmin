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

//Route::get('/test', 'HomeController@testMethod');
Route::get('/test', 'HomeController@scheduleTest');
Route::get('/shopsy', 'HomeController@shopifyTest');
Route::get('/etsy', 'HomeController@etsyTest');
Route::match(['get', 'post'], '/print', 'PrintController@index');

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
    Route::resource('purchaseorder', 'PurchaseOrderController');
    Route::resource('paymenttype', 'PaymentTypeController');
    Route::resource('materialtype', 'MaterialTypeController');
    Route::resource('bookeddate', 'BookedDateController');
    Route::resource('saleschannel', 'SalesChannelController');
    Route::resource('workordertask', 'WorkOrderTaskController');

    Route::get('search/{query}', 'SearchController@index');

    Route::post('scheduler/getWorkOrders', 'SchedulerController@determineWorkOrders');
    Route::post('scheduler/restoreStockForProduct', 'SchedulerController@restoreStockForProduct');
    Route::get('scheduler/getFullyBookedDays', 'SchedulerController@getFullyBookedDays');
    Route::get('scheduler/getFutureWorkOrders', 'SchedulerController@getFutureWorkOrders');

    Route::post('reports/getSalesReport', 'ReportController@getSalesReport');
    Route::post('reports/getMonthlySalesReport', 'ReportController@getSalesByMonth');
    Route::get('reports/getTopSellingProducts', 'ReportController@getTopSellingProducts');
    Route::get('reports/getWorstSellingProducts', 'ReportController@getWorstSellingProducts');
    Route::get('reports/getOverduePurchaseOrders', 'ReportController@getOverduePurchaseOrders');
    Route::get('reports/getProductProfitPercents', 'ReportController@getProductProfitPercents');
    Route::get('reports/getWeekWorkOrderReport', 'ReportController@getWeekWorkOrderReport');
    Route::get('reports/getOutstandingPayments', 'ReportController@getOutstandingPayments');
    Route::post('reports/getMaterialChecklist', 'ReportController@getMaterialChecklist');
    Route::post('reports/getDailySales', 'ReportController@getDailySales');
    Route::post('reports/getSalesChannelReport', 'ReportController@getSalesChannelReport');

    Route::post('uploader/uploadFile', 'UploadController@uploadFile');
    Route::post('uploader/deleteFile', 'UploadController@deleteFile');
});

/*
Route::group(['middleware' => 'web'], function () {
    Route::auth();
    Route::get('/data', 'DataController@index');
    //Route::get('/', 'HomeController@index');

});
*/