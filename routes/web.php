<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('v3');
});

Route::redirect('/v1', '/', 301);
Route::redirect('/v2', '/', 301);
Route::redirect('/v3', '/', 301);
