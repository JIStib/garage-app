<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReparationStatut extends Model
{
    use HasFactory;

    protected $table = 't_reparation_statut';

    protected $fillable = [
        'nom',
    ];

    public $timestamps = false;

    public function reparations()
    {
        return $this->hasMany(ReparationReparationStatut::class, 'id_reparation_statut');
    }
}
