<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = 'categoryID';
    protected $keyType = 'string';
    protected $table = 'categories';
    protected $fillable = [
        'categoryID',
        'categoryName',
        'categoryDescription',
    ];

    // Relationship
    function Course(): HasMany
    {
        return $this->hasMany(Course::class, 'categoryID', 'categoryID');
    }
}
