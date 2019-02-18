//when window is loaded start countdown
window.onload = countdown;

var canvas;
var ctx;
var player = new Player(40);
var targets;
var timer = 0;
var interval;
//close modal counting to start of the game after 3 sec and start the game
var modal = setTimeout(modalCounterClose, 3000);

function countdown(){
    //init the game
    init();
    let modal = document.getElementById('counter');
    let i = 3;
    
    counter = setInterval(function count(){
        modal.innerHTML = `<h3>${i}</h3>`;
        i--;
        return count;
    }(), 1000);
}

function modalCounterClose(){
    clearInterval(counter);
    let modal = document.getElementById('counter');
    modal.style.display = "none";
    //start game (refresh canvas each 0,1sec)
    interval = setInterval(draw, 100);
}

function init(){
    //initializing game - adding event listener for tilt, resizing canvas to window inner size, creating random targets etc.
    window.addEventListener('deviceorientation', handleTilt);
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    targets = initilizeTargets(10);
    timer = 0;
    let end = document.getElementById('end');
    end.style.display = 'none';
}

function handleTilt(event){
    //event for handling phone movement
    player.handleOrientation(event);  
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initilizeTargets(n){
    //init targets positions as set so it's only unique entries
    let targetsX = new Set();
    let targetsY = new Set();
    let targets = [];
    let size = 40;
    for(let i=0; i<n; i++){
        //x/y coordinate is calculated so it's multiples of target size*2 constrained between 0 and width/height - size*2;
        let grid = size*2;
        let x = Math.ceil((Math.random()*Math.floor((window.innerWidth-grid)/grid)))*grid;
        let y = Math.ceil((Math.random()*Math.floor((window.innerHeight-grid)/grid)))*grid;
        //if (x,y) is closer to player start position (middle) then 2*grid don't add it
        if(Math.sqrt(Math.pow(x-window.innerWidth/2, 2)+Math.pow(y-window.innerHeight/2, 2))>grid*2){
            if(targetsX.size<10) targetsX.add(x);
            if(targetsY.size<10) targetsY.add(y);
        }else{
            console.log("Not adding target")
        }
        //if it didn't add x/y to the set (it's not unique x/y or it's too close to the middle)
        if(targetsX.size-1<i || targetsY.size-1<i){
            i--; //add one more loop iteration
        }
    }
    targetsX = Array.from(targetsX);
    targetsY = Array.from(targetsY);
    
    //filling targets array with unique coordinates and rest key, value pairs
    targetsX.forEach((t, i)=>{
        let obj = {
            x: t,
            y: targetsY[i],
            size: size,
            color: false
        }
        targets.push(obj);
    })

    //setting random target color to true, so it's actual target
    targets[parseInt(Math.random()*(targets.length-1))].color = true;
    return targets;
}

function draw() {
    //player movement
    player.move();  
    

    //collision detection
    let hit = player.detect(targets);
    if(hit){
        //if hit target is actual target (red) just remove it from array
        if(hit.target){
            if(hit.ind===0) targets.shift() //if it's first element the splice may not work so instead shift
            else targets.splice(hit.ind, 1);
            targets[parseInt(Math.random()*(targets.length-1))].color = true; //choose new target
        }else{
        //if hit target is white add penalty time (5 sec) and remove it
            timer += 5000;
            if(hit.ind===0) targets.shift() //if it's first element the splice may not work so instead shift
            else targets.splice(hit.ind, 1);
            let divAlert = document.getElementById('penalty');
            //show penalty modal
            divAlert.style.display = 'block';
            //hide it after 0,8 sec
            setTimeout(()=>{
                divAlert.style.display = 'none';
            }, 800);
        }
    }

    //detecting end of game
    if(targets.length===0){
        clearInterval(interval);
        let divEnd = document.getElementById('end');
        let score = document.getElementById('score');
        let restart = document.getElementById('restart');
        //show end of game
        divEnd.style.display = 'block';
        score.innerHTML = `Your time is </br> ${timer/1000} seconds`;
        restart.onclick = ()=>{
            let counter = document.getElementById('counter');
            counter.style.display = 'block';
            countdown();
            modal = setTimeout(modalCounterClose, 3000);
        }
    }

    //redrawing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //drawing player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2, true); 
    ctx.fillStyle = "black";
    ctx.fill();

    //drawing targets
    targets.forEach(t=>{
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2, true); 
        if(t.color) ctx.fillStyle = "red"
        else ctx.fillStyle = "white";
        ctx.fill();
    });

    //drawing timer
    ctx.fillStyle = "black";
    ctx.font = "60px Arial";
    ctx.fillText(`Time: ${timer/1000} sec`, 10, 50);
    timer+=100;    //timer in milisec
}