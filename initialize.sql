CREATE TABLE
    IF NOT EXISTS nodeTypes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        priorityClass INTEGER NOT NULL DEFAULT 0
    );

CREATE TABLE
    IF NOT EXISTS nodeLinks (
        childNodeId INTEGER PRIMARY KEY,
        parentNodeId INTEGER NOT NULL,
        FOREIGN KEY (childNodeId) REFERENCES nodes (id),
        FOREIGN KEY (parentNodeId) REFERENCES nodes (id)
    );

CREATE TABLE
    IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        type INTEGER,
        httpVisible INTEGER NOT NULL DEFAULT 1,
        httpUrl TEXT NOT NULL,
        httpStatus INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (type) REFERENCES nodeTypes (id)
    );

INSERT INTO
    nodeTypes (name, description)
VALUES
    (
        'Infrastructure',
        'Lorem ipsum odor amet, consectetuer adipiscing elit.'
    );

INSERT INTO
    nodes (name, description, type, httpUrl)
VALUES
    (
        'Example Server',
        'Lorem ipsum odor amet, consectetuer adipiscing elit.',
        1,
        'https://example.com'
    );

INSERT INTO
    nodes (name, type, httpUrl)
VALUES
    ('Error Server', 1, 'https://example.com/test404');

INSERT INTO
    nodes (name, httpUrl)
VALUES
    ('Example Service', 'https://example.org');

INSERT INTO
    nodes (name, description, httpUrl)
VALUES
    (
        'Error Service',
        'Lorem ipsum odor amet, consectetuer adipiscing elit.',
        'https://example.org/test404'
    );

INSERT INTO
    nodeLinks (childNodeId, parentNodeId)
VALUES
    (3, 1);

INSERT INTO
    nodeLinks (childNodeId, parentNodeId)
VALUES
    (4, 1);