<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoComment extends Model
{
    use HasFactory;

    protected $table = 'video_comments';

    protected $fillable = [
        'video_id',
        'user_id',
        'comment_text',
    ];

    // Comment thuộc về 1 video
    public function video()
    {
        return $this->belongsTo(CourseVideo::class, 'video_id');
    }

    // Comment do 1 user (student/instructor) viết
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
