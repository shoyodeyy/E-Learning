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
            'discount_value' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    if($this->discount_type == 'percent') {
                        if ($value < 1 || $value > 70) {
                            $fail('Percent discount must be between 1% and 70%!');
                        }
                    }

                    if ($this->discount_type === 'fixed') {
                        if ($value < 1000000 || $value > 10000000) {
                            $fail('Fixed discount value must be between 1,000,000 and 10,000,000');
                        }
                    }
                }
            ] ,
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'usage_limit' => 'required|numeric|min:1',
            'min_order' => 'required|numeric|min:1000000',
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
            'min_order.min' => 'Minimum order value must be at least 1,000,000.',
        ];
    }
}
