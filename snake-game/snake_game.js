let canvas = document.getElementById("snake_game_canvas");
var charfield = canvas;
let renderer = canvas.getContext("2d");
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const rows = 30;
const cols = 30;
const PADDING = 0;
const cell_width = width/cols;
const cell_height = height/rows;
const snake_init_len = 5;
const snake_head_color = "#447979";
const snake_body_color = "#668888";
const food_color = "red";

let food_pos = null;
let snake = init_snake();

function vec2(x, y) { return {"x": x, "y": y}; }
function vec2_add(a, b) { return vec2(a.x + b.x, a.y + b.y); }
function vec2_equal(a, b) { return a.x === b.x && a.y === b.y; }

function init_snake() {
    let body = [vec2(cols/2|0, rows/2|0)]
    for (let i = 1; i < snake_init_len; i++) {
        body.push(vec2_add(body[i-1], vec2(1, 0)));
    }
    return {body: body, vel: vec2(-1, 0)};
}

function render_snake() {
    for (let i in snake.body) {
        let index = snake.body.length-1-i;
        let cell = snake.body[index];
        const x = cell.x * cell_width + PADDING;
        const y = cell.y * cell_height + PADDING;
        const w = cell_width - 2 * PADDING;
        const h = cell_height - 2 * PADDING;
        if (index != 0) renderer.fillStyle = snake_body_color;
        else renderer.fillStyle = snake_head_color;
        renderer.fillRect(x, y, w, h)
    };
}

function move_snake() {
    console.assert(snake.body.length >= 1);
    let tail = snake.body.pop();
    tail = snake.body.length == 0 ? vec2_add(tail, vec2(-1, 0)) : vec2_add(snake.body[0], snake.vel);
    tail.x = (tail.x + cols) % cols;
    tail.y = (tail.y + rows) % rows;
    snake.body.unshift(tail);
    if (vec2_equal(food_pos, snake.body[0])) {
        grow_snake();
        spawn_food();
    }
}

function check_tail_collision() {
    for (let i = 1; i < snake.body.length; i++) {
        if (vec2_equal(snake.body[0], snake.body[i])) return true;
    }
    return false;
}

function grow_snake() {
    snake.body.unshift(vec2_add(snake.body[0], snake.vel));
}

function render_board() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let x = j * cell_width + PADDING;
            let y = i * cell_height + PADDING;
            renderer.fillStyle = food_pos != null && vec2_equal(vec2(j, i), food_pos) ? "red" : "#424242";
            renderer.fillRect(x, y, cell_width - 2 * PADDING, cell_height - 2 * PADDING,);
        }
    }
}

function spawn_food() {
    food_pos = vec2(Math.random()*cols | 0, Math.random()*rows | 0);
    console.log(`Spawn food at ${food_pos.x}, ${food_pos.y}`);
}


let start_time = new Date();
let allow_next_key = true;
let running = true;
spawn_food();
window.setInterval(function() {
    render_board();
    if (running) move_snake();
    if (running && check_tail_collision()) {
        running = false;
        let new_game_button = document.getElementById("end_game_info");
        new_game_button.classList.toggle("show");
    }
    render_snake();
    allow_next_key = true; // to avoid situation like when player press 2 consecutive keys before snake move (snake is moving right, player presses up left)
}, 100);
document.addEventListener('keydown', function (e) {
    if (!allow_next_key) return;
    allow_next_key = false;
    switch (e.key) {
        case 'w':
            if (snake.vel.y != 1) snake.vel = vec2(0, -1);
            break;
        case 's':
            if (snake.vel.y != -1) snake.vel = vec2(0, 1);
            break;
        case 'a':
            if (snake.vel.x != 1) snake.vel = vec2(-1, 0);
            break;
        case 'd':
            if (snake.vel.x != -1) snake.vel = vec2(1, 0);
            break;
    }
});

function restart() {
    let new_game_button = document.getElementById("end_game_info");
    running = true;
    snake = init_snake();
    new_game_button.classList.toggle("show");
}
