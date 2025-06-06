-- Seleccionar la base de datos
USE NBCCoreAPI;

-- Deshabilitar temporalmente las restricciones de claves foráneas
SET
    FOREIGN_KEY_CHECKS = 0;

-- Eliminar solo las tablas gestionadas por este script
DROP TABLE IF EXISTS LinkGroupAssignments;

DROP TABLE IF EXISTS Groups;

DROP TABLE IF EXISTS LinkTags;

DROP TABLE IF EXISTS Tags;

DROP TABLE IF EXISTS Links;

-- Volver a habilitar las restricciones de claves foráneas
SET
    FOREIGN_KEY_CHECKS = 1;

-- Tabla de enlaces
CREATE TABLE
    Links (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        Url TEXT NOT NULL,
        FaviconUrl TEXT,
        Title VARCHAR(255),
        Description TEXT,
        Note TEXT,
        Domain VARCHAR(255),
        IsActive BOOLEAN DEFAULT TRUE,
        IsFavorite BOOLEAN DEFAULT FALSE,
        SavedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        LastClickAt DATETIME,
        ClickCount INT UNSIGNED DEFAULT 0,
        UserId INT UNSIGNED NOT NULL,
        ParentLinkId INT UNSIGNED NULL,
        FOREIGN KEY (UserId) REFERENCES Users (Id),
        FOREIGN KEY (ParentLinkId) REFERENCES Links (Id),
        INDEX (UserId),
        INDEX (Domain),
        INDEX (UserId, IsFavorite)
    );

-- Tabla de tags
CREATE TABLE
    Tags (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100) NOT NULL,
        Emoji VARCHAR(10),
        ColorRgb INT UNSIGNED NOT NULL,
        UserId INT UNSIGNED NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (UserId) REFERENCES Users (Id),
        UNIQUE (Name, UserId),
        INDEX (UserId),
        INDEX (UserId, Name)
    );

-- Relación N:M entre enlaces y tags
CREATE TABLE
    LinkTags (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        LinkId INT UNSIGNED NOT NULL,
        TagId INT UNSIGNED NOT NULL,
        FOREIGN KEY (LinkId) REFERENCES Links (Id),
        FOREIGN KEY (TagId) REFERENCES Tags (Id),
        INDEX (LinkId),
        INDEX (TagId),
        INDEX (LinkId, TagId)
    );

-- Tabla de grupos
CREATE TABLE
    Groups (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        Emoji VARCHAR(10),
        Name VARCHAR(100) NOT NULL,
        Description TEXT,
        ColorRgb INT UNSIGNED NOT NULL,
        ParentGroupId INT UNSIGNED,
        Depth INT UNSIGNED DEFAULT 0,
        IsAuto BOOLEAN DEFAULT FALSE,
        AutoTagId INT UNSIGNED,
        UserId INT UNSIGNED NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ParentGroupId) REFERENCES Groups (Id),
        FOREIGN KEY (AutoTagId) REFERENCES Tags (Id),
        FOREIGN KEY (UserId) REFERENCES Users (Id),
        CHECK (
            (
                IsAuto = TRUE
                AND ParentGroupId IS NULL
                AND AutoTagId IS NOT NULL
            )
            OR (
                IsAuto = FALSE
                AND AutoTagId IS NULL
            )
        ),
        INDEX (UserId),
        INDEX (UserId, Name),
        INDEX (Depth)
    );

-- Relación N:M entre enlaces y grupos
CREATE TABLE
    LinkGroupAssignments (
        Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        LinkId INT UNSIGNED NOT NULL,
        GroupId INT UNSIGNED NOT NULL,
        GroupOrder INT,
        FOREIGN KEY (LinkId) REFERENCES Links (Id),
        FOREIGN KEY (GroupId) REFERENCES Groups (Id),
        INDEX (LinkId),
        INDEX (GroupId),
        INDEX (LinkId, GroupId)
    );