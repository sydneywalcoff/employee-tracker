require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const queries = require('./queries');


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
        case 'update an employee manager':
            updateManager();
            break; 
        default:
            console.log('error');
    }
};

const viewAllDepts = () => {
    db.query(queries.viewAllDepts, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.table(rows);
        promptMenu();
    });
};

const viewAllRoles = () => {
    db.query(queries.viewAllRoles, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.table(rows);
        promptMenu();
    });
};

const viewAllEmployees = () => {
    db.query(queries.viewAllEmployees, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
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
            if(err) {
                console.log(err);
                return;
            }
            console.log(`
            Department added!
            `);
            db.query(queries.viewAllDepts, (err, rows) => {
                console.table(rows);
                promptMenu();
            });
        });
    });
};

const addRole = () => {
    // query departments
    let departments = [];
    
    db.query(queries.viewAllDepts, (err, rows) => {
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
        db.query(queries.getDepartmentId, [departmentTitle], (err, rows) => {
            if(err) {
                console.log(err);
                return;
            }
            departmentId = rows[0].id;
            const params = [roleData.role_name, roleData.role_salary, departmentId];
            console.log(params)
            db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, params, (err, rows) => {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log(`
                Role added!
                `);
                db.query(queries.viewAllRoles, (err, rows) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    console.table(rows);
                    promptMenu();
                });
            });
        })
    });
};

const addEmployee = () => {
    // query roles table    
    db.query(queries.viewAllRoles, (err, rows) => {
        const roles = [];
        if(err) {
            console.log(err);
        }
        rows.forEach( role => {
            roles.push(role.title);
        })

        // query employees for possible managers
        db.query(queries.viewAllEmployees, (err, rows) => {
            const employees = [];
            if(err) {
                console.log(err);
            }
            rows.forEach( manager => {
                const fullName = `${manager.first_name} ${manager.last_name}`
                employees.push(fullName);
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
                db.query(queries.getRoleId, [roleTitle], (err, rows) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    const roleId = rows[0].id;
                    paramsArr.push(roleId);
                    // get manager id
                    db.query(queries.getEmployeeId, [firstName, lastName], (err, rows) => {
                        if(err) {
                            console.log(err);
                            return;
                        }
                        const managerId = rows[0].id;
                        paramsArr.push(managerId);
                        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, paramsArr, (err, rows) => {
                            if(err) {
                                console.log(err);
                                return;
                            }
                            console.log(`
                            Employee added!
                            `);
                            db.query(queries.viewAllEmployees, (err, rows) => {
                                if(err) {
                                    console.log(err);
                                    return;
                                }
                                console.table(rows);
                                promptMenu();
                            });
                        });

                    })
                })
            });
        })
    })
};

const updateEmployeeRole = () => {
    // query roles table
    const roles = [];
    const employees = [];

    db.query(queries.viewAllRoles, (err, rows) => {
        if(err) {
            console.log(err);
        }
        rows.forEach( role => {
            rolesArr.push(role.title);
        })
         // query employees
        db.query(queries.viewAllEmployees, (err, rows) => {
            if(err) {
                console.log(err);
            }
            rows.forEach( employee => {
                const fullName = `${employee.first_name} ${employee.last_name}`;
                employees.push(fullName);
            })

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
                db.query(queries.getEmployeeId, [firstName, lastName], (err, rows) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                    const employeeId = rows[0].id;
                    paramsArr.push(employeeId)

                    db.query(queries.getRoleId, [updatedRole], (err, rows) => {
                        if(err) {
                            console.log(err);
                            return;
                        }
                        const updatedRoleId = rows[0].id;
                        paramsArr.push(updatedRoleId);
                        db.query(queries.updateRoleId, [updatedRoleId, employeeId], (err, rows) => {
                            if(err) {
                                console.log(err);
                            }
                            db.query(queries.viewAllEmployees, (err, rows) => {
                                if(err) {
                                    console.log(err);
                                    return;
                                }
                                console.table(rows);
                                promptMenu();
                            })
                        })
                    })
                })
            });
        })
    })
};

const updateManager = () => {
    // query employees
    db.query(queries.viewAllEmployees, (err, rows) => {;
        const employeeArr = [];
        rows.forEach(employee => {
            const firstName = employee.first_name;
            const lastName = employee.last_name;
            const fullName = `${firstName} ${lastName}`
            employeeArr.push(fullName);
        })
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: employeeArr
            },
            {
                type: 'list',
                name: 'newManager',
                message: 'Who is their new manager?',
                choices: employeeArr
            }
        ]).then(updatedEmployee => {
            const employeeName = updatedEmployee.employee.split(' ');
            const employeeFirstName = employeeName[0];
            const employeeLastName = employeeName[1];
            const managerName = updatedEmployee.newManager.split(' ');
            const managerFirstName = managerName[0];
            const managerLastName = managerName[1];
            // query employee id
            db.query(getEmployeeId, [employeeFirstName, employeeLastName], (err, rows) => {
                const employeeId = rows[0].id;

                // query manager id
                db.query(getEmployeeId, [managerFirstName, managerLastName], (err, rows) => {
                    const managerId = rows[0].id;

                    // update using employee and manager ids
                    db.query(queries.updateManagerId, [managerId, employeeId], (err, rows) => {
                        if(err) {
                            console.log(err);
                        }

                        // show updated table 
                        db.query(queries.viewAllEmployees, (err, rows) => {
                            console.table(rows);
                            promptMenu();
                        })
                    })
                })
            })
        })
    })
}

const promptMenu = () => {
    const menu = [
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'update an employee manager']
        }
    ];
    return inquirer.prompt(menu).then(menuChoice => validateInput(menuChoice)); 
};

const init = () => {
    promptMenu();
};

init();
