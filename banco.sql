create table usuarios(
    id serial primary key,
    nome varchar(50) not null,
    email varchar(50) unique not null,
    senha varchar(255) not null,
    criado_em timestamp default now()
);

create table conexoes (
    usuario_id integer not null references usuarios(id),
    seguidor_id integer not null references usuarios(id),
    criado_em timestamp default now()
);

create table posts(
    id serial primary key,
    conteudo text not null,
    criado_em timestamp default now(),
    usuario_id integer references usuarios(id)
);

