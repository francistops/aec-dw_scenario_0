CREATE EXTENSION "pgcrypto";
CREATE EXTENSION "uuid-ossp";

-- Créer une base de données
CREATE DATABASE andre;

-- Connecter à une base données
-- USE andre;
\c andre;



CREATE TABLE "users" (
    "userUuid" uuid DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "passHash" CHAR(64) NOT NULL,
    "firstName" VARCHAR(255) NULL,
    "lastName" VARCHAR(255) NULL,
    "loginStamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "token" uuid DEFAULT gen_random_uuid(),
    PRIMARY KEY ("userUuid")
);

/* Créer une table token */

CREATE TABLE "tokens" (
    "tokenUuid" uuid DEFAULT gen_random_uuid(),
    "userId" uuid NOT NULL REFERENCES "users"("userUuid"),
    "expires" TIMESTAMP DEFAULT (Now() + INTERVAL '24 hours'),
    PRIMARY KEY ("tokenUuid")
);

CREATE UNIQUE INDEX uidx_users_email ON "users"("email");

-- Créer une table "posts"
CREATE TABLE "posts" (
    "id" uuid DEFAULT gen_random_uuid(),
    "authorId" uuid NOT NULL REFERENCES "users"("userUuid"),
    "created" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "published" TIMESTAMP NULL,
    "title" VARCHAR(255) NOT NULL,
    "excert" TEXT NULL,
    "content" TEXT NOT NULL,
    PRIMARY KEY ("id")
);

INSERT INTO "users" ("email", "passHash", "firstName", "lastName") VALUES
('amelie.roussin@gmail.com', ENCODE (SHA256('123'), 'hex'), 'Amélie', 'Roussin'),
('jeremy.fontaine@example.com', ENCODE (SHA256('Xxpassw1rdxX'), 'hex'), 'Jérémy', 'Fontaine'),
('albert.langlois@example.com', ENCODE (SHA256('Xxpassw2rdxX'), 'hex'), 'Albert', 'Langlois');

INSERT INTO "posts" ("authorId", "published", "title", "excert", "content") VALUES
(
    (SELECT "userUuid" FROM "users" WHERE "email" = 'amelie.roussin@gmail.com'),
     NULL, 
     'First post', 
     'This is the first post', 
     'This is the full content of the first post'
),
(
    (SELECT "userUuid" FROM "users" WHERE "email" = 'amelie.roussin@gmail.com'),
     '2025-02-01 12:30:00', 
     'Second post', 
     'This is the second post', 
     'This is the full content of the second post'
),
(
    (SELECT "userUuid" FROM "users" WHERE "email" = 'albert.langlois@example.com'),
     '2025-01-01 11:45:00', 
     'Third post', 
     'This is the third post', 
     'This is the full content of the third post'
);

INSERT INTO "users" ("email", "passHash", "firstName", "lastName") VALUES
('ft@m.local', ENCODE(SHA256('saltypass'), 'hex'), 'f', 't'),
('foobar@notmail.com', ENCODE(SHA256('saltypass1'), 'hex'), 'foo', 'bar'),
('tamere@notmail.com', ENCODE(SHA256('saltypass2'), 'hex'), 'ta', 'mere'),
('andreprof@notmail.com', ENCODE(SHA256('saltypass3'), 'hex'), 'andre', 'prof');

INSERT INTO "posts" ("authorId", "published", "title", "excert", "content") VALUES
(
    (SELECT "userUuid" FROM "users" WHERE "email" = 'foobar@notmail.com'), NULL, 
    'First post', 
    'This is the first post', 
    'This is the full content of the first post'
),
(
    (SELECT "userUuid" FROM "users" WHERE "email" = 'foobar@notmail.com'), 
    '2025-02-01 12:30:00', 'Second post', 
    'This is the second post', 
    'This is the full content of the second post'
),
(
    (SELECT "userUuid" FROM "users" WHERE "email" = 'foobar@notmail.com'), 
    '2025-01-01 11:45:00', 
    'Third post', 
    'This is the third post', 
    'This is the full content of the third post'
);