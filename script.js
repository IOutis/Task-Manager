const taskList = document.getElementById('taskList');

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dateTimePicker = document.getElementById('dateTimePicker');
    const taskText = taskInput.value.trim();
    const dueDate = new Date(dateTimePicker.value);

    if (taskText !== '' && isValidDate(dueDate)) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span>${taskText} (Due: ${dueDate.toLocaleString()})</span>
            <button onclick="markAsCompleted(this)">Complete</button>
        `;
        taskList.appendChild(taskItem);

        // Schedule a notification for the task's due date
        scheduleNotification(taskText, dueDate);

        taskInput.value = '';
        dateTimePicker.value = '';
    }
}

function markAsCompleted(button) {
    const taskItem = button.parentElement;
    taskItem.classList.add('completed');

    const completeButton = taskItem.querySelector('button');
    completeButton.innerHTML = 'Remove';
    completeButton.onclick = function () {
        taskItem.remove();
        // You can add more logic here to mark the task as completed in your system.
    };
}

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

function scheduleNotification(taskText, dueDate) {
    const now = new Date();
    const timeUntilDeadline = dueDate - now;

    if (timeUntilDeadline > 0) {
        setTimeout(() => {
            const notification = new Notification('Task Reminder', {
                body: `Task "${taskText}" is due now!`,
            });

            notification.onclick = () => {
                // Handle notification click if needed.
                alert(`Task "${taskText}" is due now!`);
            };
        }, timeUntilDeadline);
    }
}

// Request notification permission
if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}
