<?php

namespace App\Models\Chatbot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromptVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'prompt_id',
        'content',
        'is_active',
    ];

    // Quan hệ: version thuộc về 1 prompt
    public function prompt(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Prompt::class, 'prompt_id');
    }
}
