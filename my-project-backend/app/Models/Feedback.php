<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Feedback extends Model
{
    protected $table = 'feedback';
    protected $primaryKey = 'feedback_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'event_id',
        'role',
        'rating',
        'comments',
        'submitted_on',
        'edited',
        'edited_at',
    ];

    protected $casts = [
        'submitted_on' => 'datetime',
        'edited_at' => 'datetime',
        'edited' => 'boolean',
        'rating' => 'decimal:1',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    // Accessors
    public function getIsEditedAttribute()
    {
        return $this->edited;
    }

    public function getTimeAgoAttribute()
    {
        return $this->submitted_on->diffForHumans();
    }

    // Check if feedback can be edited
    public function canBeEdited()
    {
        if ($this->edited) {
            return false;
        }

        $event = $this->event;
        if ($event->status !== 'completed') {
            return false;
        }

        $feedbackDeadline = $event->end_at->addWeek();
        return now()->lte($feedbackDeadline);
    }

    // Scopes
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('submitted_on', 'desc');
    }

    public function scopeForEvent($query, $eventId)
    {
        return $query->where('event_id', $eventId);
    }
}
