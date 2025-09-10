<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $primaryKey = 'event_id';

    protected $fillable = [
        'title',
        'description',
        'category',
        'event_date',
        'event_time',
        'venue',
        'organizer_id',
        'approved_by',
        'max_participants',
        'registration_deadline',
        'banner_image',
        'status',
        'created_at',
    ];

    public $timestamps = false;
}
