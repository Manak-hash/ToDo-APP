let form = document.querySelector('form');
let Todos = document.getElementById('todos');
let input = document.getElementById('input');
let AllTodos = getTodos();

let sortable = Sortable.create(Todos, {
    animation: 150,
    onEnd: function(evt) {
        const fromIndex = evt.oldIndex;
        const toIndex = evt.newIndex;
        
        const [movedItem] = AllTodos.splice(fromIndex, 1);
        AllTodos.splice(toIndex, 0, movedItem);
        
        const items = Todos.querySelectorAll('.todo-item');
        items.forEach((item, index) => {
            item.setAttribute('data-index', index);
        });
        
        saveTodos();
    }
});

function getTodos() {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
}

function updateTodos() {
    Todos.innerHTML = '';
    AllTodos.forEach((todo, todoIndex) => {
        let todoItem = creatTodoItem(todo, todoIndex);
        Todos.appendChild(todoItem);
    });
}

function creatTodoItem(todo, todoIndex) {
    var paragraph = document.createElement('p');
    paragraph.classList.add('todo-item');
    paragraph.innerText = todo.text;
    paragraph.setAttribute('data-index', todoIndex);
    
    if (todo.completed) {
        paragraph.classList.add('completed');
    }

    paragraph.addEventListener('click', function(e) {
        const currentIndex = parseInt(this.getAttribute('data-index'));
        paragraph.classList.toggle('completed');
        toggleComplete(currentIndex);
    });

    let pressTimer;
    let longPressDuration = 500;

    paragraph.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
            const currentIndex = parseInt(this.getAttribute('data-index'));
            AllTodos.splice(currentIndex, 1);
            saveTodos();
            updateTodos();
        }, longPressDuration);
    });

    paragraph.addEventListener('touchend', function(e) {
        clearTimeout(pressTimer);
    });
    paragraph.addEventListener('touchmove', function(e) {
        clearTimeout(pressTimer);
    });
    paragraph.addEventListener('dblclick', function(e) {
        const currentIndex = parseInt(this.getAttribute('data-index'));
        AllTodos.splice(currentIndex, 1);
        saveTodos();
        updateTodos();
    });

    return paragraph;
}

function addTodo() {
    let todoText = input.value.trim();
    if(todoText.length > 0 && todoText.length <= 100) {
        let todoObject = {
            text: todoText,
            completed: false
        };
        AllTodos.push(todoObject);
        updateTodos();
        saveTodos();
        input.value = '';
    }
}

function toggleComplete(index) {
    AllTodos[index].completed = !AllTodos[index].completed;
    saveTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(AllTodos));
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

updateTodos();
// Mobile optimization code
(function initMobileOptimizations() {
    // Prevent double submissions on mobile
    form.addEventListener('touchend', (e) => {
        e.preventDefault();
    });

    // Data validation and cleanup on page load
    function validateAndCleanData() {
        try {
            const savedTodos = localStorage.getItem('todos');
            if (!savedTodos) {
                localStorage.setItem('todos', JSON.stringify([]));
                return;
            }

            const todos = JSON.parse(savedTodos);
            if (!Array.isArray(todos)) {
                localStorage.setItem('todos', JSON.stringify([]));
                return;
            }

            // Clean and re-save to ensure data integrity
            const cleanTodos = todos.filter(todo => 
                todo && 
                typeof todo === 'object' && 
                'text' in todo && 
                'completed' in todo
            );
            
            localStorage.setItem('todos', JSON.stringify(cleanTodos));
            AllTodos = cleanTodos;
            updateTodos();
        } catch {
            localStorage.setItem('todos', JSON.stringify([]));
            AllTodos = [];
            updateTodos();
        }
    }

    // Run validation on page load
    validateAndCleanData();

    // Improve long press detection for deleting tasks
    document.querySelectorAll('.todo-item').forEach(item => {
        let pressTimer;
        let longPressDuration = 500;

        item.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                const currentIndex = parseInt(this.getAttribute('data-index'));
                AllTodos.splice(currentIndex, 1);
                saveTodos();
                updateTodos();
            }, longPressDuration);
        });

        item.addEventListener('touchend', function(e) {
            clearTimeout(pressTimer);
        });
    });
})();