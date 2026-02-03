<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeReparation extends Model
{
    use HasFactory;

    protected $table = 't_type_reparation';

    protected $fillable = [
        'nom',
        'duree',
        'prix',
    ];

    public $timestamps = false;
}
