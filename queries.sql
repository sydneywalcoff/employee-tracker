-- employee name, role title, salary, department and managers
SELECT employees.first_name, employees.last_name, roles.title AS role, roles.salary, departments.name AS department, manager.first_name AS manager_name
FROM employees
LEFT JOIN employees manager ON (employees.manager_id = manager.id)
LEFT JOIN roles ON (employees.role_id = roles.id)
LEFT JOIN departments ON (roles.department_id = departments.id);


-- 
SELECT employee.first_name, employee.last_name, manager.first_name AS manager_name
FROM employees employee
LEFT JOIN employees manager
ON employee.manager_id = manager.id;