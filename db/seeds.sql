INSERT INTO departments (name) VALUES 
    ('marketing'),
    ('engineering');
    
INSERT INTO roles (title, salary, department_id) VALUES
    ('copywriter', 60000.00, 1),
    ('jr engineer', 75000.00, 2),
    ('sr engineer', 100000.00, 2),
    ('marketing director', 90000.00, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('Sydney', 'Walcoff', 3, NULL),
    ('Liba', 'Dogg', 2, 3),    
    ('Salma', 'Abdelfattah', 4, NULL),
    ('Lily', 'Pooch', 1, 4); 