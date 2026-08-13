<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventApproval extends Model
{
    protected $table = 'event_approvals';
    protected $primaryKey = 'approval_id';
    
    protected $fillable = [
        'event_id',
        'approved_by',
        'action_type',
        'approval_type', 
        'notes',
        'previous_data',
        'new_data',
        'approved_at'
    ];

    protected $casts = [
        'previous_data' => 'array',
        'new_data' => 'array',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Constants for action types
    const ACTION_APPROVE = 'approve';
    const ACTION_REJECT = 'reject';

    // Constants for approval types
    const TYPE_CREATE = 'create';
    const TYPE_UPDATE = 'update';
    const TYPE_DELETE = 'delete';

    // Relationships
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by', 'user_id');
    }

    // Helper methods
    public function isApproval(): bool
    {
        return $this->action_type === self::ACTION_APPROVE;
    }

    public function isRejection(): bool
    {
        return $this->action_type === self::ACTION_REJECT;
    }

    public function isCreateApproval(): bool
    {
        return $this->approval_type === self::TYPE_CREATE;
    }

    public function isUpdateApproval(): bool
    {
        return $this->approval_type === self::TYPE_UPDATE;
    }

    public function isDeleteApproval(): bool
    {
        return $this->approval_type === self::TYPE_DELETE;
    }
}
