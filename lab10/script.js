// функція для затримки виконання інших функцій (використовується для пошуку, адреси)
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => { // повертає нову функцію
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args); // викликає передану функцію після затримки
        }, delay);
    };
};

// функція для отримання параметрів з URL
const parseQueryParams = () => {
    const params = new URLSearchParams(window.location.search); // створює об'єкт із параметрів URL
    return { // повертає об'єкт з параметрами
        search: params.get('search') || '',
        sort: params.get('sort') || 'name-asc',
        minAge: parseInt(params.get('minAge')) || null,
        maxAge: parseInt(params.get('maxAge')) || null,
        gender: params.get('gender') || 'all',
        country: params.get('country') || 'all',
        email: params.get('email') || '',
        tab: params.get('tab') || 'all'
    };
};

// функція для оновлення параметрів URL
const updateQueryParams = (params) => {
    const searchParams = new URLSearchParams(); // створює нові параметри пошуку

    // додає параметри тільки якщо вони відрізняються від значень за замовчуванням
    if (params.search) searchParams.set('search', params.search);
    if (params.sort && params.sort !== 'name-asc') searchParams.set('sort', params.sort);
    if (params.minAge) searchParams.set('minAge', params.minAge);
    if (params.maxAge) searchParams.set('maxAge', params.maxAge);
    if (params.gender && params.gender !== 'all') searchParams.set('gender', params.gender);
    if (params.country && params.country !== 'all') searchParams.set('country', params.country);
    if (params.email) searchParams.set('email', params.email);
    searchParams.set('tab', params.tab);

    // оновлює URL без перезавантаження сторінки
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newUrl); // змінює історію браузера
};

const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const currentUserEl = document.getElementById('current-user');
const searchInput = document.getElementById('search-input');
const userCardsContainer = document.getElementById('user-cards-container');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const pageNumbersContainer = document.getElementById('page-numbers');
const minAgeInput = document.getElementById('min-age');
const maxAgeInput = document.getElementById('max-age');
const genderFilter = document.getElementById('gender-filter');
const countryFilter = document.getElementById('country-filter');
const sortBy = document.getElementById('sort-by');
const emailFilter = document.getElementById('email-filter');


let state = {
    currentUser: null, // null, якщо не авторизований
    users: [],
    filteredUsers: [],
    favorites: new Set(),
    currentPage: 1,
    itemsPerPage: 20,
    hasMore: true, // чи є ще дані для завантаження
    isFetching: false, // для запобігання дублюванню запитів
    totalPages: 1,
    isLoading: false,
    error: null,
    activeTab: 'all',
    queryParams: parseQueryParams()
};

const initApp = () => {
    state.queryParams = parseQueryParams(); // оновлює параметри
    const user = localStorage.getItem('currentUser');
    // чи є збережений користувач у localStorage
    if (user) {
        state.currentUser = JSON.parse(user);
        showMainApp();
        loadFavorites();
        fetchUsers();
    } else {
        showAuthForm();
    }

    setupEventListeners();
};

const showAuthForm = () => {
    authContainer.classList.remove('hidden');
    mainContainer.classList.add('hidden');
};

const showMainApp = () => {
    authContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    currentUserEl.textContent = state.currentUser.name;
};

const setupEventListeners = () => {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    logoutBtn.addEventListener('click', handleLogout);

    searchInput.addEventListener('input', debounce(handleSearch, 300)); // пошук із затримкою
    minAgeInput.addEventListener('change', handleFilterChange);
    maxAgeInput.addEventListener('change', handleFilterChange);
    genderFilter.addEventListener('change', handleFilterChange);
    countryFilter.addEventListener('change', handleFilterChange);
    emailFilter.addEventListener('input', debounce(handleEmailFilter, 300));
    sortBy.addEventListener('change', handleSortChange);
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    window.addEventListener('scroll', handleScroll);

    // обробка змін URL (наприклад, коли користувач натискає назад/вперед)
    window.addEventListener('popstate', () => {
        state.queryParams = parseQueryParams();
        applyFiltersAndRender();
    });
};

const switchTab = (tab) => {
    // оновлює активну вкладку
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    state.activeTab = tab;
    state.queryParams.tab = tab;
    state.currentPage = 1;
    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

const handleLogin = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = {
        name: email.split('@')[0],
        email,
        password
    };

    // зберігаємо користувача у локальному сховищі
    localStorage.setItem('currentUser', JSON.stringify(user));
    state.currentUser = user;  // оновлюємо стан
    showMainApp();
    fetchUsers();
};

const handleRegister = (e) => {
    e.preventDefault();  // забороняє стандартну відправку форми
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const user = {
        name,
        email,
        password
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    state.currentUser = user;
    showMainApp();
    fetchUsers();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
};

const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('favorites');
    state.currentUser = null;
    state.favorites = new Set();
    showAuthForm();
};

const handleEmailFilter = (e) => {
    state.queryParams.email = e.target.value.trim();
    state.queryParams.page = 1;
    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

// отримання користувачів з API
const fetchUsers = async () => {
    try {
        state.isLoading = true;
        loadingSpinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');

        // перевірка, чи всі користувачі вже завантажені
        if (state.allUsersLoaded) {
            applyFiltersAndRender();
            return;
        }

        // запит до API
        const response = await fetch(`https://randomuser.me/api/?results=100&seed=friendsearch`);
        if (!response.ok) throw new Error('Failed to fetch users');

        const data = await response.json(); // отримуємо дані
        // форматування отриманих користувачів
        const newUsers = data.results.map(user => ({
            id: user.login.uuid,
            name: `${user.name.first} ${user.name.last}`,
            firstName: user.name.first,
            lastName: user.name.last,
            age: user.dob.age,
            gender: user.gender,
            email: user.email,
            phone: user.phone,
            picture: user.picture.large,
            location: {
                city: user.location.city,
                country: user.location.country
            },
            registered: new Date(user.registered.date)
        }));

        // додавання нових користувачів до існуючих
        state.users = [...state.users, ...newUsers];
        state.allUsersLoaded = true; // всі користувачі завантажені
        localStorage.setItem('cachedUsers', JSON.stringify(state.users));

        updateCountryFilter();
        applyFiltersAndRender();

    } catch (err) {
        showError(err.message);
    } finally {
        state.isLoading = false;
        loadingSpinner.classList.add('hidden');
    }
};

const updateCountryFilter = () => {
    // унікальні країни з користувачів
    const countries = [...new Set(state.users.map(user => user.location.country))].sort();

    // очищуємо фільтр (залишаємо тільки "All")
    countryFilter.innerHTML = '<option value="all">All</option>';

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });

    // встановлюємо вибране значення з параметрів URL
    if (state.queryParams.country && state.queryParams.country !== 'all') {
        countryFilter.value = state.queryParams.country;
    }
};

const applyFilters = () => {
    let filtered = [...state.users];// починаємо з усіх користувачів

    // пошук за текстом (ім'я, емейл, місто, країна)
    if (state.queryParams.search) {
        const searchTerm = state.queryParams.search.toLowerCase();
        filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.location.city.toLowerCase().includes(searchTerm) ||
            user.location.country.toLowerCase().includes(searchTerm)
        );
    }

    if (state.queryParams.minAge) {
        filtered = filtered.filter(user => user.age >= state.queryParams.minAge);
    }
    if (state.queryParams.maxAge) {
        filtered = filtered.filter(user => user.age <= state.queryParams.maxAge);
    }

    if (state.queryParams.gender !== 'all') {
        filtered = filtered.filter(user => user.gender === state.queryParams.gender);
    }

    if (state.queryParams.country !== 'all') {
        filtered = filtered.filter(user => user.location.country === state.queryParams.country);
    }

    if (state.queryParams.email) {
        const emailTerm = state.queryParams.email.toLowerCase();
        filtered = filtered.filter(user =>
            user.email.toLowerCase().includes(emailTerm)
        );
    }

    filtered = sortUsers(filtered, state.queryParams.sort);

    state.filteredUsers = filtered;
    state.totalPages = Math.ceil(filtered.length / state.itemsPerPage);
    state.hasMore = state.currentPage < state.totalPages;

    if (state.activeTab === 'favorites') {
        filtered = filtered.filter(user => state.favorites.has(user.id));
    }

    state.filteredUsers = filtered;
    state.totalPages = Math.ceil(filtered.length / state.itemsPerPage);
    state.hasMore = state.currentPage < state.totalPages;
};

const sortUsers = (users, sortBy) => {
    switch (sortBy) {
        case 'name-asc':
            return [...users].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...users].sort((a, b) => b.name.localeCompare(a.name));
        case 'age-asc':
            return [...users].sort((a, b) => a.age - b.age);
        case 'age-desc':
            return [...users].sort((a, b) => b.age - a.age);
        case 'registered-asc':
            return [...users].sort((a, b) => a.registered - b.registered);
        case 'registered-desc':
            return [...users].sort((a, b) => b.registered - a.registered);
        default:
            return users;
    }
};

// відображення користувачів на сторінці
const renderUsers = () => {
    // відображення тільки користувачів поточної сторінки
    const startIdx = (state.currentPage - 1) * state.itemsPerPage;
    const endIdx = startIdx + state.itemsPerPage;
    const usersToDisplay = state.filteredUsers.slice(0, endIdx);

    userCardsContainer.innerHTML = '';

    if (usersToDisplay.length === 0) {
        userCardsContainer.innerHTML = '<p class="no-results">No users found matching your criteria.</p>';
        return;
    }

    // створення картки для кожного користувача
    usersToDisplay.forEach(user => {
        const card = document.createElement('div');
        if (usersToDisplay.length === 0) {
            const message = state.activeTab === 'favorites'
                ? 'You have no favorite friends yet.'
                : 'No users found matching your criteria.';
            userCardsContainer.innerHTML = `<p class="no-results">${message}</p>`;
            return;
        }
        card.className = 'user-card';
        card.innerHTML = `
            <img src="${user.picture}" alt="${user.name}" class="user-card-img">
            <button class="favorite-btn ${state.favorites.has(user.id) ? 'favorited' : ''}" data-id="${user.id}">
                <i class="fas fa-heart"></i>
            </button>
            <div class="user-card-content">
                <h3 class="user-card-name">${user.name}</h3>
                <p class="user-card-info"><i class="fas fa-birthday-cake"></i> ${user.age} years old</p>
                <p class="user-card-info"><i class="fas fa-${user.gender === 'male' ? 'mars' : 'venus'}"></i> ${user.gender}</p>
                <p class="user-card-info"><i class="fas fa-phone"></i> ${user.phone}</p>
                <p class="user-card-info"><i class="fas fa-envelope"></i> ${user.email}</p>
                <p class="user-card-info"><i class="fas fa-map-marker-alt"></i> ${user.location.city}, ${user.location.country}</p>
                <p class="user-card-info"><i class="fas fa-calendar-alt"></i> Joined ${formatDate(user.registered)}</p>
            </div>
        `;
        userCardsContainer.appendChild(card);
    });

    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });

    updatePagination();
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// застосування фільтрів та повторне відображення
const applyFiltersAndRender = () => {
    // оновлюємо значення полів вводу зі стану
    searchInput.value = state.queryParams.search || '';
    minAgeInput.value = state.queryParams.minAge || '';
    maxAgeInput.value = state.queryParams.maxAge || '';
    genderFilter.value = state.queryParams.gender || 'all';
    sortBy.value = state.queryParams.sort || 'name-asc';

    applyFilters();
    renderUsers();
};

// обробник пошуку (з debounce)
const handleSearch = (e) => {
    const searchTerm = e.target.value.trim(); // отримуємо пошуковий запит
    state.queryParams.search = searchTerm; // оновлюємо стан
    state.queryParams.page = 1; // скидаємо на першу сторінку
    updateQueryParams(state.queryParams); // оновлюємо URL
    applyFiltersAndRender();
};

// обробник зміни фільтрів (вік, стать, країна)
const handleFilterChange = () => {
    // оновлюємо параметри фільтрів з полів вводу
    state.queryParams.minAge = minAgeInput.value ? parseInt(minAgeInput.value) : null;
    state.queryParams.maxAge = maxAgeInput.value ? parseInt(maxAgeInput.value) : null;
    state.queryParams.gender = genderFilter.value;
    state.queryParams.country = countryFilter.value;
    state.queryParams.page = 1;
    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

// обробник зміни сортування
const handleSortChange = () => {
    state.queryParams.sort = sortBy.value;
    state.queryParams.page = 1;
    updateQueryParams(state.queryParams);
    applyFiltersAndRender();
};

const toggleFavorite = (e) => {
    e.stopPropagation();
    const userId = e.currentTarget.getAttribute('data-id');

    if (state.favorites.has(userId)) {
        state.favorites.delete(userId);
        e.currentTarget.classList.remove('favorited');
    } else {
        state.favorites.add(userId);
        e.currentTarget.classList.add('favorited');
    }

    saveFavorites();
};

// завантаження вибраних користувачів з LocalStorage
const loadFavorites = () => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
        state.favorites = new Set(JSON.parse(favorites)); // відновлюємо з JSON
    }
};

// збереження вибраних користувачів у LocalStorage
const saveFavorites = () => {
    // конвертуємо Set у масив
    localStorage.setItem('favorites', JSON.stringify([...state.favorites]));
};

// оновлення відображення пагінації
const updatePagination = () => {
    pageNumbersContainer.innerHTML = ''; // очищуємо контейнер

    // завжди показує першу сторінку
    addPageNumber(1);

    // показує "..." якщо потрібно
    if (state.currentPage > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
    }

    // визначає діапазон сторінок для відображення
    const startPage = Math.max(2, state.currentPage - 1);
    const endPage = Math.min(state.totalPages - 1, state.currentPage + 1);

    // додає сторінки у діапазоні
    for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < state.totalPages) {
            addPageNumber(i);
        }
    }

    // показує "..." якщо потрібно
    if (state.currentPage < state.totalPages - 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
    }

    // завжди показує останню сторінку (якщо сторінок більше 1)
    if (state.totalPages > 1) {
        addPageNumber(state.totalPages);
    }
};

// додавання кнопки сторінки
const addPageNumber = (page) => {
    const pageNumber = document.createElement('span');
    pageNumber.className = 'page-number';

    if (page === state.currentPage) {
        pageNumber.classList.add('active');
    }

    pageNumber.textContent = page;
    pageNumbersContainer.appendChild(pageNumber);
};

// обробник нескінченного скролу
const handleScroll = debounce(() => {
    if (state.isFetching || !state.hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollPosition = scrollTop + clientHeight;

    // завантажує наступну сторінку при досягненні 80% висоти
    if (scrollPosition >= scrollHeight * 0.8) {
        loadNextPage();
    }
}, 1000);

const loadNextPage = () => {
    state.isFetching = true;
    state.currentPage += 1;

    // затримка для плавності
    setTimeout(() => {
        renderUsers();
        state.isFetching = false;
    }, 1000);
};

const showError = (message) => {
    state.error = message;
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorMessage.classList.remove('hidden');

    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);

    document.querySelector(`.tab-btn[data-tab="${state.activeTab}"]`).classList.add('active');
};

document.addEventListener('DOMContentLoaded', initApp);
