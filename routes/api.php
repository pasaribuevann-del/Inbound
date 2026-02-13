<?php

use App\Http\Controllers\Api\ArrivalController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\VasController;
use Illuminate\Support\Facades\Route;

// Arrivals
Route::apiResource('arrivals', ArrivalController::class);
Route::post('arrivals/bulk-delete', [ArrivalController::class, 'bulkDelete']);

// Transactions
Route::apiResource('transactions', TransactionController::class);
Route::post('transactions/bulk-delete', [TransactionController::class, 'bulkDelete']);

// VAS
Route::apiResource('vas', VasController::class);
Route::post('vas/bulk-delete', [VasController::class, 'bulkDelete']);
