DROP TABLE IF EXISTS employees;

CREATE TABLE department(
    id INTEGER PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE roles(
    id INTEGER PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER
);

CREATE TABLE employees(
    id INTEGER AUTO-INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);
