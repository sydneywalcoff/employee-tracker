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
            viewAllDept();
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
        case 'update an employee':
            updateEmployee();
            break;
        default:
            console.log('error');
    }
};

const viewAllDept = () => {
    console.log('you are viewing all departments');
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        console.table(rows);
    });
};

const viewAllRoles = () => {
    console.log('you are viewing all roles');
    // SQL to display roles
};

const viewAllEmployees = () => {
    console.log('you are viewing all employees');
    // SQL
};

const addDept = () => {
    console.log('you are adding a department');
    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What is the name of the department?"
        }
    ]);
    // SQL
};

const addRole = () => {
    console.log('you are adding a role');
    inquirer.prompt([
        {
            type: "input",
            name: "role_name",
            message: "What is the name of the role?"
        }
    ]);
    // SQL
};

const addEmployee = () => {
    console.log('you are adding an employee');
    inquirer.prompt([
        {
            type: "input",
            name: "employee_name",
            message: "What is the name of the employee?"
        }
    ]);
    // SQL
};

const updateEmployee = () => {
    console.log('you are updating an employee');
    // SQL
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
    return inquirer.prompt(menu)   
};

const init = () => {
    promptMenu().then(menuChoice => validateInput(menuChoice)); 
};

init();
