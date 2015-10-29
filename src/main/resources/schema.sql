CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    version TIMESTAMP NOT NULL DEFAULT current_date
);

CREATE TABLE post (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    content VARCHAR(4096) NOT NULL,
    note INT NOT NULL,
    state VARCHAR(32) NOT NULL,
    idcategory BIGINT NOT NULL,
    version TIMESTAMP NOT NULL DEFAULT current_date
);

CREATE TABLE comment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    content VARCHAR(2048) NOT NULL,
    idpost BIGINT NOT NULL,
    version TIMESTAMP NOT NULL DEFAULT current_date,
    CONSTRAINT commentpost
    FOREIGN KEY (idpost )
    REFERENCES post (id)
);