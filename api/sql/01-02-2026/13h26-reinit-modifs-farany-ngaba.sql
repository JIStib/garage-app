create table t_utilisateur_role (
    id serial primary key,
    nom varchar(255) not null
);

create table t_utilisateur (
    id serial primary key,
    identifiant varchar(255) not null,
    mdp varchar(255) not null,
    id_utilisateur_role int references t_utilisateur_role(id) on delete cascade
);

create table t_type_reparation (
    id serial primary key,
    nom varchar(255) not null,
    duree int not null,
    prix decimal not null
);

create table t_reparation (
    id varchar(255) primary key,
    id_utilisateur_firebase varchar(255)
);

create table t_reparation_detail (
    id serial primary key,
    id_reparation varchar(255) references t_reparation(id) on delete cascade,
    id_type_reparation int references t_type_reparation(id) on delete cascade,
    est_termine boolean,
    prix decimal
);

create table t_reparation_statut (
    id serial primary key,
    nom varchar(255) not null
);

create table t_reparation_reparation_statut (
    id serial primary key,
    id_reparation varchar(255) references t_reparation(id) on delete cascade,
    id_reparation_statut int references t_reparation_statut(id) on delete cascade,
    date timestamp not null
);