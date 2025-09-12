<?php

namespace App\Models;

use Carbon\Carbon;
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

    // relationship with MediaGallery
    public function mediaGallery()
    {
        return $this->hasMany(MediaGallery::class, 'event_id', 'event_id');
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizerId', 'user_id');
    }

    public function approvedByAdmin(): BelongsTo {
        return $this->belongsTo(User::class, 'approvedBy', 'user_id');
    }

    public function getEndAtAttribute()
    {
        return Carbon::parse($this->start_at)->addMinutes($this->duration_minutes);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'event_participants', 'event_id', 'user_id')
            ->withPivot(['role', 'registration_status', 'registered_at'])
            ->withTimestamps();
    }
}
