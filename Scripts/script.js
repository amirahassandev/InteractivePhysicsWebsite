
// Global variables
let currentLesson = 1;
let motionInterval = null;
let energyInterval = null;
let forceInterval = null;
let simInterval = null;
let completedQuizzes = new Set();
        
// Animation state variables
let ballPosition = { x: 50, y: 50 };
let ballVelocity = { x: 0, y: 0 };
let forceState = { left: false, right: false, both: false };
let simState = { velocity: 0, force: 0, gravity: false, friction: false };
        



// Lesson navigation
function showLesson(lessonNum) {
    // Clear all intervals
    clearAllIntervals();
    
    // Hide all lessons
    document.querySelectorAll('.lesson').forEach(lesson => {
        lesson.classList.remove('active');
    });
    
    // Show selected lesson
    document.getElementById(`lesson${lessonNum}`).classList.add('active');
    document.querySelectorAll('.lesson-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === lessonNum - 1);
    });

    currentLesson = lessonNum;
}

function clearAllIntervals() {
    if (motionInterval) clearInterval(motionInterval);
    if (energyInterval) clearInterval(energyInterval);
    if (forceInterval) clearInterval(forceInterval);
    if (simInterval) clearInterval(simInterval);
    motionInterval = energyInterval = forceInterval = simInterval = null;
}



        
// ####### Motion animations ####### //
{
    const ball = document.getElementById("motionBall");
    const canvas = document.getElementById("motionCanvas");

    // let motionInterval;
    let angle = 0;
    let direction = 1;
    let zigzagDir = 1;
    const originalX = 50;
    const originalY = 135;

    function stopMotion() {
        clearInterval(motionInterval);
        ball.style.left = originalX + "px";
        ball.style.top = originalY + "px";
    }

    function startLinearMotion() {
        clearInterval(motionInterval);
        let pos = ball.offsetLeft;
        motionInterval = setInterval(() => {
            pos += 2;
            if (pos > canvas.offsetWidth - 30) pos = 0;
            ball.style.left = pos + "px";
        }, 20);
    }

    function startCircularMotion() {
        clearInterval(motionInterval);
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;
        const radius = 80;
        angle = 0;
        motionInterval = setInterval(() => {
            const x = centerX + radius * Math.cos(angle) - 15;
            const y = centerY + radius * Math.sin(angle) - 15;
            ball.style.left = x + "px";
            ball.style.top = y + "px";
            angle += 0.05;
        }, 20);
    }

    function startZigzag() {
        clearInterval(motionInterval);
        let x = ball.offsetLeft;
        let y = ball.offsetTop;
        let dx = 3, dy = 3;
        motionInterval = setInterval(() => {
            x += dx;
            y += dy * zigzagDir;
            if (x > canvas.offsetWidth - 30 || x < 0) dx *= -1;
            if (y > canvas.offsetHeight - 30 || y < 0) zigzagDir *= -1;
            ball.style.left = x + "px";
            ball.style.top = y + "px";
        }, 20);
    }

    function startVibrational() {
        clearInterval(motionInterval);


        const centerX = ball.offsetLeft;
        const centerY = ball.offsetTop;

        let angle = 0; 
        motionInterval = setInterval(() => {
            const x = centerX + Math.sin(angle) * 15; 
            const y = centerY; 
            
            ball.style.left = x + "px";
            ball.style.top = y + "px";

            angle += 0.4; 
        }, 20);
    }
}
           


// ####### Gravity & Energy ####### //
{
    const gravity_canvas = document.getElementById('gravity_canvas');
    const ctx = gravity_canvas.getContext('2d');

    const gravitySlider = document.getElementById('gravitySlider');
    const massSlider = document.getElementById('massSlider');
    const gravityValue = document.getElementById('gravityValue');
    const massValue = document.getElementById('massValue');
    const eqMass = document.getElementById('eqMass');
    const eqGravity = document.getElementById('eqGravity');
    const weightDisplay = document.getElementById('weight');

    const energyBar = document.getElementById('energyBar');

    let ball = {
        x: gravity_canvas.width / 2,
        y: 50,
        radius: 20,
        velocity: 0
    };

    let gravity = parseFloat(gravitySlider.value);
    let mass = parseFloat(massSlider.value);
    let animationId;
    let running = false;

    function updateValues() {
        gravity = parseFloat(gravitySlider.value);
        mass = parseFloat(massSlider.value);
        gravityValue.textContent = gravity;
        massValue.textContent = mass;
        eqMass.textContent = mass;
        eqGravity.textContent = gravity;
        weightDisplay.textContent = (mass * gravity).toFixed(2);
    }

    function updateEnergy() {
        const height = gravity_canvas.height - ball.y - ball.radius;
        const potential = mass * gravity * height;
        const kinetic = 0.5 * mass * Math.pow(ball.velocity, 2);
        const totalEnergy = potential + kinetic;

        // Normalize bar (relative to some max energy)
        const normalized = Math.min(totalEnergy / 5000, 1) * 100;
        energyBar.style.width = normalized + "%";
    }

    function drawBall() {
        ctx.clearRect(0, 0, gravity_canvas.width, gravity_canvas.height);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.closePath();
    }

    function animate() {
        if (!running) return;
            ball.velocity += gravity * 0.02;
            ball.y += ball.velocity * 0.02;

        if (ball.y + ball.radius > gravity_canvas.height) {
            ball.y = gravity_canvas.height - ball.radius;
            ball.velocity *= -0.6;
        }

        drawBall();
        updateEnergy();
        animationId = requestAnimationFrame(animate);
    }

    gravitySlider.addEventListener('input', updateValues);
    massSlider.addEventListener('input', updateValues);

    document.getElementById('gravity_startBtn').addEventListener('click', () => {
        ball.y = 50;
        ball.velocity = 0;
        running = true;
        animate();
    });

    document.getElementById('gravity_stopBtn').addEventListener('click', () => {
        running = false;
        cancelAnimationFrame(animationId);
    });

    document.getElementById('gravity_continueBtn').addEventListener('click', () => {
        if (!running) {
            running = true;
            animate();
        }
    });

        updateValues();
        drawBall();
}




// ####### Forces ####### //
{
    // balanced & unbalanced
    {
        const ball = document.getElementById("forceBall");
        const statusLabel = document.getElementById("forceStatus");
        const canvas = document.getElementById("forceCanvas");

        let position = 285;          
        let F_left = 0;                
        let F_right = 0;             
        const step = 50;               

        function clampPos(x) {
            const min = 0;
            const max = canvas.offsetWidth - ball.offsetWidth;
            return Math.max(min, Math.min(max, x));
        }

        function updateBall() {
            const net = F_left - F_right;
            if (net > 0) {
            position = clampPos(position + step);
            statusLabel.textContent = "Forces: Unbalanced (Pushed from Left → Moves Right)";
            } else if (net < 0) {
            position = clampPos(position - step);
            statusLabel.textContent = "Forces: Unbalanced (Pushed from Right → Moves Left)";
            } else {
            statusLabel.textContent = "Forces: Balanced (Equal & Opposite)";
            }
            ball.style.left = position + "px";
        }

        function applyForce(side) {
            if (side === "left") {
                F_left = 10;
                F_right = 0;
            } else if (side === "right") {
                F_right = 10;
                F_left = 0;
            } else if (side === "both") {
                F_left = 10;
                F_right = 10;
            }
            updateBall();
        }

        function resetForces() {
            F_left = 0;
            F_right = 0;
            position = 285;
            ball.style.left = position + "px";
            statusLabel.textContent = "Forces: Balanced";
        }
    }
            
    
    // Effects of forces
    {
        const obj = document.getElementById("deformableObject");
        let motionInterval;
        let direction = 1; 
        let posX = 250;
        let isMoving = false;

        function deformObject(action) {
            if (action === "Shape") {
                obj.style.width = "150px";
                obj.style.height = "30px";
                obj.textContent = "Deformed!";
                setTimeout(() => {
                    obj.style.width = "100px";
                    obj.style.height = "40px";
                    obj.textContent = "Object";
                }, 1000);
            }

            else if (action === "Direction") {
                direction *= -1;
                obj.textContent = (direction === 1 ? "Moving Right ➡️" : "⬅️ Moving Left");
            }

            else if (action === "Start Motion") {
                if (!isMoving) {
                    isMoving = true;
                    obj.textContent = "Start!";
                    motionInterval = setInterval(() => {
                        posX += direction * 5; // سرعة الحركة
                        obj.style.left = posX + "px";

                        // منع الخروج من حدود الكانفس
                        if (posX < 10) {
                            posX = 10;
                            direction = 1;
                        }
                        if (posX > 400) {
                            posX = 400;
                            direction = -1;
                        }
                    }, 50);
                }
            }

            else if (action === "Stop Motion") {
                clearInterval(motionInterval);
                isMoving = false;
                obj.textContent = "Stopped!";
            }
        }

        function resetShape() {
            clearInterval(motionInterval);
            isMoving = false;
            posX = 250;
            direction = 1;
            obj.style.left = posX + "px";
            obj.style.width = "100px";
            obj.style.height = "40px";
            obj.textContent = "Object";
        }
    }
}
        
        


// ####### Friction ####### //
{
    let currentSection = 'static';
    let animationTimeouts = [];
    function showFrictionType(type) {
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

    function resetAllSections() {
        resetStatic();
        resetSliding();
        resetRolling();
        resetFluid();
    }

    // Static Friction Functions
    function applyStaticForce(intensity) {
        clearAllTimeouts();
        const object = document.getElementById('static-object');
        const forceIndicator = document.getElementById('static-force');
        
        object.style.left = '50px';
        object.style.transition = 'none';

        const forces = {
            weak: { text: 'Weak Force Applied - Static Friction Holds', move: '55px', color: 'rgba(255, 193, 7, 0.9)' },
            medium: { text: 'Medium Force Applied - Still Holding!', move: '75px', color: 'rgba(255, 152, 0, 0.9)' },
            strong: { text: 'Strong Force - Static Friction Overcome!', move: 'calc(100% - 130px)', color: 'rgba(244, 67, 54, 0.9)' }
        };

        const force = forces[intensity];
        forceIndicator.textContent = force.text;
        forceIndicator.style.background = force.color;

        animationTimeouts.push(setTimeout(() => {
            object.style.transition = intensity === 'strong' ? 'left 2s ease-out' : 'left 0.3s ease-out';
            object.style.left = force.move;
        }, 500));

        if (intensity !== 'strong') {
            animationTimeouts.push(setTimeout(() => {
                object.style.transition = 'left 0.3s ease-in';
                object.style.left = '50px';
                forceIndicator.textContent = 'Force Released - Back to Rest';
                forceIndicator.style.background = 'rgba(76, 175, 80, 0.9)';
            }, 1500));
        }
    }

    function resetStatic() {
        const object = document.getElementById('static-object');
        const forceIndicator = document.getElementById('static-force');
        
        object.style.transition = 'left 0.5s ease';
        object.style.left = '50px';
        forceIndicator.textContent = 'No Force Applied';
        forceIndicator.style.background = 'rgba(0,0,0,0.8)';
    }

    // Sliding Friction Functions
    function startSliding(surfaceType) {
        clearAllTimeouts();
        const object = document.getElementById('sliding-object');
        const surface = document.getElementById('sliding-surface');
        const forceIndicator = document.getElementById('sliding-force');
        
        object.style.left = '50px';
        object.style.transition = 'none';

        const surfaces = {
            rough: { class: 'surface rough', text: 'Sliding on Rough Surface - High Friction', speed: '4s' },
            smooth: { class: 'surface smooth', text: 'Sliding on Smooth Surface - Medium Friction', speed: '2.5s' },
            ice: { class: 'surface ice', text: 'Sliding on Ice - Very Low Friction', speed: '1.5s' }
        };

        const surf = surfaces[surfaceType];
        surface.className = surf.class;
        forceIndicator.textContent = surf.text;
        forceIndicator.style.background = 'rgba(102, 126, 234, 0.9)';

        animationTimeouts.push(setTimeout(() => {
            object.style.transition = `left ${surf.speed} linear`;
            object.style.left = 'calc(100% - 130px)';
        }, 100));
    }


    function resetSliding() {
        const object = document.getElementById('sliding-object');
        const surface = document.getElementById('sliding-surface');
        const forceIndicator = document.getElementById('sliding-force');
        
        object.style.transition = 'left 0.5s ease';
        object.style.left = '50px';
        surface.className = 'surface';
        forceIndicator.textContent = 'Ready to Slide';
        forceIndicator.style.background = 'rgba(0,0,0,0.8)';
    }

    // Rolling Friction Functions
    function startRolling(type) {
        clearAllTimeouts();
        const object = document.getElementById('rolling-object');
        const wheel = document.getElementById('rolling-wheel');
        const forceIndicator = document.getElementById('rolling-force');
        
        object.style.left = '50px';
        object.style.transition = 'none';
        wheel.textContent = '';
        wheel.style.transform = 'rotate(0deg)';

        if (type === 'ball') {
            wheel.className = 'sphere';  
            forceIndicator.textContent = 'Ball Rolling - Very Low Friction';
        } else {
            wheel.className = 'wheel';
            forceIndicator.textContent = 'Wheel Rolling - Minimal Resistance';
        }

        forceIndicator.style.background = 'rgba(78, 205, 196, 0.9)';

        animationTimeouts.push(setTimeout(() => {
            object.style.transition = 'left 3s ease-out';
            wheel.style.transition = 'transform 3s ease-out';
            object.style.left = 'calc(100% - 130px)';
            wheel.style.transform = 'rotate(1080deg)';
        }, 100));
    }


    function compareRollingSliding() {
        clearAllTimeouts();
        const object = document.getElementById('rolling-object');
        const wheel = document.getElementById('rolling-wheel');
        const forceIndicator = document.getElementById('rolling-force');
        
        // First show sliding
        object.style.left = '50px';
        object.style.transition = 'none';
        wheel.className = 'block';
        wheel.textContent = 'SLIDING';
        wheel.style.transform = 'none';
        forceIndicator.textContent = 'Sliding Motion - High Friction';
        forceIndicator.style.background = 'rgba(255, 107, 107, 0.9)';

        animationTimeouts.push(setTimeout(() => {
            object.style.transition = 'left 4s linear';
            object.style.left = 'calc(100% - 130px)';
        }, 500));

        // Then reset and show rolling
        animationTimeouts.push(setTimeout(() => {
            object.style.left = '50px';
            object.style.transition = 'none';
            wheel.className = 'wheel';
            wheel.textContent = '';
            forceIndicator.textContent = 'Rolling Motion - Low Friction';
            forceIndicator.style.background = 'rgba(78, 205, 196, 0.9)';
        }, 5000));

        animationTimeouts.push(setTimeout(() => {
            object.style.transition = 'left 2s ease-out';
            wheel.style.transition = 'transform 2s ease-out';
            object.style.left = 'calc(100% - 130px)';
            wheel.style.transform = 'rotate(720deg)';
        }, 5500));
    }

          
    function resetRolling() {
        const object = document.getElementById('rolling-object');
        const wheel = document.getElementById('rolling-wheel');
        const forceIndicator = document.getElementById('rolling-force');
        
        object.style.transition = 'left 0.5s ease';
        object.style.left = '50px';
        wheel.className = 'wheel';
        wheel.style.transition = 'transform 0.5s ease';
        wheel.style.transform = 'rotate(0deg)';
        wheel.textContent = '';
        forceIndicator.textContent = 'Ready to Roll';
        forceIndicator.style.background = 'rgba(0,0,0,0.8)';
    }


    // Fluid Friction Functions
    function moveInFluid(fluid, speed) {
        clearAllTimeouts();
        const object = document.getElementById('fluid-object');
        const surface = document.getElementById('fluid-surface');
        const forceIndicator = document.getElementById('fluid-force');
        const sphere = document.getElementById('fluid-sphere');
        
        object.style.left = '50px';
        object.style.transition = 'none';

        const scenarios = {
            'air-slow': { surface: 'surface', text: 'Slow Motion in Air - Low Drag', speed: '4s', resistance: 'low' },
            'air-fast': { surface: 'surface', text: 'Fast Motion in Air - Higher Drag', speed: '1.5s', resistance: 'medium' },
            'water-slow': { surface: 'surface water', text: 'Slow Motion in Water - Medium Drag', speed: '5s', resistance: 'high' },
            'water-fast': { surface: 'surface water', text: 'Fast Motion in Water - High Drag', speed: '3s', resistance: 'very-high' }
        };

        const scenario = scenarios[`${fluid}-${speed}`];
        surface.className = scenario.surface;
        forceIndicator.textContent = scenario.text;
        
        const colors = {
            low: 'rgba(76, 175, 80, 0.9)',
            medium: 'rgba(255, 193, 7, 0.9)',
            high: 'rgba(255, 152, 0, 0.9)',
            'very-high': 'rgba(244, 67, 54, 0.9)'
        };
        
        forceIndicator.style.background = colors[scenario.resistance];

        // Add turbulence effect for high speeds
        if (speed === 'fast') {
            sphere.style.animation = 'shake 0.1s infinite';
        } else {
            sphere.style.animation = 'none';
        }

        animationTimeouts.push(setTimeout(() => {
            object.style.transition = `left ${scenario.speed} cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            object.style.left = 'calc(100% - 130px)';
        }, 100));
    }


    function resetFluid() {
        const object = document.getElementById('fluid-object');
        const surface = document.getElementById('fluid-surface');
        const forceIndicator = document.getElementById('fluid-force');
        const sphere = document.getElementById('fluid-sphere');
        
        object.style.transition = 'left 0.5s ease';
        object.style.left = '50px';
        surface.className = 'surface';
        sphere.style.animation = 'none';
        forceIndicator.textContent = 'Ready to Move Through Fluid';
        forceIndicator.style.background = 'rgba(0,0,0,0.8)';
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
            const types = ['static', 'sliding', 'rolling', 'fluid'];
            const currentIndex = types.indexOf(currentSection);
            
            if (e.key === 'ArrowRight' && currentIndex < types.length - 1) {
                showFrictionType(types[currentIndex + 1]);
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                showFrictionType(types[currentIndex - 1]);
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
} 






            

