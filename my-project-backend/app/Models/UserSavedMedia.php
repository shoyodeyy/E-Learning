<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSavedMedia extends Model
{
    use HasFactory;

    protected $table = 'user_saved_media';

    protected $primaryKey = 'saved_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'media_id',
        'saved_at',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function media()
    {
        return $this->belongsTo(MediaGallery::class, 'media_id');
    }
}

