document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('input');
    const addButton = document.getElementById('add');
    const todoList = document.getElementById('todos');
    const clearAll = document.getElementById('clearAll');

    function saveTasks() {
        const tasks = [...todoList.children].map(li => ({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        }));
        localStorage.setItem('cosmic-todos', JSON.stringify(tasks));
    }

    function loadTasks() {
        const saved = JSON.parse(localStorage.getItem('cosmic-todos'));
        if (saved) {
            saved.forEach(task => addTask(task.text, task.completed));
        } else {
            addTask('Welcome to your Todo App! 🚀');
            addTask('How to use?  Click on the "❓" for a quick guide!');
        }
    }

    function updateStats() {
        const total = todoList.children.length;
        const completed = document.querySelectorAll('.completed').length;
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        saveTasks();
    }

    function sanitize(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Add task function
    function addTask(taskText, completed = false) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        const safeText = sanitize(taskText);
        
        li.innerHTML = `
            <label class="checkbox-container">
                <input 
                    type="checkbox" 
                    aria-label="Mark task as complete"
                    ${completed ? 'checked' : ''}
                >
                <span class="checkmark" role="presentation"></span>
            </label>
            <span class="task-text">${safeText}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed', this.checked);
            updateStats(); 
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.style.transform = 'translateX(100%)';
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove();
                updateStats(); 
            }, 300);
        });

        todoList.appendChild(li);
        updateStats();
    }

    addButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            taskInput.classList.add('shake');
            setTimeout(() => taskInput.classList.remove('shake'), 400);
            return;
        }
        addTask(taskText);
        taskInput.value = '';
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addButton.click();
    });

    clearAll.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all tasks?')) {
            todoList.querySelectorAll('li').forEach(li => {
                li.style.transform = 'translateX(-100%)';
                li.style.opacity = '0';
            });
            setTimeout(() => {
                todoList.innerHTML = '';
                updateStats();
                saveTasks();
            }, 300);
        }
    });

    loadTasks();

    const sortable = Sortable.create(todoList, {
        animation: 150,
        ghostClass: 'dragging',
        dragClass: 'dragging',
        onStart: function(evt) {
            requestAnimationFrame(() => {
                evt.item.classList.add('dragging');
            });
        },
        onEnd: function(evt) {
            evt.item.classList.remove('dragging');
            const fromIndex = evt.oldIndex;
            const toIndex = evt.newIndex;
            
            const [movedItem] = Array.from(todoList.children).splice(fromIndex, 1);
            todoList.insertBefore(movedItem, todoList.children[toIndex]);
            
            saveTasks();
        }
    });
});