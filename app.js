const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();


const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'human_resources'
    },
    console.log('Connected to the human_resources database')
);

const validateInput = selectedInput => {
    switch(selectedInput.menu) {
        case 'view all departments':
            viewAllDepts();
            break;
        case 'view all roles':
            viewAllRoles();
            break;
        case 'view all employees':
            viewAllEmployees();
            break;
        case 'add a department':
            addDept();
            break;
        case 'add a role':
            addRole();
            break;
        case 'add an employee':
            addEmployee();
            break;
        case 'update an employee role':
            updateEmployeeRole();
            break;
        default:
            console.log('error');
    }
};

const viewAllDepts = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        console.table(rows);
        promptMenu();
    });
};

const viewAllRoles = () => {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        console.table(rows);
        promptMenu();
    });
};

const viewAllEmployees = () => {
    const sql = `SELECT employees.first_name, employees.last_name, roles.title AS role, roles.salary, departments.name AS department, manager.first_name AS manager_name
    FROM employees
    LEFT JOIN employees manager ON (employees.manager_id = manager.id)
    LEFT JOIN roles ON (employees.role_id = roles.id)
    LEFT JOIN departments ON (roles.department_id = departments.id);
    `;
    db.query(sql, (err, rows) => {
        console.table(rows);
        promptMenu();
    });
};

const addDept = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What is the name of the department?"
        }
    ])
    .then(params => {
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        db.query(sql, params.department_name, (err, rows) => {
            console.log(`
            Department added!
            `);
            db.query(`SELECT * FROM departments`, (err, rows) => {
                console.table(rows);
                promptMenu();
            });
        });
    });
};

const addRole = () => {
    // query departments
    const sql = `SELECT name FROM departments`;
    let departments = [];
    
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        }
        rows.forEach( department => {
            departments.push(department.name);
        })
    })

    inquirer.prompt([
        {
            type: "input",
            name: "role_name",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "role_salary",
            message: "What is this role's salary?"
        },
        {
            type: "list",
            name: "department_name",
            message: "What department is this role?",
            choices: departments
        }
    ])
    .then(roleData => {
        // need to get id from department_name
        const departmentTitle = roleData.department_name;
        let departmentId;
        db.query(`SELECT id FROM departments WHERE name = ?`, [departmentTitle], (err, rows) => {
            departmentId = rows[0].id;
            const params = [roleData.role_name, roleData.role_salary, departmentId];
            console.log(params)
            db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, params, (err, rows) => {
                console.log(`
                Role added!
                `);
                db.query(`SELECT * FROM roles`, (err, rows) => {
                    console.table(rows);
                    promptMenu();
                });
            });
        })
    });
};

const addEmployee = () => {
    // query roles table
    let roles = [];
    
    db.query(`SELECT title FROM roles`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        rows.forEach( role => {
            roles.push(role.title);
        })
    })

    // query employees for possible managers
    let employees = [];

    db.query(`SELECT first_name, last_name FROM employees`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        rows.forEach( manager => {
            const fullName = `${manager.first_name} ${manager.last_name}`
            employees.push(fullName);
        })
    })

    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee?"
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roles
        },
        {
            type: "list",
            name: "manager_name",
            message: "Who is the manager of this employee?",
            choices: employees
        }
    ])
    .then(employeeData => {
        let paramsArr = [ employeeData.first_name, employeeData.last_name ];
        // get id of manager to insert into manager_id
        const managerName = employeeData.manager_name;
        let nameArr = managerName.split(' ');
        const firstName = nameArr[0];
        const lastName = nameArr[1];
        let roleTitle = employeeData.role;
        // get role id
        db.query(`SELECT * FROM roles WHERE title = ?`, [roleTitle], (err, rows) => {
            const roleId = rows[0].id;
            paramsArr.push(roleId);
        })
        // get manager id
        db.query(`SELECT id FROM employees WHERE first_name = ? AND last_name = ?`, [firstName, lastName], (err, rows) => {
            const managerId = rows[0].id;
            paramsArr.push(managerId);
        })
        let query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        db.query(query, paramsArr, (err, rows) => {
            if(err) {
                console.log(err);
                return;
            }
            console.log(`
            Employee added!
            `);
            db.query(`SELECT * FROM employees`, (err, rows) => {
                console.table(rows);
                // promptMenu();
            });
        });
    });
};

const updateEmployeeRole = () => {
    // query roles table
    const roles = [];
    const employees = [];

    db.query(`SELECT title FROM roles`, (err, rows) => {
        if(err) {
            console.log(err);
        }
        rows.forEach( role => {
            rolesArr.push(role.title);
        })
         // query employees
        db.query(`SELECT first_name, last_name FROM employees`, (err, rows) => {
            if(err) {
                console.log(err);
            }
            rows.forEach( employee => {
                const fullName = `${employee.first_name} ${employee.last_name}`;
                employees.push(fullName);
            })
            // console.log(`roles: ${roles}, employees: ${employees}`);

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: 'Which employee would you like to update?',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'updatedRole',
                    message: 'What is their new role?',
                    choices: roles
                }
            ])
            .then(updatedEmployee => {
                // split name
                const employeeName = updatedEmployee.name;
                const updatedRole = updatedEmployee.updatedRole;
 
                const paramsArr = employeeName.split(' ');
                const firstName = paramsArr[0];
                const lastName = paramsArr[1];
                // query for id of first and last name
                db.query(`SELECT id FROM employees WHERE first_name = ? AND last_name = ?`, [firstName, lastName], (err, rows) => {
                    const employeeId = rows[0].id;
                    paramsArr.push(employeeId)

                    db.query(`SELECT id FROM roles WHERE title = ?`, [updatedRole], (err, rows) => {
                        const updatedRoleId = rows[0].id;
                        paramsArr.push(updatedRoleId);
                        db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [updatedRoleId, employeeId], (err, rows) => {
                            if(err) {
                                console.log(err);
                            }
                            db.query(`SELECT * FROM employees`, (err, rows) => {
                                console.table(rows);
                            })
                        })
                    })
                })
            });
        })
    })
};

const promptMenu = () => {
    const menu = [
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        }
    ];
    return inquirer.prompt(menu).then(menuChoice => validateInput(menuChoice)); 
};

const init = () => {
    promptMenu();
};

init();
