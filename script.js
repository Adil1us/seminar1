const canvas = document.getElementById('web-canvas');
const ctx = canvas.getContext('2d');

// Настраиваем разрешение canvas (чтобы было четко на Retina экранах)
function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

// Конфигурация
const config = {
    particleCount: 250,    // Количество точек
    connectionDist: 100,  // Расстояние, на котором появляются линии
    speed: 0.5,           // Скорость движения
    color: 'rgba(78, 205, 196, 1)' // Цвет точек (бирюзовый)
};

const particles = [];

// Класс для точки
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Случайная скорость
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * 2 + 1; // Размер от 1 до 3px
    }

    update() {
        // Движение
        this.x += this.vx;
        this.y += this.vy;

        // Отскакивание от стенок
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Создаем стаю точек
for (let i = 0; i < config.particleCount; i++) {
    particles.push(new Particle());
}

// Главный цикл анимации
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Обновляем и рисуем все точки
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // 2. Рисуем линии между близкими точками
    connectParticles();

    requestAnimationFrame(animate);
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDist) {
                // Чем ближе точки, тем ярче линия (эффект прозрачности)
                const opacity = 1 - (distance / config.connectionDist);
                ctx.strokeStyle = `rgba(78, 205, 196, ${opacity})`; // Тот же цвет, что и точки
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Запускаем
animate();