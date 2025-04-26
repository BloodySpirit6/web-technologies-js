const bulb = document.getElementById('bulb');
const toggleBtn = document.getElementById('toggleBtn');
const bulbTypeSelect = document.getElementById('bulbType');
const brightnessBtn = document.getElementById('brightnessBtn');
const autoOffBtn = document.getElementById('autoOffBtn');
const statusText = document.getElementById('statusText');
const brightnessValue = document.getElementById('brightnessValue');

let isOn = false;
let currentBrightness = 100;
let autoOffTimeout = null;

function updateBulbState() {
    if (isOn) {
        bulb.classList.add('on');
        statusText.textContent = 'ввімкнено';
        toggleBtn.textContent = 'Вимкнути';
    } else {
        bulb.classList.remove('on');
        statusText.textContent = 'вимкнено';
        toggleBtn.textContent = 'Включити';
    }

    bulb.classList.remove('led', 'energy-saving');
    const bulbType = bulbTypeSelect.value;
    if (bulbType === 'led') {
        bulb.classList.add('led');
    } else if (bulbType === 'energy-saving') {
        bulb.classList.add('energy-saving');
    }

    bulb.style.opacity = currentBrightness / 100;
}

toggleBtn.addEventListener('click', () => {
    isOn = !isOn;
    resetAutoOffTimer();
    updateBulbState();
});

bulbTypeSelect.addEventListener('change', () => {
    updateBulbState();
});

brightnessBtn.addEventListener('click', () => {
    const newBrightness = prompt('Введіть яскравість (1-100):', currentBrightness);
    if (newBrightness !== null) {
        const brightness = parseInt(newBrightness);
        if (!isNaN(brightness)) {
            currentBrightness = Math.min(100, Math.max(1, brightness));
            brightnessValue.textContent = currentBrightness + '%';
            updateBulbState();
        }
    }
});

autoOffBtn.addEventListener('click', () => {
    if (confirm('Встановити таймер автоматичного вимкнення через 1 хвилин?')) {
        resetAutoOffTimer();
        alert('Лампочка вимкнеться автоматично через 1 хвилин бездіяльності');
    }
});

function resetAutoOffTimer() {
    if (autoOffTimeout) {
        clearTimeout(autoOffTimeout);
    }

    if (isOn) {
        autoOffTimeout = setTimeout(() => {
            isOn = false;
            updateBulbState();
            alert('Лампочка вимкнута через бездіяльність');
        }, 30 * 1000);
    }
}

updateBulbState();

document.addEventListener('click', resetAutoOffTimer);
document.addEventListener('keypress', resetAutoOffTimer);