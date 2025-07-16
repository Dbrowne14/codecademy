const prompt = require("prompt-sync")({ sigint: true });
const { pickARandomItemFromAnArray, shuffleArray } = require("./utils");

// These are constant values.
// We place constants on top of the file and below the imports.
// We use uppercase variable names for constants.
const HAT = "^";
const HOLE = "O";
const FIELD = "░";
const PATH = "*";

class Field {
  constructor(field, options) {
    this.field = field;
    this.x = 0;
    this.y = 0;
    this.height = this.field.length; // to loop through y
    this.width = this.field[0].length; // to loop through x
    this.loopCounter = 0;
    // Options
    // Hard mode: one or more holes are added after certain turns
    this.hardMode = options.hardMode;
    // Random start mode: move the player to a random field coordinate
    this.randomStart = options.randomStart;

    // List of field coordinates - to know where we can place the player randomly
    // We want to keep track of where the possible (empty) fields are
    // We can keep them in an array like this: [[x,y], ...]
    // [x,y] is called a "tuple"
    // - one of the defining characteristics of a tuple is that the order of the items is important
    // - so [x,y] is different from [y,x]
    // - so we always know that the x will be the first item and the y will be the second item
    // it's basically a pair of values, like a coordinate consisting of x and y
    // in the "fieldCoordinates" array we keep several [x,y] coordinate values
    this.fieldCoordinates = [];

    // Processing the field
    // - we find the start position
    // - and we find all the field coordinates
    // The advantage here is that we go through the matrix only once
    // The 2 loops iterate through the whole matrix and we don't need to repeat this
    // for other processing steps.
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // if it's a "field" then we add it to the fieldCoordinates array
        if (field[y][x] === FIELD) {
          this.fieldCoordinates.push([x, y]);
        }

        // if it's a "path", that's our start character
        // we set it as our start position (this.x, this.y)
        // and we add it to the fieldCoordinates array
        // the start position is technically a place where we can move again
        // so it could be a place where we can place a hole randomly in hard mode
        // especially if we also have "randomStart" enabled, because then we also
        // move the player away from this position, so it becomes a "field" character
        if (field[y][x] === PATH) {
          this.x = x;
          this.y = y;
          // we add the start position to the fieldCoordinates array too
          this.fieldCoordinates.push([x, y]);
        }
      }
    }

    if (this.randomStart) {
      // Remove the asterisk from the start position, overwrite with field character
      this.field[this.y][this.x] = FIELD;

      // Pick a random field coordinate
      // Here we use "destructuring": we basically just take the first item from the returned array.
      // We know "pickARandomItemFromAnArray" returns a tuple (an array with 2 items: [value, index])
      // So we just take the first item - "value" - from it.
      const [randomFieldCoordinate] = pickARandomItemFromAnArray(
        this.fieldCoordinates
      );

      // Assign the random coordinate to the player
      this.x = randomFieldCoordinate[0];
      this.y = randomFieldCoordinate[1];

      // Represent the player on the field
      this.field[this.y][this.x] = PATH;
    }
  }

  shouldPlaceHole() {
    // I just extracted this into a method for readability.
    // This function is something that could be implemented in many different ways.
    // This is a valid implementation but you could create a different logic
    // to calculate when to place a hole. Like make it more random.
    // So because of this it makes sense to extract it into a method. Because then
    // you can change just this method and no need to touch other parts of the code.
    return this.loopCounter % 3 !== 0;
  }

  placeHoleIfNeeded() {
    // If "hard mode" is enabled, we place a hole after certain turns

    // This below is called an "early return".
    // We check if it's `hardMode` or a turn when we "shouldPlaceHole".
    // If it's not we don't do anything.
    // This is general in software engineering that we want to handle "error conditions" or
    // special conditions (like when we should do nothing) early, closer to the top of the function.
    if (!this.hardMode || !this.shouldPlaceHole()) return;

    // Add one or more holes
    // 1. Pick a random field coordinate
    // Here we take both items from the tuple: [value, index]
    const [randomFieldCoordinate, randomFieldCoordinateIndex] =
      pickARandomItemFromAnArray(this.fieldCoordinates);
    const [randomFieldX, randomFieldY] = randomFieldCoordinate;

    // 2. Add a hole
    this.field[randomFieldY][randomFieldX] = HOLE;

    // 3. Remove field character from list
    // Since we placed a hole, it's not a possible field anymore
    // So we need to remove it from the list. This way if we run this function ("placeHoleIfNeeded")
    // again, it will only pick coordinates that are still in the list.
    // What we do below is use an Array function called "filter" (Google "Array.filter" for the docs)
    // - Array.filter returns a new array, notice that we assign the returned value to "fieldCoordinates"
    // - this means that we overwrite the original "fieldCoordinates" array with a new array
    // - Array.filter creates a new array from the values of the original array
    // Array.filter goes through the array and checks if the arrow function
    // that we passed into "filter" returns true or false.
    // - If it's true,  it includes the item in the new array
    // - If it's false, it leaves that item out of the new array.
    // Here we "filter out" the item that we just placed a hole on.
    // We do this based on it's "index" in the array.
    // The "arrow function" that we pass into "filter" takes 2 parameters:
    // - 1st: is the element of the array - this would be [x,y] coordinate
    // - 2nd: the index of the element - array[index] === [x,y]
    // So we use the index, if the index equals to the "randomFieldCoordinateIndex" then
    // we return false - don't include in the new array - otherwise we return true.
    this.fieldCoordinates = this.fieldCoordinates.filter(
      (_, index) => index !== randomFieldCoordinateIndex
    );
  }

  isOutOfBounds() {
    // Note: this is a trick to check if the player is out of bounds quickly
    // Out of bounds means the player's coodinates cannot be represented in the matrix
    // So if you try to get the item from the matrix it will return `undefined`
    const currentField = this.field[this.y][this.x];
    if (currentField === undefined) return true;
    return false;
  }

  hasLost() {
    return this.field[this.y][this.x] === HOLE;
  }

  hasWon() {
    return this.field[this.y][this.x] === HAT;
  }

  getGameResult() {
    // You can re-use the game ending conditions above here:
    if (this.isOutOfBounds()) {
      return "You're out of bounds fella";
    }

    if (this.hasLost()) {
      return "You're a loser";
    }

    if (this.hasWon()) {
      return "You're a winner";
    }

    throw new Error("getGameResult was called before the game was over");
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
        // We can return an Error.
        // Check how we handle this in the `while` loop.
        // We "continue" in the loop if there' an error that comes back from this function.
        // "continue" means skip the rest of the code in the loop and start the next iteration of the loop.
        // We shouldn't increment `loopCounter` in this case as this is not a valid step.
        throw new Error("You must only enter (w/a/s/d)");
    }
  }

  // This is a convenience function that we can use in the `while` loop condition.
  // Whenever it's called it calls the game ending condition functions and returns
  // their current value.
  isGameOngoing() {
    return !this.isOutOfBounds() && !this.hasLost() && !this.hasWon();
  }

  playGame() {
    while (this.isGameOngoing()) {
      // Clears the terminal console completely
      // Helps with achieving the "refreshing" experience of the field.
      console.clear();

      // Update the field - move the player
      // Record the result of the last step on the Field
      // this won't do anything in the first step because the asterisk is already there
      this.field[this.y][this.x] = PATH;

      // Print the new field before stepping
      this.print(this.field);

      const move = prompt("Which way would you like to move?");
      try {
        this.makeStep(move);
      } catch (error) {
        console.log(error.message);
        // Continue the loop if the user enters an invalid input.
        continue;
      }

      this.placeHoleIfNeeded();
    }
    // Game has ended - we could record the last step on the field if we want to
    // For example overwrite the hole or the hat with the asterisk to represent
    // that's where the player ended up. But it's not necessary.

    // Print the result of the game
    const result = this.getGameResult();
    console.log(result);
  }

  print() {
    for (let i = 0; i < this.field.length; i++) {
      console.log(this.field[i].join(""));
    }
  }

  static generateField(height, width, percentage) {
    // throw Error in case incorrect percentage input
    if (percentage > 1 || percentage < 0) {
      throw Error("You must enter a decimal between 0 and 1");
    }

    // generate number of holes needed based on percentage
    let numberOfHoles = Math.round(height * width * percentage);

    // The variable for the newly generated field.
    const field = [];
    // We keep track of all the field coordinates in an array.
    // This will help us select a random coordinate from the array.
    const allFieldCoordinates = [];
    // Have 2 loops for the field.
    // - Place a "FIELD" character in each coordinate.
    // - Add each character to the "allFieldCoordinates" array.
    for (let i = 0; i < height; i++) {
      field[i] = [];
      for (let j = 0; j < width; j++) {
        field[i][j] = FIELD;
        allFieldCoordinates.push([j, i]);
      }
    }

    // The upper left corner is the start position in the game.
    // In the Field.constructor, if we pass in "randomStart", then we switch that position randomly.
    // But for now we can just take out that position from the "allFieldCoordinates" and
    // place a "PATH" character on it.
    // We use destructuring again, to take the first element (coordinate) from "allFieldCoordinates".
    const [startPosition, ...availableCoordinates] = allFieldCoordinates;
    // This is another use of "destructuring" because the elements of "allFieldCoordinates"
    // are "tuples" (coordinates), so we know there are always 2 elements.
    // So we can take them from the tuple: [startX, startY]
    const [startX, startY] = startPosition;
    // place player on start position
    field[startY][startX] = PATH;

    // We want to place the "HOLES" and the "HAT" randomly.
    // Instead of creating a loop, we can create an array of the field coordinates,
    // but the order of the coordinates is random. So it got shuffled around.
    // Advantage here is that we know how long the code runs:
    // - we know the code will need to loop through all the coordinates once - to shuffle them
    // - but then we can just need as many iterations as the number of holes we want to place
    // and one more to place the hat.

    // This is why we created a simple array of all the possible field coordinates.
    // We can just shuffle the array to end up with a random order of the coordinates.
    const shuffledFieldCoordinates = shuffleArray(allFieldCoordinates);

    // Then we can just take as many from the shuffled list as the number of holes we need.
    // "Array.slice": takes "n" number of items from the array and creates a new array with it
    // - 0: the first parameter in this case is that starting point
    // - from this position is where we "slice off" a part of the array.
    // - numberOfHoles: is the length of the "slice"
    const holesCoordinates = shuffledFieldCoordinates.slice(0, numberOfHoles);
    // For the hat, we take another item from the shuffled list.
    // The one after the last hole coordinate we took.
    const hatCoordinate = shuffledFieldCoordinates[numberOfHoles + 1];

    // Loop through all the hole coordinates and place a "HOLE" character on each of them.
    for (let i = 0; i < holesCoordinates.length; i++) {
      const [x, y] = holesCoordinates[i];
      field[y][x] = HOLE;
    }
    // Place the hat
    const [hatX, hatY] = hatCoordinate;
    field[hatY][hatX] = HAT;

    return field;
  }

  // A convenience function to start a new game with the options.
  // Just calls `generateField` to create a random field matrix.
  // Then uses `new Field()` to construct an instance of `Field`
  // Then calls `field.playGame()` to start the game.
  // It also returns the created "field" but that's not necessary.
  static startNewGame(height, width, percentage, options) {
    const field = Field.generateField(height, width, percentage);
    const newField = new Field(field, options);
    newField.playGame();
    return newField;
  }
}

module.exports = Field;
