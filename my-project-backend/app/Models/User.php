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
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Các field có thể gán
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile',
        'role',
        'google_id',
        'email_verified_at',

        // thêm mới
        'phone',
        'address',
        'gender',
        'status',
        'avatar',
    ];

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

    // Các khóa học mà user này là giảng viên
    public function coursesAsInstructors(): HasMany
    {
        return $this->hasMany(Course::class, 'instructorID', 'id');
    }

    // Các khóa học mà user này phê duyệt
    public function coursesApproved(): HasMany
    {
        return $this->hasMany(Course::class, 'approvedID', 'id');
    }
}
