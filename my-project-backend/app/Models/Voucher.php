<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'code', 'discount_type', 'discount_value',
        'start_date', 'end_date', 'usage_limit',
        'status', 'min_order', 'expired_at', 'active'
    ];

    protected $casts = [
        'status' => 'boolean',
        'active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'expired_at' => 'date',
    ];
}
