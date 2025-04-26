document.addEventListener('DOMContentLoaded', function() {
    const products = new Map();
    const orders = new Set();
    const productHistory = new WeakMap();
    // const userReferences = new WeakSet();

    const addProductBtn = document.getElementById('addProduct');
    const searchBtn = document.getElementById('searchBtn');
    const updateProductBtn = document.getElementById('updateProduct');
    const deleteProductBtn = document.getElementById('deleteProduct');
    const placeOrderBtn = document.getElementById('placeOrder');
    const productsTableBody = document.getElementById('productsTableBody');
    const ordersTableBody = document.getElementById('ordersTableBody');

    function* idGenerator() {
        let id = 1;
        while (true) {
            yield id++;
        }
    }

    const productIdGenerator = idGenerator();

    addProductBtn.addEventListener('click', function() {
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const quantity = parseInt(document.getElementById('productQuantity').value);

        if (!name || isNaN(price) || isNaN(quantity)) {
            alert('Будь ласка, заповніть всі поля коректно');
            return;
        }

        const id = productIdGenerator.next().value;
        const product = { id, name, price, quantity };

        products.set(id, product);

        productHistory.set(product, [{ type: 'create', date: new Date(), data: { ...product } }]);

        updateProductsDisplay();
        clearProductForm();
    });

    const searchResult = document.getElementById('searchResult');
    const resultId = document.getElementById('resultId');
    const resultName = document.getElementById('resultName');
    const resultPrice = document.getElementById('resultPrice');
    const resultQuantity = document.getElementById('resultQuantity');

    searchBtn.addEventListener('click', function() {
        const searchTerm = document.getElementById('searchProduct').value.trim().toLowerCase();

        searchResult.classList.remove('active');

        if (!searchTerm) {
            updateProductsDisplay();
            return;
        }

        const filteredProducts = Array.from(products.values()).filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.id.toString().includes(searchTerm)
        );

        if (filteredProducts.length === 0) {
            productsTableBody.innerHTML = '<div class="no-results">Нічого не знайдено</div>';
        } else {
            displayProducts(filteredProducts);

            if (filteredProducts.length > 0) {
                const product = filteredProducts[0];
                showSearchResult(product, searchTerm);
            }
        }
    });

    function showSearchResult(product, searchTerm) {
        const highlight = (text, term) => {
            if (!term) return text;
            const regex = new RegExp(`(${term})`, 'gi');
            return text.toString().replace(regex, '<span class="highlight">$1</span>');
        };

        resultId.innerHTML = highlight(product.id, searchTerm);
        resultName.innerHTML = highlight(product.name, searchTerm);
        resultPrice.innerHTML = highlight(product.price.toFixed(2), searchTerm);
        resultQuantity.innerHTML = highlight(product.quantity, searchTerm);

        searchResult.classList.add('active');
    }

    updateProductBtn.addEventListener('click', function() {
        const id = parseInt(document.getElementById('productId').value);
        const newName = document.getElementById('updateName').value.trim();
        const newPrice = parseFloat(document.getElementById('updatePrice').value);
        const newQuantity = parseInt(document.getElementById('updateQuantity').value);

        if (!products.has(id)) {
            alert('Продукт з таким ID не знайдено');
            return;
        }

        const product = products.get(id);
        let updated = false;

        if (newName && newName !== product.name) {
            product.name = newName;
            updated = true;
        }

        if (!isNaN(newPrice) && newPrice !== product.price) {
            const history = productHistory.get(product) || [];
            history.push({
                type: 'price_update',
                date: new Date(),
                oldValue: product.price,
                newValue: newPrice
            });
            productHistory.set(product, history);

            product.price = newPrice;
            updated = true;
        }

        if (!isNaN(newQuantity) && newQuantity !== product.quantity) {
            product.quantity = newQuantity;
            updated = true;
        }

        if (updated) {
            products.set(id, product);
            updateProductsDisplay();
            alert('Продукт оновлено');
        } else {
            alert('Немає даних для оновлення');
        }
    });

    deleteProductBtn.addEventListener('click', function() {
        const id = parseInt(document.getElementById('productId').value);

        if (!products.has(id)) {
            alert('Продукт з таким ID не знайдено');
            return;
        }

        const product = products.get(id);

        productHistory.delete(product);

        products.delete(id);
        updateProductsDisplay();
        clearProductForm();
    });

    placeOrderBtn.addEventListener('click', function() {
        const productId = parseInt(document.getElementById('orderProductId').value);
        const quantity = parseInt(document.getElementById('orderQuantity').value);

        if (!products.has(productId)) {
            alert('Продукт з таким ID не знайдено');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            alert('Будь ласка, введіть коректну кількість');
            return;
        }

        const product = products.get(productId);

        if (product.quantity < quantity) {
            alert('Недостатня кількість товару на складі');
            return;
        }

        product.quantity -= quantity;
        products.set(productId, product);

        const order = {
            id: Date.now(),
            productId,
            quantity,
            date: new Date()
        };

        orders.add(order);
        //
        // const user = { name: "Користувач", lastActivity: new Date() };
        // userReferences.add(user);

        updateProductsDisplay();
        updateOrdersDisplay();
        clearOrderForm();
    });

    function updateProductsDisplay() {
        displayProducts(Array.from(products.values()));
    }

    function displayProducts(productsArray) {
        productsTableBody.innerHTML = '';

        productsArray.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <span>${product.id}</span>
                <span>${product.name}</span>
                <span>${product.price.toFixed(2)}</span>
                <span>${product.quantity}</span>
            `;
            productsTableBody.appendChild(productElement);
        });
    }

    function updateOrdersDisplay() {
        ordersTableBody.innerHTML = '';

        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            orderElement.innerHTML = `
                <span>${order.id}</span>
                <span>${order.productId}</span>
                <span>${order.quantity}</span>
                <span>${order.date.toLocaleString()}</span>
            `;
            ordersTableBody.appendChild(orderElement);
        });
    }

    function clearProductForm() {
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productQuantity').value = '';
    }

    function clearOrderForm() {
        document.getElementById('orderProductId').value = '';
        document.getElementById('orderQuantity').value = '';
    }

    updateProductsDisplay();
    updateOrdersDisplay();
});