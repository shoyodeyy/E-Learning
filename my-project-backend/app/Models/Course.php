<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    public $incrementing = false;
    public $timestamps = true;
    protected $keyType = 'string';
    protected $table = 'courses';
    protected $primaryKey = 'courseID';
    protected $fillable = [
        'courseID',
        'categoryID',
        'courseTitle',
        'courseDescription',
        'price',
        'level',
        'badge',
        'instructorID',
        'statusID',
        'approvedBy',
        'avgRating',
        'totalStudents',
        'created_at',
        'updated_at'
    ];

    // Relationship
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'categoryID', 'categoryID');
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructorID', 'id');
    }

    public function approvedByAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approvedBy', 'id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class, 'statusID', 'statusID');
    }
}
