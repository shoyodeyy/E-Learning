<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    protected $keyType = 'int';
    public $incrementing = true;

    /**
     * Các field có thể gán
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'password',
        'profile',
        'role',
        'google_id',
        'email_verified_at',
        'phone',
        'address',
        'gender',
        'status',
        'avatar',
        'ban_reason',
        'banned_until',
    ];

    /**
     * Append thêm thuộc tính ảo
     */
    protected $appends = ['has_password', 'avatar_url'];

    /**
     * Các field ẩn khi trả về JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Cast các field đặc biệt
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'banned_until' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Gửi email reset password
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token, $this->email));
    }

    /**
     * Check nếu là user login qua Google
     */
    public function isGoogleUser(): bool
    {
        return !is_null($this->google_id);
    }

    /**
     * Check nếu user cần verify email
     */
    public function needsEmailVerification(): bool
    {
        if ($this->isGoogleUser()) {
            return false;
        }
        return is_null($this->email_verified_at);
    }

    /**
     * Check email đã verify chưa
     */
    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }


    /**
     * Check nếu user bị ban
     */
    public function isBanned(): bool
    {
        return !is_null($this->banned_until) && $this->banned_until->isFuture();
    }

    /**
     * Thuộc tính ảo: user có password hay không
     */
    public function getHasPasswordAttribute(): bool
    {
        return !is_null($this->password);
    }

    /**
     * ✅ Trả về URL đầy đủ cho avatar
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar
            ? Storage::url($this->avatar)
            : null;
    }

    /**
     * ===============================
     * 🎯 Các hàm liên quan đến STUDENT
     * ===============================
     */

    /**
     * Kiểm tra user có phải student không
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Các field mà student có thể edit
     */
    public function studentEditableFields(): array
    {
        return [
            'name',
            'email',
            'phone',
            'address',
            'gender',
            'profile',
            'avatar',
        ];
    }

    /**
     * Scope: chỉ lấy user có role student
     */
    public function scopeStudents($query)
    {
        return $query->where('role', 'student');
    }

    /**
     * ===============================
     * 🎯 Relationships
     * ===============================
     */

    public function eventsAsInstructors(): HasMany
    {
        return $this->hasMany(Event::class, 'organizerId', 'user_id');
    }

    public function ApprovedByAdmin(): HasMany
    {
        return $this->hasMany(Event::class, 'approvedBy', 'user_id');
    }
}
