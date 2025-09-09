<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Option extends Model
{
    public $incrementing = true;
    public $timestamps = false;
    protected $primaryKey = 'optionId';
    protected $keyType = 'int';
    protected $table = 'quiz_options';
    protected $fillable = [
        'questionId',
        'optionText',
        'explainText',
        'isCorrect'
    ];

    // relationship
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'questionId', 'questionId');
    }
}
