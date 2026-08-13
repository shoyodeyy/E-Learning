<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = 'statusID';
    protected $keyType = 'string';
    protected $table = 'statuses';
    protected $fillable = [
        'statusID',
        'statusName',
    ];

    // Relationship
    function Course(): HasMany
    {
        return $this->hasMany(Course::class, 'statusID', 'statusID');
    }
}
