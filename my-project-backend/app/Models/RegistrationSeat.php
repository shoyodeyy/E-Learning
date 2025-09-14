<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationSeat extends Model
{
    protected $table = 'registration_seats';
    protected $primaryKey = 'seat_id';
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'registration_id',
        'seat_number',
    ];

    // relationship
    public function registration(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Registration::class, 'registration_id');
    }
}
