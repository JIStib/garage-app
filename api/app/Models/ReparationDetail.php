<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReparationDetail extends Model
{
    use HasFactory;

    protected $table = 't_reparation_detail';

    protected $fillable = [
        'id_reparation',
        'id_type_reparation',
        'est_termine',
        'prix',
    ];

    public $timestamps = false;

    protected $casts = [
        'est_termine' => 'boolean',
    ];

    public function reparation()
    {
        return $this->belongsTo(Reparation::class, 'id_reparation');
    }

    public function typeReparation()
    {
        return $this->belongsTo(TypeReparation::class, 'id_type_reparation');
    }
}
