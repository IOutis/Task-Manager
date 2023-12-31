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

        const taskList = document.getElementById('taskList');
        const taskItems = taskList.children;
        let insertIndex = taskItems.length;

        // Find the correct position to insert the new task
        for (let i = 0; i < taskItems.length; i++) {
            const itemDueDate = new Date(taskItems[i].querySelector('span').textContent.match(/\(([^)]+)\)/)[1]);
            if (dueDate < itemDueDate) {
                insertIndex = i;
                break;
            }
        }

        // Insert the new task at the correct position
        if (insertIndex === 0) {
            taskList.prepend(taskItem);
        } else {
            taskItems[insertIndex - 1].after(taskItem);
        }

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
