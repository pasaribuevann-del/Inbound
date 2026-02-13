<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vas;
use Illuminate\Http\Request;

class VasController extends Controller
{
    public function index()
    {
        return response()->json(Vas::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $vas = Vas::create($request->only([
            'date', 'start_time', 'end_time', 'duration', 'brand', 'sku', 'vas_type', 'qty', 'operator'
        ]));
        return response()->json($vas, 201);
    }

    public function show(Vas $va)
    {
        return response()->json($va);
    }

    public function update(Request $request, Vas $va)
    {
        $va->update($request->only([
            'date', 'start_time', 'end_time', 'duration', 'brand', 'sku', 'vas_type', 'qty', 'operator'
        ]));
        return response()->json($va);
    }

    public function destroy(Vas $va)
    {
        $va->delete();
        return response()->json(null, 204);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Vas::whereIn('id', $ids)->delete();
        return response()->json(['deleted' => count($ids)]);
    }
}
