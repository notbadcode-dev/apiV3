-- Usar la base de datos recién creada
USE NBCCoreAPI;

-- Deshabilitar las restricciones de claves foráneas temporalmente
SET
    FOREIGN_KEY_CHECKS = 0;

-- Eliminar las tablas si existen
DROP TABLE IF EXISTS UserApplications;

DROP TABLE IF EXISTS Applications;

DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS LoginHistory;

DROP TABLE IF EXISTS AuditLogs;

DROP TABLE IF EXISTS Configurations;

-- Volver a habilitar las restricciones de claves foráneas
SET
    FOREIGN_KEY_CHECKS = 1;

-- Crear la tabla Users
CREATE TABLE
    Users (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        Email VARCHAR(250) NOT NULL UNIQUE,
        PasswordHash CHAR(60) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        DeletedAt TIMESTAMP NULL DEFAULT NULL,
        -- Baja lógica para usuarios
        IsActive BOOLEAN DEFAULT TRUE,
        INDEX (Email),
        INDEX (IsActive),
        CONSTRAINT CHK_IsActive CHECK (IsActive IN (0, 1)),
        CONSTRAINT CHK_DeletedAt CHECK (
            DeletedAt IS NULL
            OR DeletedAt >= CreatedAt
        )
    ) ENGINE = InnoDB;

-- Crear la tabla Applications
CREATE TABLE
    Applications (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(250) NOT NULL,
        Description VARCHAR(250),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (Name),
        INDEX (CreatedAt),
        INDEX (ModifiedAt)
    ) ENGINE = InnoDB;

-- Crear la tabla UserApplications
CREATE TABLE
    UserApplications (
        UserId INT UNSIGNED NOT NULL,
        ApplicationId INT UNSIGNED NOT NULL,
        LastAccessAt TIMESTAMP NULL DEFAULT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (UserId, ApplicationId),
        FOREIGN KEY (UserId) REFERENCES Users (Id),
        FOREIGN KEY (ApplicationId) REFERENCES Applications (Id),
        INDEX (UserId),
        INDEX (ApplicationId),
        INDEX (CreatedAt),
        INDEX (LastAccessAt)
    ) ENGINE = InnoDB;

-- Crear la tabla Configurations
CREATE TABLE
    IF NOT EXISTS Configurations (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        UserId INT UNSIGNED NULL,
        ApplicationId INT UNSIGNED NULL,
        ConfigData BLOB NOT NULL, -- Almacenará el archivo JSON comprimido
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ModifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        ConfigType ENUM ('user', 'application') NOT NULL, -- Diferenciar si es para usuario o aplicación
        INDEX (UserId),
        INDEX (ApplicationId),
        INDEX (CreatedAt),
        INDEX (ConfigType),
        CONSTRAINT FK_User FOREIGN KEY (UserId) REFERENCES Users (Id),
        CONSTRAINT FK_Application FOREIGN KEY (ApplicationId) REFERENCES Applications (Id)
    ) ENGINE = InnoDB;

DROP TABLE IF EXISTS LoginHistory;

-- Crear la tabla LoginHistory
CREATE TABLE
    LoginHistory (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        UserId INT UNSIGNED NOT NULL,
        ApplicationId INT UNSIGNED NOT NULL,
        LoginAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        IpAddress VARCHAR(45), -- Dirección IP
        UserAgent VARCHAR(255), -- Información del navegador/dispositivo
        Success BOOLEAN DEFAULT TRUE, -- Si el inicio de sesión fue exitoso
        FailureReason VARCHAR(255) NULL, -- Motivo del fallo si Success = FALSE
        FOREIGN KEY (UserId) REFERENCES Users (Id),
        FOREIGN KEY (ApplicationId) REFERENCES Applications (Id),
        INDEX (Id),
        INDEX (UserId),
        INDEX (ApplicationId),
        INDEX (LoginAt)
    ) ENGINE = InnoDB;

-- Crear la tabla AuditLogs (con los cambios solicitados en ActionDetail)
CREATE TABLE
    AuditLogs (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        EntityId INT UNSIGNED,
        EntityReference VARCHAR(255),
        EntityTableName VARCHAR(100) NOT NULL, -- Nombre de la tabla afectada
        ActionType ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACTION') NOT NULL, -- Acción realizada (sin valor vacío)
        ActionDetail VARCHAR(250), -- Detalles sobre el cambio realizado (cambiado de JSON a VARCHAR(250))
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UserCode VARCHAR(100) NULL, -- Código del usuario que realizó la acción
        INDEX (EntityName),
        INDEX (EntityId),
        INDEX (CreatedAt)
    ) ENGINE = InnoDB;