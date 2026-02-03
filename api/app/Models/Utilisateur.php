<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// class Utilisateur extends Authenticatable
class Utilisateur extends Model
{
    // use HasApiTokens, HasFactory, Notifiable;
    use HasFactory;

    protected $table = 't_utilisateur';

    protected $fillable = [
        'identifiant',
        'mdp',
        'id_utilisateur_role',
    ];

    public $timestamps = false;

    protected $hidden = [
        'mdp',
    ];

    public function getAuthPassword()
    {
        return $this->mdp;
    }

    public function role()
    {
        return $this->belongsTo(UtilisateurRole::class, 'id_utilisateur_role');
    }

    public function reparations()
    {
        return $this->hasMany(Reparation::class, 'id_utilisateur');
    }
}
