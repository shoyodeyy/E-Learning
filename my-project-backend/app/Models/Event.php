<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    public $incrementing = true;
    public $timestamps = true;
    protected $keyType = 'int';
    protected $table = 'events';
    protected $primaryKey = 'event_id';
    protected $fillable = [
        'title',
        'description',
        'category',
        'start_at',
        'duration_minutes',
        'venue',
        'organizerId',
        'approvedBy',
        'maxParticipants',
        'registrationDeadline',
        'bannerImage',
        'status',
        'created_at',
        'updated_at'
    ];

    // relationship
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizerId', 'user_id');
    }

    public function approvedByAdmin(): BelongsTo {
        return $this->belongsTo(User::class, 'approvedBy', 'user_id');
    }
}
