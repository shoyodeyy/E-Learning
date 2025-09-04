<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseReview extends Model
{
    use HasFactory;

    protected $table = 'course_reviews';

    protected $fillable = [
        'student_id',
        'course_id',
        'rating',
        'review_text',
    ];

    // Một review thuộc về một student (user)
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Một review thuộc về một course
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
