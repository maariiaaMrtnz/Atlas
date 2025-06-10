// Obtén el canvas y el contexto
const canvas = document.getElementById('juego');
const ctx = canvas.getContext('2d');

// Ajusta el tamaño del canvas
canvas.width = 480;
canvas.height = 480;

// Carga la imagen del avión
const imgAvion = new Image();
imgAvion.src = 'img/avion.png'; 

// Variables del juego
const avion = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    gravedad: 0.1,  
    elevar: -3.5,      
    vel: 0,
    angulo: 0 
};

let tuberias = [];
let tuberiaWidth = 50;
let gap = 150;
let frame = 0;
let puntos = 0;
let isGameOver = false;
let animationId; 
let velocidadJuego = 0.5; 
let colorTuberias = '#008000'; 
let juegoIniciado = false; 
let rotacionCompleta = false;

// Función para animar la vuelta del avión antes de empezar
function animarVueltaAvion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(avion.x + avion.width / 2, avion.y + avion.height / 2);
    ctx.rotate(avion.angulo * Math.PI / 180);
    ctx.drawImage(imgAvion, -avion.width / 2, -avion.height / 2, avion.width, avion.height);
    ctx.restore();
    
    avion.angulo += 10;
    if (avion.angulo >= 360) {
        rotacionCompleta = true;
        avion.angulo = 0;
        gameLoop(); 
        return;
    }
    requestAnimationFrame(animarVueltaAvion);
}

// Función para dibujar el avión
function drawAvion() {
    avion.vel += avion.gravedad;
    avion.y += avion.vel;

    ctx.drawImage(imgAvion, avion.x, avion.y, avion.width, avion.height);
}

// Función para manejar el salto del avión
function salto() {
    if (isGameOver) {
        reiniciarJuego();
    } else {
        avion.vel = avion.elevar;
    }
}

// Función para dibujar las tuberías
function drawTuberias() {
    if (frame % (150 / velocidadJuego) === 0 && !isGameOver) {  
        let tuberiaHeight = Math.floor(Math.random() * (canvas.height - gap));
        tuberias.push({ x: canvas.width, y: tuberiaHeight });
    }

    for (let i = 0; i < tuberias.length; i++) {
        let tuberia = tuberias[i];

        ctx.fillStyle = colorTuberias;
        ctx.fillRect(tuberia.x, 0, tuberiaWidth, tuberia.y);
        ctx.fillRect(tuberia.x, tuberia.y + gap, tuberiaWidth, canvas.height - tuberia.y - gap);
        tuberia.x -= velocidadJuego;

        if (tuberia.x + tuberiaWidth < avion.x && !tuberia.passed) {
            tuberia.passed = true;
            puntos++;
        }

        if (tuberia.x + tuberiaWidth < 0) {
            tuberias.shift();
        }

        if (
            avion.x + avion.width > tuberia.x && 
            avion.x < tuberia.x + tuberiaWidth && 
            (avion.y < tuberia.y || avion.y + avion.height > tuberia.y + gap)
        ) {
            isGameOver = true;
        }

        if (avion.y + avion.height >= canvas.height || avion.y <= 0) {
            isGameOver = true;
        }
    }
}

// Función para dibujar el puntaje
function drawPuntos() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Puntos: ' + puntos, 10, 30);
}

// Función principal del juego
function gameLoop() {
    if (!juegoIniciado) return;
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('¡GAME OVER!', canvas.width / 4, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Pulsa la tecla espacio para reiniciar', canvas.width / 6, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAvion();
    drawTuberias();
    drawPuntos();
    frame++;
    animationId = requestAnimationFrame(gameLoop);
}

// Evento de salto cuando se presiona la tecla espacio
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        salto();
    }
});

// Función para iniciar el juego
function iniciarJuego() {
    const nombreJugador = document.getElementById('nombreJugador').value.trim();
    const velocidadInput = document.getElementById('velocidadJuego').value;
    
    if (!nombreJugador) {
        alert('Por favor, ingresa tu nombre antes de iniciar.');
        return;
    }
    
    if (!juegoIniciado) {
        juegoIniciado = true;
        velocidadJuego = parseInt(velocidadInput);
        colorTuberias = document.getElementById('colorTuberias').value;
        animarVueltaAvion(); 
    }
}

document.getElementById('btnIniciar').addEventListener('click', iniciarJuego);

function reiniciarJuego() {
    cancelAnimationFrame(animationId);
    avion.y = canvas.height / 2;
    avion.vel = 0;
    tuberias = [];
    frame = 0;
    puntos = 0;
    isGameOver = false;
    juegoIniciado = false;
    rotacionCompleta = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameLoop();
}