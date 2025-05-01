document.addEventListener('DOMContentLoaded', function() {
    // Конфігурація слайдера
    const config = {
        images: [
            'imgs/panda-for-drawing-13.jpg',
            'imgs/panda-for-drawing-51.jpg',
            'imgs/panda-for-drawing-54.jpg',
            'imgs/panda-for-drawing-63.jpg',
        ],
        transitionDuration: 500,
        autoplay: true,
        autoplayInterval: 3000,
        showArrows: true,
        showDots: true
    };

    // Елементи слайдера
    const slider = document.querySelector('.slider');
    const slidesContainer = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.dots');

    let currentSlide = 0;
    let autoplayTimer;
    let isAnimating = false;

    // Ініціалізація слайдера
    function initSlider() {
        // Створення слайдів
        config.images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${img}" alt="Слайд ${index + 1}">`;
            slidesContainer.appendChild(slide);
        });

        // Створення точок навігації
        if (config.showDots) {
            config.images.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'dot';
                dot.dataset.slide = index;
                dotsContainer.appendChild(dot);
            });
            updateDots();
        } else {
            dotsContainer.style.display = 'none';
        }

        // Налаштування стрілок
        if (!config.showArrows) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }

        // Запуск автоплеєра
        if (config.autoplay) {
            startAutoplay();
        }

        // Обробники подій
        addEventListeners();
    }

    // Перехід до слайду
    function goToSlide(index, animate = true) {
        if (isAnimating || index === currentSlide) return;

        isAnimating = true;
        currentSlide = index;

        if (animate) {
            slidesContainer.style.transition = `transform ${config.transitionDuration}ms ease`;
        } else {
            slidesContainer.style.transition = 'none';
        }

        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        setTimeout(() => {
            isAnimating = false;
        }, config.transitionDuration);

        updateDots();
    }

    // Оновлення активних точок
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Автоплеєр
    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, config.autoplayInterval);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    // Навігація
    function nextSlide() {
        const next = (currentSlide + 1) % config.images.length;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + config.images.length) % config.images.length;
        goToSlide(prev);
    }

    // Обробники подій
    function addEventListeners() {
        // Стрілки
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Клавіатура
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        // Точки навігації
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                goToSlide(slideIndex);
            }
        });

        // Пауза при наведенні
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', () => {
            if (config.autoplay) startAutoplay();
        });
    }

    // Запуск слайдера
    initSlider();
});