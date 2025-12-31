// ####### Measurent Explores ####### //
{
    let currentSection = 'Height';
    let animationTimeouts = [];  // showEnergy
    function showMeasurment(type, btn) {
        // Clear any running animations
        clearAllTimeouts();

        // Hide all sections
        document.querySelectorAll('.measurment-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(type + '-section').classList.add('active');
        if(type === 'Height'){
            restartHeightGame();
        }

        // Update navigation
        document.querySelectorAll('.type-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentSection = type;

        // Reset all animations
        resetAllSections();
    }

    function clearAllTimeouts() {
        animationTimeouts.forEach(timeout => clearTimeout(timeout));
        animationTimeouts = [];
    }


    // Add CSS for shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            const types = ['Height', 'Weight', 'StopWatch', 'Timer'];
            const currentIndex = types.indexOf(currentSection);
            
            if (e.key === 'ArrowRight' && currentIndex < types.length - 1) {
                showMachineType(types[currentIndex + 1]);
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                showMachineType(types[currentIndex - 1]);
            }
        });

        // Add hover effects
        document.querySelectorAll('.comparison-card, .example-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Smooth scroll to top when changing sections
        document.querySelectorAll('.type-nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    });


            
    // ######################### Height  #####################################
    {
        const items = [
            { emoji: '🦒', answer: 'tall', name: 'Giraffe' },
            { emoji: '🐭', answer: 'short', name: 'Mouse' },
            { emoji: '🌳', answer: 'tall', name: 'Tree' },
            { emoji: '🌱', answer: 'short', name: 'Seedling' },
            { emoji: '🏢', answer: 'tall', name: 'Skyscraper' },
            { emoji: '🪑', answer: 'short', name: 'Chair' },
            { emoji: '🐘', answer: 'tall', name: 'Elephant' },
            { emoji: '🐱', answer: 'short', name: 'Cat' },
            { emoji: '🗼', answer: 'tall', name: 'Eiffel Tower' },
            { emoji: '🐜', answer: 'short', name: 'Ant' },
            { emoji: '🌴', answer: 'tall', name: 'Palm Tree' },
            { emoji: '🍄', answer: 'short', name: 'Mushroom' },
            { emoji: '🦘', answer: 'tall', name: 'Kangaroo' },
            { emoji: '🐇', answer: 'short', name: 'Rabbit' },
            { emoji: '🏔️', answer: 'tall', name: 'Mountain' },
            { emoji: '🐢', answer: 'short', name: 'Turtle' },
            { emoji: '🚀', answer: 'tall', name: 'Rocket' },
            { emoji: '🐌', answer: 'short', name: 'Snail' }
        ];
            
        const TOTAL_QUESTIONS = 10;
        let score = 0;
        let currentQuestion = 1;
        let streak = 0;
        let currentItem;
        let usedItems = [];
        let gameStarted = false;

        function startTallGame() {
            gameStarted = true;
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('statsContainer').style.display = 'flex';
            document.getElementById('progressContainer').style.display = 'block';
            document.getElementById('gameArea').style.display = 'block';
            loadNewItem();
        }
            
        function loadNewItem() {
            // Reset used items if all have been shown
            if (usedItems.length >= items.length) {
                usedItems = [];
            }
            
            // Filter out recently used items
            let availableItems = items.filter(item => !usedItems.includes(item));
            
            currentItem = availableItems[Math.floor(Math.random() * availableItems.length)];
            usedItems.push(currentItem);
            
            document.getElementById('emoji').textContent = currentItem.emoji;
            document.getElementById('itemName').textContent = currentItem.name;
            document.getElementById('emoji').style.animation = 'none';
            
            setTimeout(() => {
                document.getElementById('emoji').style.animation = 'bounce 1s ease-in-out';
            }, 10);
            
            document.getElementById('feedback').textContent = '';
            document.getElementById('feedback').className = 'feedback';
            
            // Update progress bar
            const progress = (currentQuestion / TOTAL_QUESTIONS) * 100;
            document.getElementById('progressBar').style.width = `${progress}%`;
            
            // Update question counter
            document.getElementById('questionCount').textContent = `${currentQuestion}/${TOTAL_QUESTIONS}`;
        }
            
        function checkTallAnswer(answer) {
            const feedback = document.getElementById('feedback');
            const isCorrect = answer === currentItem.answer;
            
            if (isCorrect) {
                score++;
                streak++;
                feedback.innerHTML = `<i class="fas fa-check-circle"></i> Correct!`;
                feedback.className = 'feedback correct';
                
                // Visual celebration
                document.getElementById('emoji').style.transform = 'scale(1.3) rotate(5deg)';
            } else {
                streak = 0;
                feedback.innerHTML = `<i class="fas fa-times-circle"></i> Wrong! It's ${currentItem.answer === 'tall' ? 'Tall' : 'Short'}`;
                feedback.className = 'feedback wrong';
                
                // Visual feedback for wrong answer
                document.getElementById('emoji').style.transform = 'scale(0.9) rotate(-5deg)';
            }
            
            // Reset transform after animation
            setTimeout(() => {
                document.getElementById('emoji').style.transform = 'scale(1) rotate(0deg)';
            }, 1500);
            
            updateStats();
                
            // Move to next question or show results
            setTimeout(() => {
                if (currentQuestion < TOTAL_QUESTIONS) {
                    currentQuestion++;
                    loadNewItem();
                } else {
                    showResults();
                }
            }, 1500);
        }
        
        function updateStats() {
            document.getElementById('score').textContent = score;
            document.getElementById('streak').textContent = streak;
            
            const accuracy = currentQuestion > 0 ? Math.round((score / currentQuestion) * 100) : 0;
            document.getElementById('accuracy').textContent = `${accuracy}%`;
        }
            
        function showResults() {
            document.getElementById('gameArea').style.display = 'none';
            document.getElementById('statsContainer').style.display = 'none';
            document.getElementById('progressContainer').style.display = 'none';
            document.getElementById('resultsScreen').style.display = 'block';
            
            document.getElementById('finalScore').textContent = `${score}/${TOTAL_QUESTIONS}`;
            
            // Set result message and emoji based on score
            let message = '';
            let emoji = '';
            
            if (score === TOTAL_QUESTIONS) {
                message = 'Perfect! You got all questions right! 🏆';
                emoji = '🏆';
            } else if (score >= TOTAL_QUESTIONS * 0.8) {
                message = 'Excellent! Great job! 🌟';
                emoji = '🎉';
            } else if (score >= TOTAL_QUESTIONS * 0.6) {
                message = 'Good job! Well done! 👍';
                emoji = '👍';
            } else if (score >= TOTAL_QUESTIONS * 0.4) {
                message = 'Not bad! Keep practicing! 🙂';
                emoji = '🙂';
            } else {
                message = 'Keep trying! You can do better! 💪';
                emoji = '💪';
            }
                
            document.getElementById('scoreMessage').textContent = message;
            document.getElementById('resultEmoji').textContent = emoji;
        }
        
        function restartHeightGame() {
            score = 0;
            currentQuestion = 1;
            streak = 0;
            usedItems = [];
            
            document.getElementById('resultsScreen').style.display = 'none';
            document.getElementById('startScreen').style.display = 'block';
        }
    }


    // ######################### Weight #####################################
    {
        const gameState = {
            totalScore: 0,
            gamesPlayed: 0,
            correctAnswers: 0,
            currentGame: null,
            fruitsScore: 0,
            animalsScore: 0,
            mixedScore: 0
        };

        // Game data
        const fruits = [
            { name: 'Apple', icon: '🍎', weight: 150, fact: 'Apples float in water because 25% of their volume is air!' },
            { name: 'Banana', icon: '🍌', weight: 120, fact: 'Bananas are berries, but strawberries are not!' },
            { name: 'Orange', icon: '🍊', weight: 130, fact: 'Oranges are a great source of Vitamin C!' },
            { name: 'Strawberry', icon: '🍓', weight: 12, fact: 'Strawberries are the only fruit with seeds on the outside!' },
            { name: 'Watermelon', icon: '🍉', weight: 2000, fact: 'Watermelons are 92% water!' },
            { name: 'Pineapple', icon: '🍍', weight: 1000, fact: 'It takes almost 3 years for a pineapple to grow!' }
        ];

        const animals = [
            { name: 'Elephant', icon: '🐘', weight: 5000, fact: 'Elephants are the heaviest land animals!' },
            { name: 'Mouse', icon: '🐁', weight: 0.02, fact: 'Mice can squeeze through tiny holes as small as a dime!' },
            { name: 'Cat', icon: '🐱', weight: 4, fact: 'Cats can jump up to 6 times their height!' },
            { name: 'Dog', icon: '🐕', weight: 15, fact: 'Dogs have an amazing sense of smell!' },
            { name: 'Lion', icon: '🦁', weight: 190, fact: 'A lion\'s roar can be heard up to 5 miles away!' },
            { name: 'Giraffe', icon: '🦒', weight: 800, fact: 'Giraffes have the same number of neck bones as humans!' }
        ];

        const mixedItems = [
            { name: 'Book', icon: '📚', weight: 500, fact: 'The heaviest book in the world weighs over 1,400 pounds!' },
            { name: 'Apple', icon: '🍎', weight: 150, fact: 'There are more than 7,500 varieties of apples worldwide!' },
            { name: 'Ball', icon: '⚽', weight: 430, fact: 'The first soccer balls were made from animal bladders!' },
            { name: 'Pencil', icon: '✏️', weight: 5, fact: 'The average pencil can draw a line 35 miles long!' },
            { name: 'Bottle', icon: '🧴', weight: 300, fact: 'Plastic bottles can take up to 450 years to decompose!' },
            { name: 'Toy Car', icon: '🚗', weight: 200, fact: 'The first toy cars were made in the early 1900s!' }
        ];

        // Current game state
        let currentFruitPair = [0, 1];
        let currentAnimalPair = [0, 1];
        let currentMixedPair = [0, 1];

        // Initialize the game
        function init() {
            updateStats();
            generateFruitQuestion();
            generateAnimalQuestion();
            generateMixedQuestion();
        }

        // Start a specific game
        function startWeightGame(game) {
            gameState.currentGame = game;
            gameState.gamesPlayed++;
            
            // Hide all screens
            document.querySelectorAll('.game-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Show the selected game screen
            document.getElementById(`${game}-screen`).classList.add('active');
            
            updateStats();
        }

        // Return to main menu
        function backToMenu() {
            gameState.currentGame = null;
            
            // Hide all screens
            document.querySelectorAll('.game-screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Show menu screen
            document.getElementById('menu-screen').classList.add('active');
            
            updateStats();
        }

        // Update statistics display
        function updateStats() {
            document.getElementById('total-score').textContent = gameState.totalScore;
            document.getElementById('games-played').textContent = gameState.gamesPlayed;
            document.getElementById('correct-answers').textContent = gameState.correctAnswers;
            
            document.getElementById('fruits-score').textContent = gameState.fruitsScore;
            document.getElementById('animals-score').textContent = gameState.animalsScore;
            document.getElementById('mixed-score').textContent = gameState.mixedScore;
        }

        // Fruit Game Functions
        function generateFruitQuestion() {
            let index1 = Math.floor(Math.random() * fruits.length);
            let index2 = Math.floor(Math.random() * fruits.length);
            
            // Make sure we have different fruits
            while (index2 === index1) {
                index2 = Math.floor(Math.random() * fruits.length);
            }
            
            currentFruitPair = [index1, index2];
            
            // Update UI
            document.getElementById('fruit1-icon').textContent = fruits[index1].icon;
            document.getElementById('fruit1-name').textContent = fruits[index1].name;
            document.getElementById('fruit1-weight').textContent = fruits[index1].weight;
            
            document.getElementById('fruit2-icon').textContent = fruits[index2].icon;
            document.getElementById('fruit2-name').textContent = fruits[index2].name;
            document.getElementById('fruit2-weight').textContent = fruits[index2].weight;
            
            // Update fact (randomly select one of the two fruits)
            const factIndex = Math.random() > 0.5 ? index1 : index2;
            document.getElementById('fruit-fact').textContent = `Did you know? ${fruits[factIndex].fact}`;
        }

        // Animal Game Functions
        function generateAnimalQuestion() {
            let index1 = Math.floor(Math.random() * animals.length);
            let index2 = Math.floor(Math.random() * animals.length);
            
            // Make sure we have different animals
            while (index2 === index1) {
                index2 = Math.floor(Math.random() * animals.length);
            }
            
            currentAnimalPair = [index1, index2];
            
            // Update UI
            document.getElementById('animal1-icon').textContent = animals[index1].icon;
            document.getElementById('animal1-name').textContent = animals[index1].name;
            document.getElementById('animal1-weight').textContent = animals[index1].weight;
            
            document.getElementById('animal2-icon').textContent = animals[index2].icon;
            document.getElementById('animal2-name').textContent = animals[index2].name;
            document.getElementById('animal2-weight').textContent = animals[index2].weight;
            
            // Update fact (randomly select one of the two animals)
            const factIndex = Math.random() > 0.5 ? index1 : index2;
            document.getElementById('animal-fact').textContent = `Did you know? ${animals[factIndex].fact}`;
        }

        // Mixed Game Functions
        function generateMixedQuestion() {
            let index1 = Math.floor(Math.random() * mixedItems.length);
            let index2 = Math.floor(Math.random() * mixedItems.length);
            
            // Make sure we have different items
            while (index2 === index1) {
                index2 = Math.floor(Math.random() * mixedItems.length);
            }
            
            currentMixedPair = [index1, index2];
            
            // Update UI
            document.getElementById('mixed1-icon').textContent = mixedItems[index1].icon;
            document.getElementById('mixed1-name').textContent = mixedItems[index1].name;
            document.getElementById('mixed1-weight').textContent = mixedItems[index1].weight;
            
            document.getElementById('mixed2-icon').textContent = mixedItems[index2].icon;
            document.getElementById('mixed2-name').textContent = mixedItems[index2].name;
            document.getElementById('mixed2-weight').textContent = mixedItems[index2].weight;
            
            // Update fact (randomly select one of the two items)
            const factIndex = Math.random() > 0.5 ? index1 : index2;
            document.getElementById('mixed-fact').textContent = `Did you know? ${mixedItems[factIndex].fact}`;
        }

        // Check answer for all game types
        function checkAnswer(gameType, selected) {
            let items, currentPair, scoreField, messageEl;
            
            if (gameType === 'fruits') {
                items = fruits;
                currentPair = currentFruitPair;
                scoreField = 'fruitsScore';
                messageEl = document.getElementById('fruits-message');
            } else if (gameType === 'animals') {
                items = animals;
                currentPair = currentAnimalPair;
                scoreField = 'animalsScore';
                messageEl = document.getElementById('animals-message');
            } else {
                items = mixedItems;
                currentPair = currentMixedPair;
                scoreField = 'mixedScore';
                messageEl = document.getElementById('mixed-message');
            }
            
            const item1 = items[currentPair[0]];
            const item2 = items[currentPair[1]];
            
            const correct = selected === 0 ? 
                item1.weight > item2.weight : 
                item2.weight > item1.weight;
            
            if (correct) {
                messageEl.textContent = '🎉 Excellent! Correct answer!';
                messageEl.className = 'message correct';
                gameState[scoreField] += 2;
                gameState.totalScore += 2;
                gameState.correctAnswers++;
            } else {
                messageEl.textContent = '❌ Try again!';
                messageEl.className = 'message incorrect';
            }
            
            // Generate new question after delay
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'message';
                
                if (gameType === 'fruits') {
                    generateFruitQuestion();
                } else if (gameType === 'animals') {
                    generateAnimalQuestion();
                } else {
                    generateMixedQuestion();
                }
                
                updateStats();
            }, 2000);
        }

        // Initialize the game when page loads
        window.onload = init;
    }

    // ####################### StopWatch ##################################
    {
        // State variables
        let time = 0;
        let isRunning = false;
        let intervalId = null;

        // DOM elements
        const timeDisplay = document.getElementById('timeDisplay');
        const statusDisplay = document.getElementById('statusDisplay');
        const stopWatch_startBtn = document.getElementById('stopWatch_startBtn');
        const stopWatch_stopBtn = document.getElementById('stopWatch_stopBtn');
        const stopWatch_resetBtn = document.getElementById('stopWatch_resetBtn');
        const pulseRing = document.getElementById('pulseRing');

        // Format time function
        function formatTime(milliseconds) {
            const mins = Math.floor(milliseconds / 60000);
            const secs = Math.floor((milliseconds % 60000) / 1000);
            const ms = Math.floor((milliseconds % 1000) / 10);
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
        }

        // Update display
        function updateDisplay() {
            timeDisplay.textContent = formatTime(time);
            statusDisplay.textContent = isRunning ? 'Running' : 'Stopped';
            
            if (isRunning) {
                pulseRing.style.display = 'block';
                stopWatch_startBtn.disabled = true;
                stopWatch_stopBtn.disabled = false;
            } else {
                pulseRing.style.display = 'none';
                stopWatch_startBtn.disabled = false;
                stopWatch_stopBtn.disabled = true;
            }
        }

        // Start the stopwatch
        function startStopwatch() {
            if (isRunning) return;
            
            isRunning = true;
            const startTime = Date.now() - time;
            
            intervalId = setInterval(() => {
                time = Date.now() - startTime;
                updateDisplay();
            }, 10);
            
            updateDisplay();
        }

        // Stop the stopwatch
        function stopStopwatch() {
            if (!isRunning) return;
            
            isRunning = false;
            clearInterval(intervalId);
            updateDisplay();
        }

        // Reset the stopwatch
        function resetStopwatch() {
            isRunning = false;
            clearInterval(intervalId);
            time = 0;
            updateDisplay();
        }

        // Event listeners
        stopWatch_startBtn.addEventListener('click', startStopwatch);
        stopWatch_stopBtn.addEventListener('click', stopStopwatch);
        stopWatch_resetBtn.addEventListener('click', resetStopwatch);

        // Initialize display
        updateDisplay();
    }



    // ######################### Timer #####################################
    {
        // State variables
        let minutes = 5;
        let seconds = 0;
        let totalSeconds = 300;
        let isRunning = false;
        let isFinished = false;
        let intervalId = null;
        let initialTotalSeconds = 300;

        // DOM elements
        const minutesInput = document.getElementById('minutesInput');
        const secondsInput = document.getElementById('secondsInput');
        const timer_applyBtn = document.getElementById('timer_applyBtn');
        const timeDisplay = document.getElementById('timeDisplay');
        const timeText = document.getElementById('timeText');
        const finishedText = document.getElementById('finishedText');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const timer_startBtn = document.getElementById('timer_startBtn');
        const timer_stopBtn = document.getElementById('timer_stopBtn');
        const timer_resetBtn = document.getElementById('timer_resetBtn');
        const infoText = document.getElementById('infoText');

        // Format time for display
        function formatTime(minutes, seconds) {
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        // Update display
        function updateDisplay() {
            const displayMinutes = Math.floor(totalSeconds / 60);
            const displaySeconds = totalSeconds % 60;
            
            timeText.textContent = formatTime(displayMinutes, displaySeconds);
            
            // Update progress bar
            const progress = ((initialTotalSeconds - totalSeconds) / initialTotalSeconds) * 100;
            progressBar.style.width = `${progress}%`;
            progressPercent.textContent = `${Math.round(progress)}%`;
            
            // Update UI based on state
            if (isFinished) {
                timeDisplay.classList.add('finished');
                finishedText.style.display = 'block';
                timer_startBtn.style.display = 'none';
                timer_stopBtn.style.display = 'none';
                infoText.innerHTML = '<p>Time\'s up! Press RESET to start again</p>';
            } else if (isRunning) {
                timeDisplay.classList.remove('finished');
                finishedText.style.display = 'none';
                timer_startBtn.style.display = 'none';
                timer_stopBtn.style.display = 'flex';
                infoText.innerHTML = '<p><i class="fas fa-hourglass-half"></i> Timer is running...</p>';
            } else {
                timeDisplay.classList.remove('finished');
                finishedText.style.display = 'none';
                timer_startBtn.style.display = 'flex';
                timer_stopBtn.style.display = 'none';
                
                if (totalSeconds === 0) {
                    infoText.innerHTML = '<p>Set time first</p>';
                } else {
                    infoText.innerHTML = '<p>Press START to begin</p>';
                }
            }
            
            // Update input fields
            minutesInput.value = minutes;
            secondsInput.value = seconds;
            
            // Disable inputs when running
            minutesInput.disabled = isRunning;
            secondsInput.disabled = isRunning;
            timer_applyBtn.disabled = isRunning;
        }

        // Start the timer
        function startTimer() {
            if (isRunning || totalSeconds === 0) return;
            
            isRunning = true;
            isFinished = false;
            
            intervalId = setInterval(() => {
                if (totalSeconds <= 1) {
                    clearInterval(intervalId);
                    isRunning = false;
                    isFinished = true;
                    totalSeconds = 0;
                    updateDisplay();
                    
                    // Play completion sound
                    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
                    audio.play().catch(e => console.log("Audio play failed:", e));
                    return;
                }
                
                totalSeconds--;
                updateDisplay();
            }, 1000);
            
            updateDisplay();
        }

        // Stop the timer
        function stopTimer() {
            if (!isRunning) return;
            
            isRunning = false;
            clearInterval(intervalId);
            updateDisplay();
        }

        // Reset the timer
        function resetTimer() {
            isRunning = false;
            isFinished = false;
            clearInterval(intervalId);
            
            // Reset to current input values
            const newTotal = minutes * 60 + seconds;
            totalSeconds = newTotal;
            initialTotalSeconds = newTotal;
            
            updateDisplay();
        }

        // Apply time from inputs
        function applyTime() {
            if (isRunning) return;
            
            minutes = parseInt(minutesInput.value) || 0;
            seconds = parseInt(secondsInput.value) || 0;
            
            // Ensure seconds are between 0 and 59
            if (seconds > 59) {
                seconds = 59;
                secondsInput.value = 59;
            }
            
            const newTotal = minutes * 60 + seconds;
            totalSeconds = newTotal;
            initialTotalSeconds = newTotal;
            isFinished = false;
            
            updateDisplay();
        }

        // Event listeners
        timer_startBtn.addEventListener('click', startTimer);
        timer_stopBtn.addEventListener('click', stopTimer);
        timer_resetBtn.addEventListener('click', resetTimer);
        timer_applyBtn.addEventListener('click', applyTime);

        // Input validation
        minutesInput.addEventListener('change', function() {
            minutes = Math.max(0, parseInt(this.value) || 0);
            this.value = minutes;
        });

        secondsInput.addEventListener('change', function() {
            seconds = Math.max(0, Math.min(59, parseInt(this.value) || 0));
            this.value = seconds;
        });

        // Initialize display
        updateDisplay();
    }


}

