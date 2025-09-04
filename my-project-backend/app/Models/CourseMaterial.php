<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseMaterial extends Model
{
    use HasFactory;

    // Tên bảng trong DB
    protected $table = 'course_materials';

    // Các cột có thể ghi dữ liệu
    protected $fillable = [
        'course_id',
        'title',
        'file_url',
        'file_type',
    ];

    // Quan hệ: 1 tài liệu thuộc về 1 khóa học
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
