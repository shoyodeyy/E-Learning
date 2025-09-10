<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $primaryKey = 'questionId';
    public $timestamps = false;
    public $incrementing = false;

    protected $keyType = 'string';
    protected $table = 'quiz_questions';
    protected $fillable = [
        'questionId',
        'quizId',
        'questionText'
    ];

    // relationship
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(Option::class, 'questionId', 'questionId');
    }
}
