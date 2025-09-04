<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformFeedback extends Model
{
    use HasFactory;

    protected $table = 'platform_feedback';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
    ];

    // Feedback thuộc về 1 user (student)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
