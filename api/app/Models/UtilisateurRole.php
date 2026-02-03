<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UtilisateurRole extends Model
{
    use HasFactory;

    protected $table = 't_utilisateur_role';

    protected $fillable = [
        'nom',
    ];

    public $timestamps = false;

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class, 'id_utilisateur_role');
    }
}
