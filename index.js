const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '59Zyv@VbJwBJ',
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
    });
};

const viewAllRoles = () => {

    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        console.table(rows);
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
    // need to convert department_name into id
    .then(roleData => {
        // SQL
        const sql = `INSERT INTO roles (title, salary, department_name) VALUES (?,?,?)`;
        const params = [roleData.role_name, roleData.role_salary, roleData.department_name];
        db.query(sql, params, (err, rows) => {
            console.log(`
            Role added!
            `);
            db.query(`SELECT * FROM roles`, (err, rows) => {
                console.table(rows);
            });
        });
    });
};

const addEmployee = () => {
    // query employees table
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
            type: "input",
            name: "role",
            message: "What is the employee's role?"
        },
        {
            type: "checklist",
            name: "manager_name",
            message: "Who is the manager of this employee?",
            // choices: [ employees table results ]
        }
    ])
    .then(roleData => {
        // SQL
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const params = [roleData.first_name, roleData.last_name, roleData.role_id, roleData.manager_id];
        db.query(sql, params, (err, rows) => {
            console.log(`
            Employee added!
            `);
            db.query(`SELECT * FROM employees`, (err, rows) => {
                console.table(rows);
            });
        });
    });
};

const updateEmployeeRole = () => {
    // query employees
    // query roles table
    inquirer.prompt([
        {
            type: 'list',
            name: 'updateRole',
            message: 'Which employee would you like to update?',
            // choices: [ employees query results ]
        },
        {
            type: 'list',
            name: 'updateRole',
            message: 'What is their new role?',
            // choices: [ roles table results ]
        },
    ]);
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
