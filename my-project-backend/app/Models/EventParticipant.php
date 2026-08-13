<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventParticipant extends Model
{
    protected $table = 'event_participants';
    protected $primaryKey = 'participation_id';
    
    protected $fillable = [
        'event_id', 'user_id', 'role', 
        'registration_status', 'registered_at', 
        'attended_at', 'notes'
    ];
    
    protected $dates = ['registered_at', 'attended_at'];
}