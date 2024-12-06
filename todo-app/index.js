const readline = require('readline');
const fs = require('fs');

// File to store tasks
const tasksFile = './tasks.json';

// Read tasks from file
let tasks = [];
if (fs.existsSync(tasksFile)) {
    tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
}

// Create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Display menu
const menu = `
1. View Tasks
2. Add Task
3. Mark Task as Complete
4. Delete Task
5. Exit
`;

// Save tasks to the file
function saveTasks() {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// View tasks
function viewTasks() {
    if (tasks.length === 0) {
        console.log('\nNo tasks available.');
    } else {
        console.log('\nYour Tasks:');
        tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.completed ? '[✔]' : '[ ]'} ${task.name}`);
        });
    }
}

// Add a new task
function addTask() {
    rl.question('Enter the task: ', (name) => {
        tasks.push({ name, completed: false });
        saveTasks();
        console.log('Task added!');
        mainMenu();
    });
}

// Mark a task as complete
function markTaskComplete() {
    viewTasks();
    rl.question('Enter the task number to mark as complete: ', (num) => {
        const index = parseInt(num, 10) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks[index].completed = true;
            saveTasks();
            console.log('Task marked as complete!');
        } else {
            console.log('Invalid task number!');
        }
        mainMenu();
    });
}

// Delete a task
function deleteTask() {
    viewTasks();
    rl.question('Enter the task number to delete: ', (num) => {
        const index = parseInt(num, 10) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            saveTasks();
            console.log('Task deleted!');
        } else {
            console.log('Invalid task number!');
        }
        mainMenu();
    });
}

// Main menu
function mainMenu() {
    console.log(menu);
    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                viewTasks();
                mainMenu();
                break;
            case '2':
                addTask();
                break;
            case '3':
                markTaskComplete();
                break;
            case '4':
                deleteTask();
                break;
            case '5':
                console.log('Goodbye!');
                rl.close();
                break;
            default:
                console.log('Invalid option!');
                mainMenu();
        }
    });
}

// Start the app
mainMenu();
