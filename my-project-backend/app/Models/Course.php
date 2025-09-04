<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    // Tên bảng trong DB
    protected $table = 'courses';

    // Các cột cho phép fill (mass assignment)
    protected $fillable = [
        'title',
        'description',
        'price',
        'instructor_id',
        'category_id',
        'status',
        'approved_by',
        'avg_rating',
        'total_students',
        'total_duration',
    ];

    // Quan hệ với User (Instructor)
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    // Quan hệ với Category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Quan hệ với Enrollment (học viên đăng ký)
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'course_id');
    }

    // Quan hệ với Section
    public function sections()
    {
        return $this->hasMany(CourseSection::class, 'course_id');
    }

    // Quan hệ với Review
    public function reviews()
    {
        return $this->hasMany(CourseReview::class, 'course_id');
    }
}
