<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        $voucherId = $this->route('id');

        return [
            'code' => 'required|max:50|unique:vouchers,code,' . $voucherId,
            'discount_type' => 'required|in:percent,fixed',
            'discount_value' => 'required|numeric|min:1',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'usage_limit' => 'required|numeric|min:1',
            'min_order' => 'required|numeric|min:0',
            'status' => 'boolean',
            'active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Voucher code is required.',
            'code.unique' => 'This code is already in use.',
            'discount_type.required' => 'Discount type is required.',
            'discount_value.required' => 'Discount value is required.',
            'start_date.required' => 'Start date is required.',
            'end_date.required' => 'End date is required.',
            'min_order.required' => 'Minimum order value is required.',
        ];
    }
}
