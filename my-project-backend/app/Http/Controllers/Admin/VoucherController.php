<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\VoucherRequest;
use App\Models\Voucher;


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

    public function index()
    {
        return Voucher::select(
            'id',
            'code',
            'discount_type',
            'discount_value',
            'min_order',
            'usage_limit',
            'status',
            'start_date',
            'end_date',
        )->get();
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
