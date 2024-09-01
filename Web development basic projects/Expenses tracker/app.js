document.addEventListener('DOMContentLoaded', () => {
    const loginPage = document.getElementById('login-page');
    const signupPage = document.getElementById('signup-page');
    const dashboard = document.getElementById('dashboard');
    const updateModal = document.getElementById('update-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const updateForm = document.getElementById('update-form');
    const closeButton = document.querySelector('.close-button');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    let currentEditIndex = -1;
    let expenseToDelete = null;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Show login page by default
    showPage(loginPage);

    // Signup
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const email = document.getElementById('signup-email').value;

        if (users.some(user => user.username === username)) {
            alert('Username already exists');
            return;
        }

        users.push({ username, password, email, expenses: [] });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully!');
        showPage(loginPage);
    });

    // Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            showPage(dashboard);
            loadCurrentUser();
        } else {
            alert('Invalid credentials');
        }
    });

    // Handle Signup Link
    document.getElementById('signup-link').addEventListener('click', (e) => {
        e.preventDefault();
        showPage(signupPage);
    });

    // Toggle Expense Form
    const toggleFormBtn = document.getElementById('toggle-form-btn');
    const expenseForm = document.getElementById('expense-form');

    toggleFormBtn.addEventListener('click', () => {
        if (expenseForm.classList.contains('hidden')) {
            expenseForm.classList.remove('hidden');
            expenseForm.classList.add('show');
            toggleFormBtn.textContent = 'Cancel';
        } else {
            expenseForm.classList.remove('show');
            expenseForm.classList.add('hidden');
            toggleFormBtn.textContent = 'Add Expense';
        }
    });

    // Add Expense
    document.getElementById('expense-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.expenses.push({ date, amount, description });
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update the main users list with the new data
        const updatedUsers = users.map(user => user.username === currentUser.username ? currentUser : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        updateExpensesList(currentUser.expenses);
        expenseForm.classList.remove('show');
        expenseForm.classList.add('hidden');
        toggleFormBtn.textContent = 'Add Expense';
    });

    function handleExpenseAction(index, action) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (action === 'delete') {
            expenseToDelete = index;
            confirmationModal.style.display = 'flex';
        } else if (action === 'update') {
            const expense = currentUser.expenses[index];
            document.getElementById('update-date').value = expense.date;
            document.getElementById('update-amount').value = expense.amount;
            document.getElementById('update-description').value = expense.description;
            updateModal.style.display = 'flex';
            currentEditIndex = index;
        }
    }

    confirmDeleteButton.addEventListener('click', () => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.expenses.splice(expenseToDelete, 1);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update the main users list with the new data
        const updatedUsers = users.map(user => user.username === currentUser.username ? currentUser : user);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        updateExpensesList(currentUser.expenses);

        expenseToDelete = null;
        confirmationModal.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        expenseToDelete = null;
    });

    // Close Update Modal
    closeButton.addEventListener('click', () => {
        updateModal.style.display = 'none';
    });

    // Update Expense
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const date = document.getElementById('update-date').value;
        const amount = document.getElementById('update-amount').value;
        const description = document.getElementById('update-description').value;

        if (currentEditIndex >= 0) {
            currentUser.expenses[currentEditIndex] = { date, amount, description };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Update the main users list with the new data
            const updatedUsers = users.map(user => user.username === currentUser.username ? currentUser : user);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            updateExpensesList(currentUser.expenses);
            currentEditIndex = -1;
            updateModal.style.display = 'none';
        }
    });

    function updateExpensesList(expenses) {
        const expensesList = document.getElementById('expenses-list');
        expensesList.innerHTML = expenses.map((expense, index) => `
            <div>
                <div class="details">
                    <span>${expense.date}</span>
                    <span>${expense.amount}</span>
                    <span>${expense.description}</span>
                </div>
                <div class="actions">
                    <button onclick="handleExpenseAction(${index}, 'delete')">Delete</button>
                    <button onclick="handleExpenseAction(${index}, 'update')">Update</button>
                </div>
            </div>
        `).join('');
    }

    function showPage(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    }

    function loadCurrentUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.getElementById('user-name').textContent = currentUser.username;
            updateExpensesList(currentUser.expenses);
        }
    }

    // Attach global handleExpenseAction function to window object
    window.handleExpenseAction = handleExpenseAction;
});
