const inquirer = require('inquirer');

const validateInput = selectedInput => {
    switch(selectedInput.menu) {
        case 'view all departments':
            console.log('you are viewing all departments');
            break;
        case 'view all roles':
            console.log('you are viewing all roles');
            break;
        case 'view all employees':
            console.log('you are viewing all employees');
            break;
        case 'add a department':
            console.log('you are adding a department');
            break;
        case 'add a role':
            console.log('you are adding a role');
            break;
        case 'add an employee':
            console.log('you are adding an employee');
            break;
        case 'update an employee':
            console.log('you are updating an employee');
            break;
        default:
            console.log('error');
    }
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
    promptMenu()
};

init();
