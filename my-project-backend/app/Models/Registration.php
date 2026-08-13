<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $table = 'registrations';
    protected $primaryKey = 'registration_id';
    public $timestamps = false;

    protected $fillable = [
        'event_id',
        'user_id',
        'status',
        'attendance_status',
        'qr_code',
        'registered_on'
    ];

    protected $casts = [
        'attendance_status' => 'boolean',
        'registered_on' => 'datetime',
    ];

    // Quan hệ
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function seats()
    {
        return $this->hasMany(RegistrationSeat::class, 'registration_id');
    }
}
