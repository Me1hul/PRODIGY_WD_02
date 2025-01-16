
        let startTime;
        let elapsedTime = 0;
        let timerInterval;
        let lastLapTime = 0;
        let laps = [];

        const timeDisplay = {
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            milliseconds: document.getElementById('milliseconds')
        };

        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapBtn = document.getElementById('lapBtn');
        const lapsContainer = document.getElementById('lapsContainer');

        function startTimer() {
            if (!timerInterval) {
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(updateTimer, 10);
                startBtn.textContent = 'Pause';
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                startBtn.textContent = 'Start';
            }
        }

        function stopTimer() {
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.textContent = 'Start';
        }

        function resetTimer() {
            clearInterval(timerInterval);
            timerInterval = null;
            elapsedTime = 0;
            lastLapTime = 0;
            laps = [];
            updateDisplay(0, 0, 0, 0);
            startBtn.textContent = 'Start';
            lapsContainer.innerHTML = '';
        }

        function recordLap() {
            if (timerInterval) {
                const currentLapTime = elapsedTime - lastLapTime;
                lastLapTime = elapsedTime;
                laps.push(currentLapTime);
                updateLapsDisplay();
            }
        }

        function updateTimer() {
            const currentTime = Date.now();
            elapsedTime = currentTime - startTime;

            const time = {
                hours: Math.floor(elapsedTime / (1000 * 60 * 60)),
                minutes: Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((elapsedTime % (1000 * 60)) / 1000),
                milliseconds: Math.floor((elapsedTime % 1000) / 10)
            };

            updateDisplay(
                time.hours,
                time.minutes,
                time.seconds,
                time.milliseconds
            );
        }

        function updateDisplay(hours, minutes, seconds, milliseconds) {
            timeDisplay.hours.textContent = padNumber(hours);
            timeDisplay.minutes.textContent = padNumber(minutes);
            timeDisplay.seconds.textContent = padNumber(seconds);
            timeDisplay.milliseconds.textContent = padNumber(milliseconds);
        }

        function formatTime(ms) {
            const hours = Math.floor(ms / (1000 * 60 * 60));
            const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((ms % (1000 * 60)) / 1000);
            const milliseconds = Math.floor((ms % 1000) / 10);

            return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}.${padNumber(milliseconds)}`;
        }

        function updateLapsDisplay() {
            lapsContainer.innerHTML = '';
            
            if (laps.length === 0) return;

            const bestLap = Math.min(...laps);
            const worstLap = Math.max(...laps);

            laps.forEach((lapTime, index) => {
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                
                if (lapTime === bestLap) lapItem.classList.add('best-lap');
                if (lapTime === worstLap) lapItem.classList.add('worst-lap');

                lapItem.innerHTML = `
                    <span class="lap-number">Lap ${laps.length - index}</span>
                    <span class="lap-time">${formatTime(lapTime)}</span>
                `;
                
                lapsContainer.insertBefore(lapItem, lapsContainer.firstChild);
            });
        }

        function padNumber(number) {
            return number.toString().padStart(2, '0');
        }

        startBtn.addEventListener('click', startTimer);
        stopBtn.addEventListener('click', stopTimer);
        resetBtn.addEventListener('click', resetTimer);
        lapBtn.addEventListener('click', recordLap);