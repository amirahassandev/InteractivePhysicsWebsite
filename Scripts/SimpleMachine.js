
// ####### Simple Machines ####### //
{
    let currentSection = 'lever';
    let animationTimeouts = [];
    function showMachineType(type) {
        // Clear any running animations
        clearAllTimeouts();

        // Hide all sections
        document.querySelectorAll('.friction-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${type}-section`).classList.add('active');

        // Update navigation
        document.querySelectorAll('.type-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.closest('.type-nav-btn').classList.add('active');

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
            const types = ['lever', 'pulley', 'inclined'];
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


            
    // Lever
    {
        const fulcrum = document.getElementById('fulcrum');
        const load = document.getElementById('load');
        const force = document.getElementById('force');

        const fulcrumSlider = document.getElementById('fulcrumSlider');
        const loadSlider = document.getElementById('loadSlider');
        const forceSlider = document.getElementById('forceSlider');

        function updatePositions() {
        fulcrum.style.left = fulcrumSlider.value + 'px';
        load.style.left = loadSlider.value + 'px';
        force.style.left = forceSlider.value + 'px';
        }

        fulcrumSlider.addEventListener('input', updatePositions);
        loadSlider.addEventListener('input', updatePositions);
        forceSlider.addEventListener('input', updatePositions);

        function checkClass() {
        const f = parseInt(fulcrumSlider.value);
        const l = parseInt(loadSlider.value);
        const fo = parseInt(forceSlider.value);

        let positions = [
            { name: "Fulcrum", value: f },
            { name: "Load", value: l },
            { name: "Force", value: fo }
        ];
        positions.sort((a, b) => a.value - b.value);

        let middle = positions[1].name;
        let result_lever = "";
        if (middle === "Fulcrum") result_lever = "Class 1 Lever";
        else if (middle === "Load") result_lever = "Class 2 Lever";
        else if (middle === "Force") result_lever = "Class 3 Lever";

        document.getElementById('result_lever').innerText = "This is: " + result_lever;
        }

        updatePositions();
    }


    // Pulley 
    {
        let currentPulleyType = null;
        const animationContainer = document.getElementById('animationContainer');
        const pulleyInfo = document.getElementById('pulleyInfo');
        const effortInfo = document.getElementById('effortInfo');
        
        function changePulleyType(type) {
            currentPulleyType = type;
            resetAnimation();
                    
            // Clear previous elements
            const elementsToRemove = document.querySelectorAll('.pulley-wheel, .rope, .weight, .person, .effort-value');
            elementsToRemove.forEach(el => el.remove());
            
            // Create new elements based on type
            if (type === 'fixed') {
                createFixedPulley();
                pulleyInfo.textContent = "Fixed Pulley: Changes direction only. You need the same force to lift the load but it's easier!";
                effortInfo.textContent = "Effort Required: 100N (same as direct lift)";
            } else if (type === 'movable') {
                createMovablePulley();
                pulleyInfo.textContent = "Movable Pulley: Halves the effort. You need only half the force to lift the load!";
                effortInfo.textContent = "Effort Required: 50N (half of direct lift force)";
            } else if (type === 'compound') {
                createCompoundPulley();
                pulleyInfo.textContent = "Compound System: A mix of fixed and movable pulleys. It quarters the effort!";
                effortInfo.textContent = "Effort Required: 25N (quarter of direct lift force)";
            }
        }
                
        function createFixedPulley() {
            // Fixed pulley
            const pulley = document.createElement('div');
            pulley.className = 'pulley-wheel fixed-pulley';
            animationContainer.appendChild(pulley);
            
            // Rope
            const rope = document.createElement('div');
            rope.className = 'rope';
            rope.style.height = '200px';
            rope.style.top = '20px';
            animationContainer.appendChild(rope);
            
            // Weight
            const weight = document.createElement('div');
            weight.className = 'weight';
            weight.style.bottom = '70px';
            weight.style.left = '50%';
            weight.style.transform = 'translateX(-50%)';
            weight.textContent = '100N';
            animationContainer.appendChild(weight);
            
            // Person
            const person = document.createElement('div');
            person.className = 'person';
            person.style.left = '30%';
            const personHead = document.createElement('div');
            personHead.className = 'person-head';
            const personBody = document.createElement('div');
            personBody.className = 'person-body';
            person.appendChild(personHead);
            person.appendChild(personBody);
            animationContainer.appendChild(person);
            
            // Effort value
            const effort = document.createElement('div');
            effort.className = 'effort-value';
            effort.style.bottom = '100px';
            effort.style.left = '25%';
            effort.textContent = 'Effort: 100N';
            animationContainer.appendChild(effort);
        }
        
        function createMovablePulley() {
            // Movable pulley
            const pulley = document.createElement('div');
            pulley.className = 'pulley-wheel movable-pulley';
            animationContainer.appendChild(pulley);
            
            // Rope
            const rope = document.createElement('div');
            rope.className = 'rope';
            rope.style.height = '120px';
            rope.style.top = '20px';
            animationContainer.appendChild(rope);
            
            // Weight
            const weight = document.createElement('div');
            weight.className = 'weight';
            weight.style.bottom = '70px';
            weight.style.left = '50%';
            weight.style.transform = 'translateX(-50%)';
            weight.textContent = '100N';
            animationContainer.appendChild(weight);
            
            // Person
            const person = document.createElement('div');
            person.className = 'person';
            person.style.left = '30%';
            const personHead = document.createElement('div');
            personHead.className = 'person-head';
            const personBody = document.createElement('div');
            personBody.className = 'person-body';
            person.appendChild(personHead);
            person.appendChild(personBody);
            animationContainer.appendChild(person);
            
            // Effort value
            const effort = document.createElement('div');
            effort.className = 'effort-value';
            effort.style.bottom = '100px';
            effort.style.left = '25%';
            effort.textContent = 'Effort: 50N';
            animationContainer.appendChild(effort);
        }
                
        function createCompoundPulley() {
            // Compound pulleys
            const pulley1 = document.createElement('div');
            pulley1.className = 'pulley-wheel compound-pulley-1';
            animationContainer.appendChild(pulley1);
            
            const pulley2 = document.createElement('div');
            pulley2.className = 'pulley-wheel compound-pulley-2';
            animationContainer.appendChild(pulley2);
            
            // Rope
            const rope = document.createElement('div');
            rope.className = 'rope';
            rope.style.height = '200px';
            rope.style.top = '20px';
            rope.style.left = '40%';
            animationContainer.appendChild(rope);
            
            // Weight
            const weight = document.createElement('div');
            weight.className = 'weight';
            weight.style.bottom = '70px';
            weight.style.left = '40%';
            weight.textContent = '100N';
            animationContainer.appendChild(weight);
                    
            // Person
            const person = document.createElement('div');
            person.className = 'person';
            person.style.left = '20%';
            const personHead = document.createElement('div');
            personHead.className = 'person-head';
            const personBody = document.createElement('div');
            personBody.className = 'person-body';
            person.appendChild(personHead);
            person.appendChild(personBody);
            animationContainer.appendChild(person);
            
            // Effort value
            const effort = document.createElement('div');
            effort.className = 'effort-value';
            effort.style.bottom = '100px';
            effort.style.left = '15%';
            effort.textContent = 'Effort: 25N';
            animationContainer.appendChild(effort);
        }
                
        function liftLoad() {
            if (!currentPulleyType) {
                alert('Please select a pulley type first!');
                return;
            }
            
            const weight = document.querySelector('.weight');
            const person = document.querySelector('.person');
            const effort = document.querySelector('.effort-value');
            
            weight.classList.add('lifting');
            person.classList.add('pulling');
            
            if (effort) {
                effort.style.opacity = '0.7';
            }
        }
                
        function resetAnimation() {
            const weight = document.querySelector('.weight');
            const person = document.querySelector('.person');
            const effort = document.querySelector('.effort-value');
            
            if (weight) {
                weight.classList.remove('lifting');
                weight.style.transform = 'translateY(0)';
            }
            
            if (person) {
                person.classList.remove('pulling');
                person.style.transform = 'translateY(0)';
            }
            
            if (effort) {
                effort.style.opacity = '1';
            }
        }
                
        // Initial setup
        window.onload = function() {
            changePulleyType('fixed');
        };
    }
        
} 
