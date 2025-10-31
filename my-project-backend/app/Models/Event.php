<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    // Status constants
    const STATUS_PENDING_CREATE = 'pending_create';
    const STATUS_PENDING_UPDATE = 'pending_update';
    const STATUS_PENDING_DELETE = 'pending_delete';
    const STATUS_APPROVED = 'approved';
    const STATUS_COMPLETED = 'completed';
    const STATUS_REJECTED_CREATE = 'rejected_create';
    const STATUS_REJECTED_UPDATE = 'rejected_update';
    const STATUS_REJECTED_DELETE = 'rejected_delete';

    public $incrementing = true;
    public $timestamps = true;
    protected $keyType = 'int';
    protected $table = 'events';
    protected $primaryKey = 'event_id';
    protected $fillable = [
        'title',
        'description',
        'category',
        'start_at',
        'duration_minutes',
        'venue',
        'organizerId',
        'approvedBy',
        'maxParticipants',
        'registrationDeadline',
        'bannerImage',
        'status',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'maxParticipants' => 'integer',
        'organizerId' => 'integer',
        'approvedBy' => 'integer',
        'start_at' => 'datetime',
        'registrationDeadline' => 'datetime',
    ];

    // relationship with MediaGallery
    public function mediaGallery()
    {
        return $this->hasMany(MediaGallery::class, 'event_id', 'event_id');
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizerId', 'user_id');
    }

    public function approvedByAdmin(): BelongsTo {
        return $this->belongsTo(User::class, 'approvedBy', 'user_id');
    }

    public function getEndAtAttribute()
    {
        $duration = (int) ($this->duration_minutes ?? 60);
        
        return Carbon::parse($this->start_at)->addMinutes($duration);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'event_participants', 'event_id', 'user_id')
            ->withPivot(['role', 'registration_status', 'registered_at'])
            ->withTimestamps();
    }

    // Helper methods for status checking
    public function isPending()
    {
        return in_array($this->status, [
            self::STATUS_PENDING_CREATE,
            self::STATUS_PENDING_UPDATE,
            self::STATUS_PENDING_DELETE
        ]);
    }

    public function isRejected()
    {
        return in_array($this->status, [
            self::STATUS_REJECTED_CREATE,
            self::STATUS_REJECTED_UPDATE,
            self::STATUS_REJECTED_DELETE
        ]);
    }

    public function isApproved()
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isCompleted()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function needsApproval()
    {
        return $this->isPending();
    }

    public function canBeApproved()
    {
        return $this->isPending();
    }

    // Relationship với bảng event approvals
    public function approvals()
    {
        return $this->hasMany(\App\Models\EventApproval::class, 'event_id', 'event_id');
    }

    public function latestApproval()
    {
        return $this->hasOne(\App\Models\EventApproval::class, 'event_id', 'event_id')
            ->latest('created_at');
    }

    public function getStatusDisplay()
    {
        $statusLabels = [
            self::STATUS_PENDING_CREATE => 'Chờ duyệt tạo mới',
            self::STATUS_PENDING_UPDATE => 'Chờ duyệt cập nhật',
            self::STATUS_PENDING_DELETE => 'Chờ duyệt xóa',
            self::STATUS_APPROVED => 'Đã duyệt',
            self::STATUS_COMPLETED => 'Đã hoàn thành',
            self::STATUS_REJECTED_CREATE => 'Từ chối tạo mới',
            self::STATUS_REJECTED_UPDATE => 'Từ chối cập nhật',
            self::STATUS_REJECTED_DELETE => 'Từ chối xóa',
        ];
        
        return $statusLabels[$this->status] ?? 'Không xác định';
    }
}
