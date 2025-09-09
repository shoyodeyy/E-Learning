<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    // relationship
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'sectionId', 'sectionId');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'quizId', 'quizId');
    }
}
