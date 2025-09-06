<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quiz extends Model
{
    public $incrementing = false;
    protected $primaryKey = 'quizId';
    protected $keyType = 'string';
    protected $table = 'quizzes';
    protected $fillable = [
        'quizId',
        'sectionId',
        'type',
        'quizTitle',
        'quizIndex',
        'quizDescription',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'sectionId', 'sectionId');
    }
}
