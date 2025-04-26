document.addEventListener('DOMContentLoaded', function() {
    const redLight = document.getElementById('red');
    const yellowLight = document.getElementById('yellow');
    const greenLight = document.getElementById('green');
    const statusDisplay = document.getElementById('status');
    const nextBtn = document.getElementById('nextBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    let durations = {
        red: 5000,
        yellow: 3000,
        green: 7000,
        blink: 500
    };

    let currentState = 'red';
    let timeoutId = null;
    let intervalId = null;
    let blinkCount = 0;

    function initTrafficLight() {
        resetLights();
        redLight.classList.add('active');
        statusDisplay.textContent = 'Стан: червоний';
        currentState = 'red';
    }

    function resetLights() {
        redLight.classList.remove('active');
        yellowLight.classList.remove('active');
        greenLight.classList.remove('active');
        yellowLight.classList.remove('blink');
    }

    function nextState() {
        resetLights();

        switch(currentState) {
            case 'red':
                currentState = 'yellow';
                yellowLight.classList.add('active');
                statusDisplay.textContent = 'Стан: жовтий';
                timeoutId = setTimeout(nextState, durations.yellow);
                break;

            case 'yellow':
                currentState = 'green';
                greenLight.classList.add('active');
                statusDisplay.textContent = 'Стан: зелений';
                timeoutId = setTimeout(nextState, durations.green);
                break;

            case 'green':
                currentState = 'blinking-yellow';
                statusDisplay.textContent = 'Стан: миготливий жовтий';
                blinkYellow();
                break;

            case 'blinking-yellow':
                currentState = 'red';
                redLight.classList.add('active');
                statusDisplay.textContent = 'Стан: червоний';
                timeoutId = setTimeout(nextState, durations.red);
                break;
        }
    }

    function blinkYellow() {
        blinkCount = 0;
        intervalId = setInterval(function() {
            yellowLight.classList.toggle('active');
            blinkCount++;

            if (blinkCount >= 6) { // 3 рази (включення + виключення)
                clearInterval(intervalId);
                nextState();
            }
        }, durations.blink);
    }

    function changeSettings() {
        const newRed = parseInt(prompt('Тривалість червоного світла (мс):', durations.red));
        const newYellow = parseInt(prompt('Тривалість жовтого світла (мс):', durations.yellow));
        const newGreen = parseInt(prompt('Тривалість зеленого світла (мс):', durations.green));

        if (!isNaN(newRed)) durations.red = newRed;
        if (!isNaN(newYellow)) durations.yellow = newYellow;
        if (!isNaN(newGreen)) durations.green = newGreen;
    }

    nextBtn.addEventListener('click', function() {
        nextState();
    });

    settingsBtn.addEventListener('click', function() {
        changeSettings();
    });

    initTrafficLight();
});