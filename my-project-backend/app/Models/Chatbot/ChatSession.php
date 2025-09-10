<?php

namespace App\Models\Chatbot;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
    ];

    // Quan hệ: session thuộc về user

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ: session có nhiều messages
    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'session_id');
    }
}
