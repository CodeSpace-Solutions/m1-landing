<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('v1');
});

Route::get('/v1', function () {
    return view('v1');
});

Route::get('/v2', function () {
    return view('v2');
});

Route::get('/v3', function () {
    return view('v3');
});
