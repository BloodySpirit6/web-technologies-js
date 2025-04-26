document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const sortSelect = document.getElementById('sort-select');

    let tasks = [];

    const createTask = (text) => ({
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const renderTasks = (tasksToRender) => {
        taskList.innerHTML = '';
        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('fade-in');
            if (task.completed) li.classList.add('completed');

            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.classList.add('task-text');
            taskText.setAttribute('contenteditable', true);
            taskText.addEventListener('blur', () => editTask(task.id, taskText.textContent));
            taskText.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    taskText.blur();
                }
            });

            const btns = document.createElement('div');
            btns.classList.add('task-buttons');

            const doneBtn = createButton('✔', () => toggleComplete(task.id));
            const delBtn = createButton('🗑', () => deleteTask(task.id));

            btns.append(doneBtn, delBtn);
            li.append(taskText, btns);
            li.addEventListener('click', (e) => {
                if (e.target === taskText) return; // ігнор якщо натиснуто на текст
                toggleComplete(task.id);
            });

            taskList.appendChild(li);
        });
    };

    const createButton = (label, handler) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.addEventListener('click', e => {
            e.stopPropagation(); // щоб клік не поширився на лі
            handler(); // виклик функції, що передана
        });
        return btn;
    };

    const addTask = (text) => {
        tasks = [...tasks, createTask(text)];
        renderTasks(tasks);
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks(tasks);
    };

    const editTask = (id, newText) => {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, text: newText, updatedAt: new Date() } : task
        );
        renderTasks(tasks);
    };

    const toggleComplete = (id) => {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
        );
        renderTasks(tasks);
    };

    const sortTasks = (criterion) => {
        const sorted = [...tasks].sort((a, b) => {
            if (criterion === 'created') return a.createdAt - b.createdAt;
            if (criterion === 'updated') return b.updatedAt - a.updatedAt;
            if (criterion === 'completed') return a.completed - b.completed;
        });
        renderTasks(sorted);
    };

    taskForm.addEventListener('submit', e => {
        e.preventDefault(); // щоб сторінка не оновлювалась
        if (!taskInput.value.trim()) return;
        addTask(taskInput.value.trim());
        taskInput.value = '';
    });

    sortSelect.addEventListener('change', () => {
        sortTasks(sortSelect.value);
    });

    renderTasks(tasks);
});
