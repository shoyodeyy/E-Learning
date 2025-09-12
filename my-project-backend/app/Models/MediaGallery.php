<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaGallery extends Model
{
    use HasFactory;

    protected $table = 'media_gallery';

    protected $primaryKey = 'media_id';
    public $incrementing = true;
    protected $keyType = 'int';

    public $timestamps = false;


    protected $fillable = [
        'event_id',
        'file_type',
        'file_url',
        'file_name',
        'caption',
        'department',
        'event_year',
        'is_featured',
        'file_size',
        'uploaded_by',
        'uploaded_on',
    ];


    protected $casts = [
        'is_featured' => 'boolean',
        'uploaded_on' => 'datetime',
    ];

    // Quan hệ với Event


    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    // Quan hệ với User (người upload)
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }
}
