(() => {
  // Canvas
  let canvas = document.getElementById("bird-game");

  let myFont = new FontFace("PressStart2P", "url(fonts/Press_Start_2P/PressStart2P-Regular.ttf)");

  myFont.load().then((font) => {
    document.fonts.add(font);

    let ctx = canvas.getContext("2d");

    const startBtn = document.querySelector('.start-btn');
    const startScreen = document.querySelector('.start-screen');
    const totalScore = document.querySelector('.total-score').children[0];
    

    // Images
    let bird = new Image();
    let bg = new Image();
    let fg = new Image();
    let pipeUp = new Image();
    let pipeBottom = new Image();
    bird.src = "images/flappy_bird_bird.png";
    bg.src = "images/flappy_bird_bg.png";
    fg.src = "images/flappy_bird_fg.png";
    pipeUp.src = "images/flappy_bird_pipeUp.png";
    pipeBottom.src = "images/flappy_bird_pipeBottom.png";

    // Audios
    let fly = new Audio();
    let scoreSound = new Audio();
    let crash = new Audio();
    fly.src = "audios/fly.mp3";
    scoreSound.src = "audios/score.mp3";
    crash.src = "audios/crash.mp3";

    // Bird starting position
    let birdPosX = 10;
    let birdPosY = 180;

    let gap = 100; // gap between pipes
    let gravitation = 1.5;
    let score = 0;
    let animationId = null;

    // Creating pipe blocks
    let pipes = [];

    pipes[0] = {
      x: canvas.width,
      y: 0
    }

    // Bird flying - by pressing any key on a keyboard
    let birdFly = () => {
      fly.play();
      birdPosY -= 36;
    }
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        birdFly();
      }
    });
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      birdFly();
    });

    // Starting the game
    startBtn.addEventListener('click', () => {
      startScreen.style.display = 'none';
      animationId = requestAnimationFrame(game);
    })

    let game = () => {
      ctx.drawImage(bg, 0, 0);
      ctx.drawImage(bird, birdPosX, birdPosY);

      birdPosY += gravitation;

      for (let i = 0; i < pipes.length; i++) {
        // Drawing first pipes 
        ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y);
        ctx.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap);
        
        // Moving pipes 
        pipes[i].x--;

        // Generating new pipes 
        if (pipes[i].x == 150) {
          pipes.push({
            x: canvas.width + 50,
            y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
          });
        }

        // Deleting pipes, that are out of screen, from pipes array
        if (pipes.length > 4) {
          pipes.shift();
        }

        //Score counting
        if (pipes[i].x == 5) {
          score++;
          scoreSound.play();
        }
        
        // Tracking bird collisions with obstacles (pipes and floor)
        if (birdPosX + bird.width >= pipes[i].x
          && birdPosX <= pipes[i].x + pipeUp.width
          && (birdPosY <= pipes[i].y + pipeUp.height
            || birdPosY + bird.height >= pipes[i].y + pipeUp.height + gap)
          || birdPosY + bird.height >= canvas.height - fg.height) {
          crash.play();
          endGame();
          return;
        }
        
        ctx.drawImage(fg, 0, canvas.height - fg.height);

        ctx.fillStyle = "#000";
        ctx.font = "20px PressStart2P";
        ctx.fillText("Score: " + score, 10, canvas.height - 43);
      }

      animationId = requestAnimationFrame(game);
    }

    let endGame = () => {
      cancelAnimationFrame(animationId);

      animationId = null;

      pipes = [];
      pipes[0] = {
        x: canvas.width,
        y: 0
      }

      birdPosX = 10;
      birdPosY = 180;

      totalScore.textContent = score;
      startScreen.style.display = 'flex';

      score = 0;
    }
  });
})();