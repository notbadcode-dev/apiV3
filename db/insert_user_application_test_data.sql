-- Usar la base de datos recién creada
USE NBCCoreAPI;

-- Deshabilitar las restricciones de claves foráneas temporalmente
SET
    FOREIGN_KEY_CHECKS = 0;

-- Eliminar todo el contenido de las tablas (vaciar tablas)
TRUNCATE TABLE UserApplications;

TRUNCATE TABLE Applications;

TRUNCATE TABLE Users;

-- Volver a habilitar las restricciones de claves foráneas
SET
    FOREIGN_KEY_CHECKS = 1;

-- Insertar usuarios de prueba con contraseñas hasheadas
INSERT INTO
    Users (Email, PasswordHash, IsActive)
VALUES
    (
        'user1@example.com',
        '$2a$12$QF5VY/6P3l1tUNybo.XY3u1LmrTWWgDEwrOwq9VltCg06wnzy8P4i',
        TRUE
    ), -- Contraseña: 'password_1'
    (
        'user2@example.com',
        '$2a$12$9f8mnvP5uOjZGGJ1/U8RUuGfCuA3TgDJyl9jMRFvR7d6.WK2kGGwO',
        TRUE
    ), -- Contraseña: 'password_2'
    (
        'user3@example.com',
        '$2a$12$GhKkq3ywH0.06VGyXnOxMOafHz2e1BWiT5OXuISQwJcHO7fPwv1Ea',
        FALSE
    ), -- Usuario inactivo, Contraseña: 'password_3'
    (
        'user4@example.com',
        '$2a$12$N1RgHrbMEFGvm88VY5fgm4ZzzhnoQvlgFL9EOeTkK9cLh9vcw6rya',
        TRUE
    ), -- Contraseña: 'password_4'
    (
        'user5@example.com',
        '$2a$12$zVGF9t6je3WR0EYm71.c82A4MvhsTr0U.kH2l.x0TSO9UmTTT1zOe',
        TRUE
    );

-- Contraseña: 'password_5'
-- Insertar aplicaciones de prueba
INSERT INTO
    Applications (Name, Description)
VALUES
    ('App1', 'Aplicación de prueba número 1'),
    ('App2', 'Aplicación de prueba número 2'),
    ('App3', 'Aplicación de prueba número 3'),
    ('App4', 'Aplicación de prueba número 4'),
    ('App5', 'Aplicación de prueba número 5');

-- Insertar relaciones entre usuarios y aplicaciones (ahora con LastAccessAt)
INSERT INTO
    UserApplications (UserId, ApplicationId, LastAccessAt)
VALUES
    (1, 1, '2025-04-01 10:00:00'), -- El usuario 1 tiene acceso a la aplicación 1 (con LastAccessAt)
    (1, 2, '2025-04-01 11:00:00'), -- El usuario 1 tiene acceso a la aplicación 2 (con LastAccessAt)
    (2, 3, '2025-04-02 14:00:00'), -- El usuario 2 tiene acceso a la aplicación 3 (con LastAccessAt)
    (3, 4, NULL), -- El usuario 3 tiene acceso a la aplicación 4 (usuario inactivo, LastAccessAt NULL)
    (4, 5, '2025-04-01 16:00:00'), -- El usuario 4 tiene acceso a la aplicación 5 (con LastAccessAt)
    (5, 2, '2025-04-03 12:00:00');

-- El usuario 5 tiene acceso a la aplicación 2 (con LastAccessAt)