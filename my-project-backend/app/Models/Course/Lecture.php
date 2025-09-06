<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lecture extends Model
{
    public $incrementing = false;
    protected $primaryKey = 'lectureId';
    protected $keyType = 'string';
    protected $table = 'lectures';
    protected $fillable = [
        'lectureId',
        'sectionId',
        'type',
        'lectureTitle',
        'lectureIndex',
        'videoFile',
        'videoUrl',
        'thumbnail',
        'lectureDuration',
    ];

    // relationship
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'sectionId', 'sectionId');
    }
}
