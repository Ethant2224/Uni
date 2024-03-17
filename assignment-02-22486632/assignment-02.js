

function startGame() {
    const startCircle = document.getElementById('light');
    startCircle.style.backgroundColor = "red";
    canClick = false;
    clearTimeout(responseTimeout);

    sequence.length = 0; 
    sequence.push(getRandomPanel()); // new random panel
    playerTurn = [...sequence]; // Reset equence
    currentScore = 0; // Reset the current score
    document.querySelector(".score").textContent = '00'; // Reset 
    canClick = false; 

   //start delay
    setTimeout(function() {
      startCircle.style.backgroundColor = "green"; // changes color to green to show game start
      flashing();
    }, 3000); //wait 3 seconds
  }

  //shows teh colour
  let responseTimeout;

  const flashing = async () => {
    canClick = false;
    for (const panel of sequence) {
      await flash(panel);
    }
    canClick = true;

  
    clearTimeout(responseTimeout); 
    responseTimeout = setTimeout(() => {
      loseFlash().then(() => {
      });
    startGame();
  }, 5000); // 5 seconds to respond
  };

  const loseFlash = () => {                        //when you lose or after five seconds calls flashAll
    return new Promise((resolve) => {
      let count = 0;
      const interval = setInterval(() => {
        greenButton.classList.toggle('active');
        redButton.classList.toggle('active');
        blueButton.classList.toggle('active');
        yellowButton.classList.toggle('active');
  
        count++;
        if (count === 10) {   //flashes 10 times
          clearInterval(interval);
          resolve();
        }
      }, 250);
    });
  };
  
  const greenButton = document.querySelector('.green');
  const redButton = document.querySelector('.red');
  const blueButton = document.querySelector('.blue');
  const yellowButton = document.querySelector('.yellow');
  
  
  

  const getRandomPanel = () => {
    const panels = [
      greenButton,
      redButton,
      blueButton,
      yellowButton
    ];
    return panels[parseInt(Math.random()* panels.length)];
  }
  //forms the sequence with a random panel
  const sequence = [
    getRandomPanel()
  ];
  
  let playerTurn = [...sequence];
  

  const flash = panel => {
    let flashDuration = 800; // Default flash duration
  
    // when reach a certain score speed it up
    if (currentScore <= 5) {
      flashDuration = 600;
    } else if (currentScore <= 9) {
      flashDuration = 400;
    } else if (currentScore <= 13) {
      flashDuration = 200;
    }
  
    return new Promise((resolve, reject) => {   
        panel.classList.add('active'); //flashes
      setTimeout(() => { 
        panel.classList.remove('active'); //unflash
        setTimeout(() => {
         resolve();
        }, 250);
      }, flashDuration);
    });
  };
  let canClick = false; //  user cant click
  let currentScore = 0; 
  let highScore = currentScore; //  highScore equal to currentscore so its the same when playing the firest time
  const panelClicked = panelClicked => {
    if (!canClick) return; // Ensures user can't click if not allowed
  
    const expectedPanel = playerTurn.shift(); 
    if (expectedPanel === panelClicked) { // guess matches
      if (playerTurn.length === 0) {  //wehn everything matches the sequence it adds a panel;
        sequence.push(getRandomPanel()); 
        playerTurn = [...sequence]; 
        currentScore++; // Increment the score
        if (highScore < currentScore) {
          highScore = currentScore; //highscore
        }
        document.querySelector(".score").textContent = currentScore.toString(); 
        document.querySelector(".highscore").textContent = highScore.toString(); 
        clearTimeout(responseTimeout); 
        flashing(); // Start flashing the new sequence including the new panel
      }
    } else {
      clearTimeout(responseTimeout); 
      loseFlash().then(() => {
        // Optionally, you might want to delay showing the alert and restarting to let the flash finish
        setTimeout(() => {
          startGame(); // Restart the game
        }, 1000); // Delay to ensure the flashAllButtons animation can be seen
      });
    }
  }; 

  //https://www.youtube.com/watch?v=W0MxUHlZo6U&ab_channel=WebDevCody