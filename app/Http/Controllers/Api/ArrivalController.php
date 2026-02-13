<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Arrival;
use Illuminate\Http\Request;

class ArrivalController extends Controller
{
    public function index()
    {
        return response()->json(Arrival::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $arrival = Arrival::create($request->only([
            'date', 'arrival_time', 'brand', 'receipt_no', 'po_no', 'po_qty', 'operator', 'note'
        ]));
        return response()->json($arrival, 201);
    }

    public function show(Arrival $arrival)
    {
        return response()->json($arrival);
    }

    public function update(Request $request, Arrival $arrival)
    {
        $arrival->update($request->only([
            'date', 'arrival_time', 'brand', 'receipt_no', 'po_no', 'po_qty', 'operator', 'note'
        ]));
        return response()->json($arrival);
    }

    public function destroy(Arrival $arrival)
    {
        $arrival->delete();
        return response()->json(null, 204);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Arrival::whereIn('id', $ids)->delete();
        return response()->json(['deleted' => count($ids)]);
    }
}
