const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const socket = io.connect("https://mysterious-ravine-22554.herokuapp.com/");

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .7

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png',
    width: 1904,
    height: 946
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player1 = new Fighter({
    position: {
        x: 100,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    },
    damage: 20,
})

const player2 = new Fighter({
    position: {
        x: 800,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    },
    damage: 10,
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255,255,255, 0.1'
    c.fillRect(0, 0, canvas.width, canvas.height)
    // socket.emit('animateP1', player1.)
    // socket.emit('animateP2', player2)
    // socket.on('animateP1', player1 => {
    //     player1.update()
    // })
    // socket.on('animateP2', player2 => {
    //     player2.update()
    // })
    player1.update()
    player2.update()

    player1.velocity.x = 0
    player2.velocity.x = 0

    //player1 movement
    if (keys.a.pressed && player1.lastKey === 'a') {
        player1.velocity.x = -5
        player1.switchSprite('run')
    } else if (keys.d.pressed && player1.lastKey === 'd') {
        player1.velocity.x = 5
        player1.switchSprite('run')
    } else {
        player1.switchSprite('idle')
    }

    //player1 jump
    if (player1.velocity.y < 0) {
        player1.switchSprite('jump')
    } else if (player1.velocity.y > 0) {
        player1.switchSprite('fall')
    }

    //player2 movement
    if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
        player2.velocity.x = -5
        player2.switchSprite('run')
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
        player2.velocity.x = 5
        player2.switchSprite('run')
    } else { player2.switchSprite('idle') }

    //player2 jump
    if (player2.velocity.y < 0) {
        player2.switchSprite('jump')
    } else if (player2.velocity.y > 0) {
        player2.switchSprite('fall')
    }

    // detect for collision & player2 gets hit
    if (
        rectangularCollision({
            rectangle1: player1,
            rectangle2: player2
        }) && player1.isAttacking && player1.framesCurrent === 4
    ) {
        player2.health -= player1.damage
        player1.isAttacking = false
        gsap.to('#player2Health', {
            width: player2.health + '%'
        })
        if (player2.health <= 0) {
            player2.switchSprite('death')
        } else player2.switchSprite('takeHit')
    }

    // if player1 misses 
    if (player1.isAttacking && player1.framesCurrent === 4) {
        player1.isAttacking = false
    }
    // detect for collision & player1 gets hit
    if (
        rectangularCollision({
            rectangle1: player2,
            rectangle2: player1
        }) && player2.isAttacking && player2.framesCurrent === 2
    ) {
        player1.health -= player2.damage
        player2.isAttacking = false
        gsap.to('#player1Health', {
            width: player1.health + '%'
        })
        if (player1.health <= 0) {
            player1.switchSprite('death')
        } else player1.switchSprite('takeHit')
    }

    // if player2 misses 
    if (player2.isAttacking && player2.framesCurrent === 2) {
        player2.isAttacking = false
    }

    //end game based on health
    if (player2.health <= 0 || player1.health <= 0) {
        determineWinner({ player1, player2, timerId })
    }

}

animate()

document.addEventListener('keydown', (event) => {
    if (!player1.dead || !document.querySelector('#displayText').innerHTML === "Tie") {
        switch (event.key) {
            case 'd':
                rightMovement = event.key
                socket.emit("d", rightMovement)

                break
            case 'a':
                leftMovement = event.key
                socket.emit("a", leftMovement)

                break
            case 'w':
                p1Jump = event.key
                socket.emit("w", p1Jump)
                break
            case ' ':
                p1Attack = event.key
                socket.emit(" ", p1Attack)
                break
        }
    }
    if (!player2.dead || !document.querySelector('#displayText').innerHTML === "Tie") {
        switch (event.key) {
            case 'ArrowRight':
                p2rightMovement = event.key
                socket.emit('ArrowRight', p2rightMovement)
                break
            case 'ArrowLeft':
                p2leftMovement = event.key
                socket.emit('ArrowLeft', p2leftMovement)
                break
            case 'ArrowUp':
                p2Jump = event.key
                socket.emit('ArrowUp', p2Jump)
                break
            case 'ArrowDown':
                p2Attack = event.key
                socket.emit('ArrowDown', p2Attack)
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            rightMovement2 = event.key
            socket.emit('d-up', rightMovement2)

            break
        case 'a':
            leftMovement2 = event.key
            socket.emit('a-up', leftMovement2)

            break
    }
    //player2 keys
    switch (event.key) {
        case 'ArrowRight':
            p2rightMovement2 = event.key
            socket.emit('ArrowRight-up', p2rightMovement2)
            break
        case 'ArrowLeft':
            p2leftMovement2 = event.key
            socket.emit('ArrowLeft-up', p2leftMovement2)
            break
    }
})


//player 1 socket connections
socket.on('d', rightMovement => {
    keys.d.pressed = true
    player1.lastKey = 'd'
    console.log(rightMovement)
})

socket.on('d-up', rightMovement2 => {
    keys.d.pressed = false
})

socket.on('a', leftMovement => {
    keys.a.pressed = true
    player1.lastKey = 'a'
    console.log(leftMovement)
})

socket.on('a-up', leftMovement2 => {
    keys.a.pressed = false
})

socket.on('w', p1Jump => {
    player1.velocity.y = -18
})

socket.on(' ', p1Attack => {
    player1.attack()
})

// player2 socket connections
socket.on('ArrowRight', p2rightMovement => {
    keys.ArrowRight.pressed = true
    player2.lastKey = 'ArrowRight'
    console.log(p2rightMovement)
})

socket.on('ArrowRight-up', p2rightMovement2 => {
    keys.ArrowRight.pressed = false
})

socket.on('ArrowLeft', p2leftMovement => {
    keys.ArrowLeft.pressed = true
    player2.lastKey = 'ArrowLeft'
    console.log(p2leftMovement)
})

socket.on('ArrowLeft-up', p2leftMovement2 => {
    keys.ArrowLeft.pressed = false
})

socket.on('ArrowUp', p2Jump => {
    player2.velocity.y = -18
})

socket.on('ArrowDown', p2Attack => {
    player2.attack()
})

// --------------------------------------

socket.on('player1-joined', p1 => {
    const mack = document.getElementById(
        "player-1"
    )
    mack.innerHTML = p1
    document.getElementById("p1").disabled = true;
    document.getElementById("start-btn").hidden = true;
})

socket.on('player2-joined', p2 => {
    const kenji = document.getElementById(
        "player-2"
    )
    kenji.innerHTML = p2
    document.getElementById("p2").disabled = true;
    document.getElementById("start-btn2").hidden = true;
})

document.getElementById("start-btn").addEventListener("click", () => {
    const p1 = document.getElementById("p1").value;
    socket.emit("player1", p1);
});

document.getElementById("start-btn2").addEventListener("click", () => {
    const p2 = document.getElementById("p2").value;
    socket.emit("player2", p2);
});

document.getElementById("testBtn").addEventListener("click", () => {
    socket.emit("message", "test")
})

socket.on("message", (arg) => {
    console.log(arg)
})


