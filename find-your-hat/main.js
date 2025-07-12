const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field, options) {
    this.field = field;
    this.fieldHeight = this.field.length; // to loop through y
    this.fieldWidth = this.field[0].length // to loop through x
    this.randomStart = options.randomStart;
    this.hardMode = options.hardMode;
    this.loopCounter = 0;
    
    //helper to randomSwap first character
    let randomSwap = (hole, fieldCharacter) => {
      const randomNumber = Math.floor(Math.random() * 2);
      if (randomNumber === 0) {
        return this.field[0][0] = hole
      }
      else {
        return this.field[0][0] = fieldCharacter;
      }
    }
    
    //helper to asign asterisk to a random position
    let randomPathCharacter = pathCharacter => {
      let characterPlaced = false;
      while (!characterPlaced) {
      let randomYPath = Math.floor(Math.random()*this.fieldHeight)
      let randomXPath = Math.floor(Math.random()*this.fieldWidth)
        if (this.field[randomYPath][randomXPath] !== hat) {
            characterPlaced = true;
            this.field[randomYPath][randomXPath] = pathCharacter;
            }
        }
    
      if (this.randomStart) {
          randomSwap(hole,fieldCharacter);
          randomPathCharacter(pathCharacter);
      }
    }
    
    //find start position
    const findAsterisk = (field) => {
      for (let y = 0; y<this.fieldHeight; y++ ) {
        for (let x =0; x<this.fieldWidth; x++) {
          if (field[y][x] === pathCharacter) {
            return { row: y , column: x }
          }
        }
      }
    }
      
    const {row, column} = findAsterisk(field);
    this.x = row
    this.y = column      

  }

  getGameState() {
     let fieldState = this.field[this.y][this.x];
     
    if (fieldState === hat) {
      console.log("You're a winner")
     }
     
    if (fieldState === hole) {
      console.log("You're a loser")
     }

    if (fieldState !== hat && fieldState !== hole && fieldState !== fieldCharacter && fieldState !== pathCharacter) {
        console.log("You're out of bounds fella");
       }
  }

  outOfBounds() {
    return this.y < 0 || this.y > this.fieldHeight-1 || this.x < 0 || this.x > this.fieldWidth-1;
  }

  loseCon() {
    return this.field[this.y][this.x] === hole;
  }

  winCon() {
    return this.field[this.y][this.x] === hat;
  }


  makeStep(input) {
    switch (input) {
      case "s":
      this.y++;
      this.loopCounter++;
      break;

      case "w": 
      this.y--;
      this.loopCounter++;
      break;

      case "a":
      this.x--;
      this.loopCounter++;
      break;

      case "d":
      this.x++;
      this.loopCounter++;
      break;

      default:
      console.log('you must only enter (w/a/s/d)')

      }
    if (!this.outOfBounds() && !this.loseCon() && !this.winCon()) {
    this.field[this.y][this.x] = pathCharacter;
  }
}

  hardModeHelper() {
    if (this.hardMode && this.loopCounter % 3 ===0) {
      let holePlaced = false;
      while (!holePlaced) {
        let hardY = Math.floor(Math.random()*this.fieldHeight);
        let hardX = Math.floor(Math.random()*this.fieldWidth);
        if (this.field[hardY][hardX] === fieldCharacter) {
           this.field[hardY][hardX] = hole;
           holePlaced = true; 
        }
      }
      console.log(holePlaced)
    }
  }


  playGame() {
    this.print(this.field);

    while (!this.outOfBounds() && !this.loseCon() && !this.winCon()) {

      const question = prompt("Which way would you like to move?");
        //find way to clear console so loop looks like its updating
      
      this.makeStep(question);
      
      this.hardModeHelper();

      this.print(this.field);
    }
    this.getGameState();
  }

  print() {
    for (let i = 0; i < this.field.length; i++) {
    console.log(this.field[i].join(""));
    }
  }

  static generateField(height, width, percentage) {
    
    // throw Error in case incorrect percentage input
    if (percentage > 1 || percentage < 0) {
      throw Error('You must enter a decimal between 0 and 1')
        }

    let completeArray = [];
    let numO = Math.round((height*width) * percentage) //generate number of holes needed based on percentage
    
    //create  an array of just field characters
    for (let i=0; i< height; i++) {
      let rows = [];
      for (let j=0; j< width; j++) {
        rows.push(fieldCharacter)
      }
      completeArray.push(rows);
    }

    // add in a hat at random
    let randomHatY = Math.floor(Math.random()*height);
    let randomHatX = Math.floor(Math.random()*width);

    completeArray[randomHatY][randomHatX] = hat;

    // add in holes representing percentage
    let numHoles = 0
   
    while (numHoles < numO) {
    let randomHoleY = Math.floor(Math.random()*height)
    let randomHoleX = Math.floor(Math.random()*width);

    if (completeArray[randomHoleY][randomHoleX] === fieldCharacter) {
      completeArray[randomHoleY][randomHoleX] = hole; // replace a random value in the array that is a field character
      numHoles++; // add to numHoles
      }
    }
    return completeArray;
  }
}

console.log(Field.generateField(4,5,0.5));



const myField = new Field([
  ['*', '░', '░', 'O'],
  ['O', 'O', '░', '░'],
  ['O', 'O', '░', '░'],
  ['░', '0', '░', '^'],
],{ randomStart: true, hardMode: true });

myField.playGame()

/* Improvements I would like to add

- Find a way to refresh print() when running playGame while loop so I I am not printing !!!! (AS need some help)

- convert out of bounds, wincon and lose conditions into helper functions (complete)

- convert if statement into switch / case (complete)

- add more helper functions
  - random asterisk (complete using the randomStart argument) 
  - hard mode (complete)
  - create a maze solver (not complete)

- project for my own extension combine generateField with myField so a random field is called: 
  - let generatedField = Field.generateField(4,5,0.3);
  - console.log(generatedField); 
  - const myField = new Field (generatedField, "s", "h");
*/







          /* Alternate code with no helper functions
            remove helper functions if used
          
          if (this.field[y][x] === hole) {
            console.log("you're a loser")
            break
          }

          if (this.field[y][x] === hat) {
            console.log("you're a winner")
            break
          }

          if (y < 0 || y > fieldHeight-1 || x < 0 || x > fieldWidth-1) {
            console.log("you're out of bounds")
            break*/




