<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseVideo extends Model
{
    use HasFactory;

    protected $table = 'course_videos';

    protected $fillable = [
        'section_id',
        'title',
        'video_url',
        'duration',
        'order_index',
    ];

    // Video thuộc về một section
    public function section()
    {
        return $this->belongsTo(CourseSection::class, 'section_id');
    }

    // Video có thể được nhiều user lưu lại (saved_videos)
    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_videos', 'video_id', 'user_id')
            ->withPivot('saved_at');
    }

    // Video có nhiều comment
    public function comments()
    {
        return $this->hasMany(VideoComment::class, 'video_id');
    }
}
