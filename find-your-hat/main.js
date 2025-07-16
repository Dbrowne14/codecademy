// Generally we want to extract Class definitions into their own module.
// And keep `main.js` as the "entry point" of the application.
// This is where we instantiate a new instance of the Field class
// and call functions on the Field instance.
const Field = require("./field");

// In this case we just call the static method `startNewGame` on the Field class,
// that creates a new Field instance and starts the game.
Field.startNewGame(20, 30, 0.25, { randomStart: true, hardMode: true });

// Leaving it here to test:
// console.log(Field.generateField(4, 5, 0.5));

// const myField = new Field(
//   [
//     ["*", "░", "░", "O"],
//     ["O", "O", "░", "░"],
//     ["O", "O", "░", "░"],
//     ["░", "O", "░", "^"],
//   ],
//   { randomStart: true, hardMode: true }
// );

// myField.playGame();
