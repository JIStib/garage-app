<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparation extends Model
{
    use HasFactory;

    protected $table = 't_reparation';

    protected $fillable = [
        'id',
        'id_utilisateur_firebase'
    ];

    // 1. Indique à Laravel que l'ID n'est pas un nombre
    protected $keyType = 'string';

    public $timestamps = false;

    // public function utilisateur()
    // {
    //     return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    // }

    public function details()
    {
        return $this->hasMany(ReparationDetail::class, 'id_reparation');
    }

    public function statusHistory()
    {
        return $this->hasMany(ReparationReparationStatut::class, 'id_reparation');
    }
}
