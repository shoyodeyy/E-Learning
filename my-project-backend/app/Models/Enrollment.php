<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';

    protected $fillable = [
        'student_id',
        'course_id',
        'payment_amount',
        'status',
    ];

    // Một enrollment thuộc về một student (user)
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Một enrollment thuộc về một course
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
