document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const fetchTasks = async () => {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        console.log('Fetched tasks:', tasks); // Debug log
        renderTasks(tasks);
    };
    
    const renderTasks = (tasks) => {
        taskList.innerHTML = ''; // Clear the list
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.content;
            li.dataset.id = task.id;
            li.classList.toggle('completed', task.completed); // Apply completed class
            li.addEventListener('click', toggleTask); // Add toggle event listener
    
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', deleteTask);
            li.appendChild(deleteBtn);
    
            taskList.appendChild(li);
        });
        console.log('Rendering tasks:', tasks);

    };
    


    const toggleTask = async (e) => {
        const taskId = e.target.dataset.id; // Get the task ID
        console.log('Toggling task ID:', taskId); // Debug log
        if (!taskId) return;
    
        await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
    
        fetchTasks(); // Re-fetch the updated list of tasks
    };
    

    const deleteTask = async (e) => {
        e.stopPropagation();
        const taskId = e.target.parentElement.dataset.id;

        await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
        fetchTasks();
    };

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newTask = { task: taskInput.value };
        await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });
        taskInput.value = '';
        fetchTasks();
    });

    fetchTasks();
});
