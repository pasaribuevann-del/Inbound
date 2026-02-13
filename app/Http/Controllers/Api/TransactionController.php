<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return response()->json(Transaction::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $transaction = Transaction::create($request->only([
            'date', 'time_transaction', 'receipt_no', 'sku', 'operate_type', 'qty', 'operator'
        ]));
        return response()->json($transaction, 201);
    }

    public function show(Transaction $transaction)
    {
        return response()->json($transaction);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $transaction->update($request->only([
            'date', 'time_transaction', 'receipt_no', 'sku', 'operate_type', 'qty', 'operator'
        ]));
        return response()->json($transaction);
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->json(null, 204);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Transaction::whereIn('id', $ids)->delete();
        return response()->json(['deleted' => count($ids)]);
    }
}
