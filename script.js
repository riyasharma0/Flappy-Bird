const cvs = document.getElementById("bird");
const ct = cvs.getContext("2d");

let frames =0;
const degree = Math.PI/180;

const sprite = new  Image();
sprite.src = "image/sprite.png";

const sounds = new Audio();

const die = new Audio();
die.src = "audio/die.wav";

const hit = new Audio();
hit.src = "audio/hit.wav";

const point = new Audio();
point.src = "audio/point.wav";

const wing = new Audio();
wing.src = "audio/wing.wav";

const swoosh = new Audio();
swoosh.src = "audio/swoosh.wav";


const state = {
    current : 0,
    getready : 0,
    game : 1,
    over : 2
}

const startButn ={
    x: 120,
    y: 263,
    w: 83,
    h: 29,
}


cvs.addEventListener("click" , function(event){
    switch(state.current){
        case state.getready:
            state.current = state.game;
            swoosh.play();
            break;
        case state.game:
            bird.flap();
            wing.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickx = event.clientX - rect.left;
            let clicky = event.clientY - rect.top;

            if(clickx >= startButn.x && clickx <= startButn.x + startButn.w && 
                clicky >= startButn.y && clicky <=startButn.y + startButn.h ){
                   pipe.reset();
                   bird.speedReset();
                   Score.reset();
                   state.current = state.getready;
                }
            break;
    }

});

const background = {
    dX : 0,
    dY : 0,
    w :  275,
    h :  226,
    x :  0,
    y :  cvs.height - 226,

    draw : function(){
        ct.drawImage(sprite , this.dX , this.dY ,this.w ,this.h, this.x, this.y ,
                   this.w, this.h);

       ct.drawImage(sprite , this.dX , this.dY ,this.w ,this.h, this.x + 
                    this.w, this.y ,this.w, this.h);

    }
}

const foreground = {
    dX : 276,
    dY : 0,
    w :  224,
    h :  122,
    x :  0,
    y :  cvs.height - 112,

    sX : 2,

    draw : function(){
        ct.drawImage(sprite , this.dX , this.dY ,this.w ,this.h, this.x, this.y ,
                   this.w, this.h);

       ct.drawImage(sprite , this.dX , this.dY ,this.w ,this.h, this.x + 
                    this.w, this.y ,this.w, this.h);

    },

    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.sX)%(this.w/2);
        }
    }

}

const bird = {
    animation : [
        {dX: 276, dY: 112},
        {dX: 276, dY: 139},
        {dX: 276, dY: 164},
        {dX: 276, dY: 139}
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,

    frame : 0,

    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation: 0,

    draw : function(){
        let bird = this.animation[this.frame];

        ct.save();
        ct.translate(this.x, this.y);
        ct.rotate(this.rotation);
        ct.drawImage(sprite , bird.dX , bird.dY ,this.w ,this.h , - this.w/2, - this.h/2,
             this.w, this.h);    

             ct.restore();
        },

        flap : function(){
            this.speed = - this.jump;

        },

        update : function(){

            this.period = state.current == state.getready ? 10 : 5;
            
            this.frame += frames%this.period == 0 ? 1 : 0;
            
            this.frame = this.frame%this.animation.length;

            if(state.current == state.getready){
                this.y = 150;
                this.rotation = 0 * degree;

            }else{
                this.speed += this.gravity;
                this.y += this.speed;

                if(this.y + this.h/2 >= cvs.height - foreground.h){
                    this.y = cvs.height - foreground.h -this.h/2;
                    if(state.current == state.game){
                        state.current = state.over;
                        die.play();
                    }
                }

                if(this.speed >= this.jump){
                    this.rotation = 90*degree;
                    this.frame = 1;
                }else{
                    this.rotation = -25 * degree;
                }
            }

            },
            speedReset : function(){
                this.speed = 0;
        }
        
}



const getready={
    dX : 0,
    dY : 228,
    w :  173,
    h :  152,
    x :  cvs.width/2 - 173/2,
    y :  80,

    draw : function(){
        if(state.current == state.getready){
            ct.drawImage(sprite , this.dX , this.dY ,this.w ,this.h, this.x, this.y ,
                this.w, this.h);

        }
        
    }
}

const gameover={
    dX : 175,
    dY : 228,
    w :  225,
    h :  202,
    x :  cvs.width/2 - 225/2,
    y :  90,

    draw : function(){
        if(state.current == state.over){
            ct.drawImage(sprite , this.dX , this.dY ,this.w ,this.h, this.x, this.y ,
                this.w, this.h);

        }
        
    }
}

const pipe = {
    position: [],

    top: {
        dX : 553,
        dY : 0
    },
    bottom : {
        dX : 502,
        dY : 0
    },

    w : 53,
    h : 400,
    gap : 85,
    maxYPos : -150,
    sX : 2,

    draw : function(){
        for(let i=0; i<this.position.length;i++){
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h +this.gap;

            //Top pipes
            ct.drawImage(sprite , this.top.dX , this.top.dY ,this.w ,this.h, p.x, topYPos ,
                this.w, this.h);

            //Bottom pipes
            ct.drawImage(sprite , this.bottom.dX , this.bottom.dY ,this.w ,this.h, p.x, bottomYPos ,
                this.w, this.h);
        }
    },

    update: function(){
        if(state.current !== state.game) return;
    
        if(frames%100 == 0){
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() +1)
            });
        }
        for(let i=0; i<this.position.length; i++){
            let p =this.position[i];
    
            

            let bottompipePos = p.y + this.h + this.gap;

            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x +this.w &&
                bird.y + bird.radius > p.y && bird.y - bird.radius < p.y +this.h){
                   state.current = state.over;
                   hit.play();
                }

            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x +this.w &&
                    bird.y + bird.radius > bottompipePos && bird.y - bird.radius < bottompipePos +this.h){
                       state.current = state.over;
                       hit.play();
                    }

            
             p.x -= this.sX;

            // if the pipes go beyond canvas, we delete them from the array
            if(p.x +this.w <= 0){
                this.position.shift();
                Score.value +=1;
                point.play();
                Score.best = Math.max(Score.value, Score.best);
                localStorage.setItem("best",Score.best);



            }
        }
    } ,
    reset: function(){
        this.position = [];
    }

}

const Score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value: 0,

    draw: function(){
        ct.fillStyle = "#FFF";
        ct.strokeStyle = "#000";

        if(state.current == state.game){
            ct.lineWidth = 2;
            ct.font = "35px Teko";
            ct.fillText(this.value, cvs.width/2, 50);
            ct.strokeText(this.value, cvs.width/2, 50);
        }else if(state.current == state.over){

            ct.font = "25px Teko";
            ct.fillText(this.value, 225, 186);
            ct.strokeText(this.value, 225, 186);

            ct.fillText(this.best, 225 , 228);
            ct.strokeText(this.best, 225, 228);
        }
    },

    reset: function(){
        this.value = 0;
    }
}


function draw(){
    ct.fillStyle = "#70c5ce";
    ct.fillRect(0, 0, cvs.width, cvs.height);

    background.draw();
    pipe.draw();
    foreground.draw();
    bird.draw();
    getready.draw();
    gameover.draw();
    Score.draw();
    
}

function update(){
    
    bird.update();
    foreground.update();
    pipe.update();

}

function loop(){
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();
