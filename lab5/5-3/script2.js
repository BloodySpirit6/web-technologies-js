document.addEventListener('DOMContentLoaded', function() {
    // 1. Цифровий годинник
    const digitalClock = document.getElementById('digitalClock');
    const secondsElement = digitalClock.querySelector('.seconds');

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        digitalClock.querySelector('.hours').textContent = hours;
        digitalClock.querySelector('.minutes').textContent = minutes;
        secondsElement.textContent = seconds;

        secondsElement.classList.toggle('blinking');
    }

    setInterval(updateClock, 1000);
    updateClock();

    // 2. Таймер зворотного відліку
    const countdownDateInput = document.getElementById('countdownDate');
    const startCountdownBtn = document.getElementById('startCountdown');
    const resetCountdownBtn = document.getElementById('resetCountdown');
    const countdownDisplay = document.getElementById('countdownDisplay');
    let countdownInterval;

    //встановлення мінімальної дати (сьогодні)
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    countdownDateInput.min = localISOTime;

    function startCountdown() {
        const endDate = new Date(countdownDateInput.value);
        if (isNaN(endDate.getTime())) {
            alert('Будь ласка, виберіть коректну дату та час');
            return;
        }

        clearInterval(countdownInterval);

        function updateCountdown() {
            const now = new Date();
            const diff = endDate - now;

            if (diff <= 0) {
                clearInterval(countdownInterval);
                countdownDisplay.innerHTML = '<div class="countdown-ended">Час вийшов!</div>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }

        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    function resetCountdown() {
        clearInterval(countdownInterval);
        countdownDateInput.value = '';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }

    startCountdownBtn.addEventListener('click', startCountdown);
    resetCountdownBtn.addEventListener('click', resetCountdown);

    // 3. Календар
    const calendarMonthInput = document.getElementById('calendarMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const calendarElement = document.getElementById('calendar');

    let currentDate = new Date();

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        calendarMonthInput.value = `${year}-${(month + 1).toString().padStart(2, '0')}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        calendarElement.innerHTML = '';

        const daysOfWeek = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-header';
            dayElement.textContent = day;
            calendarElement.appendChild(dayElement);
        });

        //порожні клітинки для днів попереднього місяця
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarElement.appendChild(emptyDay);
        }

        //дні місяця
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            //сьогоднішній день
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }

            calendarElement.appendChild(dayElement);
        }
    }

    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        renderCalendar(currentDate);
    }

    calendarMonthInput.addEventListener('change', function() {
        const [year, month] = this.value.split('-').map(Number);
        currentDate = new Date(year, month - 1, 1);
        renderCalendar(currentDate);
    });

    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    renderCalendar(currentDate);

    // 4. День народження
    const birthdayDateInput = document.getElementById('birthdayDate');
    const calculateBirthdayBtn = document.getElementById('calculateBirthday');
    const birthdayCountdownElement = document.getElementById('birthdayCountdown');

    calculateBirthdayBtn.addEventListener('click', function() {
        const birthdayDate = new Date(birthdayDateInput.value);
        if (isNaN(birthdayDate.getTime())) {
            alert('Будь ласка, виберіть коректну дату народження');
            return;
        }

        const now = new Date();
        let nextBirthday = new Date(now.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());

        const diff = nextBirthday - now;

        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        birthdayCountdownElement.innerHTML = `
            <p>До вашого дня народження залишилось:</p>
            <p>${months} місяців, ${days} днів, ${hours} годин, ${minutes} хвилин, ${seconds} секунд</p>
            <p>Дата: ${nextBirthday.toLocaleDateString('uk-UA')}</p>
        `;
    });
});