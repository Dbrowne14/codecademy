// There can be different types of helper functions:
// - utils: functions that could be used in different places
//     - they are not specific to Classes or modules, they do a very general task
// - methods: functions that are specific to a Class
//     - they are mostly specific to the given Class
//     - mostly useful to separate the logic of the Class implementation to make it more readable

// In this file we place general util (utility) functions:

function pickARandomItemFromAnArray(array) {
  // pick a random number between 0 and n (n not included)
  // - so [0, n[ - in math (set) notation
  // - meaning the items can be 0..n-1
  // here "n" is the array's length
  // so we get numbers that are valid indexes for the array
  const randomIndexFromTheArray = Math.floor(Math.random() * array.length);

  // we return a "tuple", [value, index]
  // this way we can get the value and the index at the same time as well
  // see "placeHoleIfNeeded" to see it's usage
  return [array[randomIndexFromTheArray], randomIndexFromTheArray];
}

function shuffleArray(array) {
  // This is a way to shuffle an array.
  // You can read up on the docs for "Array.map" and "Array.sort".

  // Array.map: creates a new array with the same length.
  // - it uses the arrow function passed in to modify each element of the array.
  // - in this case we create a new object with the properties "value" and "sort"
  // - "sort" is a random number. We'll use this to sort the array in an ascending order.

  // Array.sort: uses the arrow function passed in to sort the array
  // - if the function returns > 0: b is sorted before a
  // - if the function returns < 0: a is sorted before b
  // - if the function returns 0: a and b are considered equal and the order is not changed
  // Essentially, you can accept that `(a,b) => (a - b)` just sorts the array in an ascending order.

  // Then the last Array.map:
  // - transforms each element of the array back to how it was
  // - removes the "sort" property and just returns the "value" itself
  // - After the "Array.sort", the elements of the array looked like this: [{value: 1, sort}, {value: 2, sort},...]
  // - After the last "Array.map", the values lookes like this: [1, 2...]

  // The last concept that might be new: "chaining"
  // "Array.map" and "Array.sort" all return new arrays.
  // So they return another "Array" on which you can call "Array.map" again.
  // So these functions can be chained.
  // You could write them this way too:
  /*
    const firstArray = array.map((value) => ({ value, sort: Math.random() }));
    const secondSortedArray = firstArray.sort((a, b) => a.sort - b.sort);
    const thirdArray = secondSortedArray.map(({ value }) => value);
    return thirdArray;
  */
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// This is a way to create "modules" in Node.js
// It exports a certain value that can be imported in other files
// using const {pickARandomItemFromAnArray} = require('./utils')
// see `field.js`
module.exports = {
  pickARandomItemFromAnArray,
  shuffleArray,
};
