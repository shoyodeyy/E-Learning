<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    protected $primaryKey = 'notification_id';
    public $timestamps = true;

    protected $fillable = [
        "user_id",
        "event_id",
        "message",
        "type",
        "is_read",
        "created_at",
        "updated_at",
    ];

    protected $casts = [
        "is_read" => "boolean",
        "created_at" => "datetime",
        "updated_at" => "datetime",
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function event()
    {
        return $this->belongsTo(Event::class, "event_id", "event_id");
    }
}
