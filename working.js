let board;
boardh = 715.20;
boardw = 1535;
let birdwidth = 34;
let birdh = 24;

let birdx = 250;
let birdy = boardh / 2;

let bird = {
    x: birdx,
    y: birdy,
    height: birdh,
    width: birdwidth
}

//pipe
let pipearray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipex = boardw;
let pipey = 0;

//physics
let velocityx = -3;//pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity=0.4;

let gameover = true;

let score=0;

function stfunction() {
    board = document.getElementById("board");
    context = board.getContext("2d");
    board.height = boardh;
    board.width = boardw;

    // context.fillStyle="green";
    // context.fillRect(bird["x"], bird.y,  bird.width, bird.height);


    birdimg = new Image();
    birdimg.src = "images/flappybird.png";
    birdimg.onload = function () {
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }

    toppipeimg = new Image();
    toppipeimg.src = "images/toppipe.png"
    bottompipeimg = new Image();
    bottompipeimg.src = "images/bottompipe.png"
    requestAnimationFrame(update);
    setInterval(createpipes, 2000);
    document.addEventListener("keydown", movebird);
    document.addEventListener("click", movebird);

}
function update() {
    
    requestAnimationFrame(update);
    if(gameover)
    {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y =Math.max(bird.y + velocityY, 0) ;//apply gravity to current bird.y, limit the bird.y to the top of the canvas
    
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y>board.height || bird.y==0)
    {
        gameover=true
    }
    //pipes
    for (i = 0; i < pipearray.length; i++) {
        let pipe = pipearray[i];
        pipe.x = pipe.x + velocityx;
        // console.log(pipe.x)
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if(!pipe.passed && bird.x > pipe.x + pipe.width)
        {
            score=score+0.5;
            pipe.passed = true;
        }
        if(detectcollide(bird, pipe))
        {
            gameover =true;
        }
    }
    while(pipearray.length> 0 && pipearray[0].x < -64)
    {
        pipearray.shift();
    }
    //score
    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameover)
    {
        context.fillText("GAME OVER", 5, 90);
        context.beginPath();
        context.rect(250, 250, 800, 100 )
        context.stroke();
        context.fillText("Press SPACE or CLICk to restart the game", 300, 300 );
        
    }
}

function createpipes() {
    if(gameover)
    {
        return;
    }

    randompipey = pipey - pipeheight / 4 - Math.random() * (pipeheight / 2);
    let openingspace = boardh / 4;
    let toppipe = {
        img: toppipeimg,
        x: pipex,
        y: randompipey,
        width: pipewidth,
        height: pipeheight,
        passed: false
    }
    console.log(pipearray)

    pipearray.push(toppipe);
    // console.log(pipearray)

    let bottompipe = {
        img: bottompipeimg,
        x: pipex,
        y: (randompipey + pipeheight + openingspace),
        width: pipewidth,
        height: pipeheight,
        passed: false
    }
    pipearray.push(bottompipe);
}

function movebird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW" || e.button == 0) {
        //jump
        velocityY = -6;
        if(gameover)
        {
            bird.y= birdy;
            pipearray = [];
            score = 0;
            gameover = false;
        }
    } 
}

function detectcollide(a, b){
    return a.x< b.x + b.width && 
            a.x + a.width>b.x &&
            a.y < b.y + b.height&&
            a.y + a.height> b.y;
}