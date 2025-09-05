<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VoucherRequest;
use App\Models\Voucher;
use Illuminate\Http\Request;


class VoucherController extends Controller
{
    public function store(VoucherRequest $request)
    {
        $voucher = Voucher::create($request->validated());

        return response()->json([
            'message' => 'Successfully created voucher!',
            'voucher' => $voucher,
        ], 201);
    }

    public function update(VoucherRequest $request, $id)
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->update($request->validated());

        return response()->json([
            'message' => 'Successfully updated voucher!',
            'voucher' => $voucher,
        ]);
    }

    public function index(Request $request)
    {
        $query = Voucher::select(
            'id',
            'code',
            'discount_type',
            'discount_value',
            'min_order',
            'usage_limit',
            'status',
            'start_date',
            'end_date',
        );

        if ($request->has('search') && $request->search) {
            $query->where('code', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('start_date')) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('end_date', '<=', $request->end_date);
        }

        if ($request->filled('min_order')) {
            $query->where('min_order', '>=', (int) $request->min_order);
        }

        if ($request->filled('usage_limit')) {
            $query->where('usage_limit', '>=', $request->usage_limit);
        }

        if ($request->filled('status') && $request->status !== '') {
            $query->where('status', (int) $request->status);
        }

        if ($request->filled('discount_type')) {
            $query->where('discount_type', $request->discount_type);
        }

        if ($request->filled('discount_value')) {
            $query->where('discount_value', "<=", (int) $request->discount_value);
        }
        return $query->get();
    }

    public function show($id)
    {
        return Voucher::findOrFail($id);
    }

    public function destroy($id)
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->delete();

        return response()->json([
            'message' => 'Successfully deleted voucher!',
        ], 200);
    }
}
