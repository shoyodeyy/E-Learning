<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Events extends Model
{
    public $incrementing = false;
    public $timestamps = true;
    protected $keyType = 'string';
    protected $table = 'events';
    protected $primaryKey = 'eventId';
    protected $fillable = [
        'event_id',
        'title',
        'description',
        'category',
        'eventDate',
        'eventTime',
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
        return $this->belongsTo(User::class, 'organizerId', 'id');
    }

    public function approvedByAdmin(): BelongsTo {
        return $this->belongsTo(User::class, 'approvedBy', 'id');
    }
}
