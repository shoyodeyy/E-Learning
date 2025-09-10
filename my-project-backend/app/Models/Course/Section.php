<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    public $incrementing = false;
    public $timestamps = false;
    protected $table = 'sections';
    protected $primaryKey = 'sectionId';
    protected $keyType = 'string';

    protected $fillable = [
        'courseId',
        'sectionId',
        'sectionTitle',
        'sectionIndex',
        'totalDuration'
    ];

    // relationship
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'courseID', 'courseID');
    }

    public function lectures(): HasMany
    {
        return $this->hasMany(Lecture::class, 'sectionId', 'sectionId');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'sectionId', 'sectionId');
    }
}
