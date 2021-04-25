



module.exports = {
    //  employee name, role title, salary, department and managers
    viewAllEmployees: `SELECT employees.first_name, employees.last_name, roles.title AS role, roles.salary, departments.name AS department, concat(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employees
    LEFT JOIN employees manager ON (employees.manager_id = manager.id)
    LEFT JOIN roles ON (employees.role_id = roles.id)
    LEFT JOIN departments ON (roles.department_id = departments.id)`,

    viewEmployeeManager: `SELECT employee.first_name, employee.last_name, manager.first_name AS manager_name
    FROM employees employee
    LEFT JOIN employees manager
    ON employee.manager_id = manager.id`,

    viewAllDepts: `SELECT * FROM departments`,
    viewAllRoles: `SELECT * FROM roles`,
    getEmployeeId: `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`,
    getRoleId: `SELECT id FROM roles WHERE title = ?`,
    getDepartmentId: `SELECT id FROM departments WHERE name = ?`,
    updateRoleId: `UPDATE employees SET role_id = ? WHERE id = ?`,
    updateManagerId: `UPDATE employees SET manager_id = ? WHERE id = ?`
}