CREATE TABLE
    IF NOT EXISTS nodeTypes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        displayName VARCHAR(50) NOT NULL UNIQUE,
        priorityClass INTEGER NOT NULL DEFAULT 0
    );

CREATE TABLE
    IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type INTEGER,
        displayName VARCHAR(50) NOT NULL UNIQUE,
        httpUrl TEXT NOT NULL,
        httpStatus INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (type) REFERENCES nodeTypes (id)
    );

CREATE TABLE
    IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nodeId INTEGER,
        displayName VARCHAR(50) NOT NULL UNIQUE,
        httpUrl TEXT NOT NULL,
        httpStatus INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (nodeId) REFERENCES nodes (id)
    );

INSERT INTO
    nodeTypes (displayName)
VALUES
    ('Infrastructure');

INSERT INTO
    nodes (displayName, type, httpUrl)
VALUES
    ('Example Server', 1, 'https://example.com');

INSERT INTO
    nodes (displayName, type, httpUrl)
VALUES
    ('Error Server', 1, 'https://example.com/test404');

INSERT INTO
    services (displayName, nodeId, httpUrl)
VALUES
    ('Example Service', 1, 'https://example.org');

INSERT INTO
    services (displayName, nodeId, httpUrl)
VALUES
    ('Error Service', 1, 'https://example.org/test404');