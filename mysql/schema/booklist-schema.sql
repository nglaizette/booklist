DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    userId              VARCHAR(25) NOT NULL,
    title               VARCHAR(250) NOT NULL,
    isbn                VARCHAR(15),
    pages               INT,
    mobileImage         VARCHAR(250),
    mobileImagePreview  JSON,
    smallImage          VARCHAR(250),
    smallImagePreview   JSON,
    mediumImage         VARCHAR(250),
    mediumImagePreview  JSON,
    publicationDate     VARCHAR(30),
    publisher           VARCHAR(100),
    editorialReviews    JSON
);

DROP TABLE IF EXISTS subjects;

CREATE TABLE subjects
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    userId          VARCHAR(25) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    path            VARCHAR(255),
    color           VARCHAR(255),
    backgroundColor VARCHAR(255)
);

DROP TABLE IF EXISTS tags;

CREATE TABLE tags
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    color           VARCHAR(255),
    backgroundColor VARCHAR(255)
);

DROP TABLE IF EXISTS books_subjects;

CREATE TABLE books_subjects
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    book        INT NOT NULL,
    subject     INT NOT NULL
);

DROP TABLE IF EXISTS books_tags;

CREATE TABLE books_tags
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    book        INT NOT NULL,
    tag        INT NOT NULL
);


