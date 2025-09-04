<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedVideo extends Model
{
    use HasFactory;

    protected $table = 'saved_videos';

    protected $fillable = [
        'user_id',
        'video_id',
    ];

    // Video được lưu bởi user (student)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    // Video được lưu
    public function video()
    {
        return $this->belongsTo(CourseVideo::class, 'video_id');
    }

}
