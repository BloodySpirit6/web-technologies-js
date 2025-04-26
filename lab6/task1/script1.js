let products = [];
let editingId = null;

const $ = selector => document.querySelector(selector);

const showToast = (message, type = 'success') => {
    const toast = $('#toast');
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#dc3545' : '#28a745';
    toast.style.display = 'block';
    setTimeout(() => (toast.style.display = 'none'), 3000);
};

const renderProducts = list => {
    const container = $('#product-list');
    container.innerHTML = '';
    if (list.length === 0) {
        $('#empty-message').style.display = 'block';
    } else {
        $('#empty-message').style.display = 'none';
        list.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <p><strong>ID:</strong> ${product.id}</p>
                <h3>${product.name}</h3>
                <p>Ціна: ${product.price} грн</p>
                <p>Категорія: ${product.category}</p>
                <img src="${product.image}" alt="${product.name}" />
                <div class="actions">
                    <button onclick="editProduct('${product.id}')">Редагувати</button>
                    <button onclick="deleteProduct('${product.id}')">Видалити</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
    updateTotalPrice();
    renderFilters();
    renderSorters();
};

const updateTotalPrice = () => {
    const total = products.reduce((sum, p) => sum + p.price, 0);
    $('#total-price').textContent = `Загальна вартість: ${total} грн`;
};

const openModal = () => {
    $('#product-modal').style.display = 'flex';
};

const closeModal = () => {
    $('#product-form').reset();
    $('#product-id').value = '';
    editingId = null;
    $('#modal-title').textContent = 'Новий товар';
    $('#product-modal').style.display = 'none';
};

const deleteProduct = id => {
    products = products.filter(p => p.id !== id);
    renderProducts(products);
    showToast('Товар успішно видалено!');
};

const editProduct = id => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    $('#product-id').value = product.id;
    $('#product-name').value = product.name;
    $('#product-price').value = product.price;
    $('#product-category').value = product.category;
    $('#product-image').value = product.image;

    editingId = id;
    $('#modal-title').textContent = 'Редагування товару';
    openModal();
};

const addOrUpdateProduct = e => {
    e.preventDefault();
    const id = $('#product-id').value || Date.now().toString();
    const name = $('#product-name').value.trim();
    const price = parseFloat($('#product-price').value);
    const category = $('#product-category').value;
    const image = $('#product-image').value;

    const now = new Date().toISOString();

    const existing = products.find(p => p.id === id);

    const newProduct = {
        id,
        name,
        price,
        category,
        image,
        createdAt: existing?.createdAt || now,
        updatedAt: now
    };

    products = existing
        ? products.map(p => (p.id === id ? newProduct : p))
        : [...products, newProduct];

    showToast(
        existing
            ? `Товар "${name}" (ID: ${id}) оновлено.`
            : 'Новий товар додано!'
    );

    closeModal();
    renderProducts(products);
};

const renderFilters = () => {
    const filters = $('#filters');
    filters.innerHTML = '<strong>Фільтри:</strong> ';

    const categories = [...new Set(products.map(p => p.category))];

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.onclick = () => renderProducts(products.filter(p => p.category === cat));
        filters.appendChild(btn);
    });

    const reset = document.createElement('button');
    reset.textContent = 'Скинути';
    reset.onclick = () => renderProducts(products);
    filters.appendChild(reset);
};

const renderSorters = () => {
    const sorters = $('#sorters');
    sorters.innerHTML = '<strong>Сортування:</strong> ';

    const createSorterButton = (text, sortFn) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = () => renderProducts([...products].sort(sortFn));
        return btn;
    };

    sorters.appendChild(createSorterButton('За ціною', (a, b) => a.price - b.price));
    sorters.appendChild(createSorterButton('За датою створення', (a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    sorters.appendChild(createSorterButton('За датою оновлення', (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));

    const reset = document.createElement('button');
    reset.textContent = 'Скинути';
    reset.onclick = () => renderProducts(products);
    sorters.appendChild(reset);
};

$('#add-product-btn').addEventListener('click', openModal);
$('#close-modal').addEventListener('click', closeModal);
$('#product-form').addEventListener('submit', addOrUpdateProduct);

renderProducts(products);
