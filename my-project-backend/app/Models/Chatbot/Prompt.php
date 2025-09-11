<?php

namespace App\Models\Chatbot;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prompt extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'name',
        'description',
        'created_by',
    ];

    // Quan hệ: prompt được tạo bởi admin (user)
    public function creator(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Quan hệ: prompt có nhiều version
    public function versions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PromptVersion::class, 'prompt_id');
    }

    // Helper: lấy version active
    public function activeVersion(): ?PromptVersion
    {
        return $this->versions()->where('is_active', true)->first();
    }
}
