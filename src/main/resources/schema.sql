CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE post (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    content VARCHAR(4096) NOT NULL,
    note INT NOT NULL,
    idcategory BIGINT NOT NULL
);

CREATE TABLE comment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    content VARCHAR(128) NOT NULL,
    idpost BIGINT NOT NULL,
    CONSTRAINT commentpost
    FOREIGN KEY (idpost )
    REFERENCES post (id)
);