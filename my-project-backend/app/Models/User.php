<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Storage; // cần thêm để dùng Storage::url
use App\Models\Course;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
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
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token, $this->email));
    }

    /**
     * Check if user is a Google user
     */
    public function isGoogleUser(): bool
    {
        return !is_null($this->google_id);
    }

    /**
     * Check if user needs email verification
     * Google users are auto-verified, regular users need to verify
     */
    public function needsEmailVerification(): bool
    {
        // Google users don't need email verification
        if ($this->isGoogleUser()) {
            return false;
        }

        // Regular users need verification if email_verified_at is null
        return is_null($this->email_verified_at);
    }

    /**
     * Check if user has verified email
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
     * Relationship: các khoá học mà user này là giảng viên
     */
    public function coursesAsInstructors(): HasMany
    {
        return $this->hasMany(Course::class, 'instructorID', 'id');
    }

    /**
     * Relationship: các khoá học mà user này phê duyệt
     */
    public function coursesApproved(): HasMany
    {
        return $this->hasMany(Course::class, 'approvedID', 'id');
    }
}
