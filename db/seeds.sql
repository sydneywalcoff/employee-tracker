INSERT INTO departments (name) VALUES 
    ('legal'),
    ('SVU'),
    ('medical');
    
INSERT INTO roles (title, salary, department_id) VALUES
    ('assistant district attorney', 150000.00, 1),
    ('jr. detective', 85000.00, 2),
    ('sr. detective', 100000.00, 2),
    ('medical examiner', 200000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
    ('Rafael', 'Barba', 1, NULL),
    ('Olivia', 'Benson', 4, NULL),
    ('Elliot', 'Stabler', 2, 1),   
    ('Melinda', 'Warner', 4, 2); 