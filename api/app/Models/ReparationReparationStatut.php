<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReparationReparationStatut extends Model
{
    use HasFactory;

    protected $table = 't_reparation_reparation_statut';

    protected $fillable = [
        'id_reparation',
        'id_reparation_statut',
        'date',
    ];

    public $timestamps = false;

    protected $casts = [
        'date' => 'datetime',
    ];

    public function reparation()
    {
        return $this->belongsTo(Reparation::class, 'id_reparation');
    }

    public function statut()
    {
        return $this->belongsTo(ReparationStatut::class, 'id_reparation_statut');
    }
}
