/*
function add(a,b) {
    return a + b;
}
*/

// Curry help us to convert a function that takes N parameteres to a function that takes 1 parameter

function add(a) {
  return function (b) {
    return a + b;
  };
}

// add(1) returns a function, and then we call that 2d function with (5) as parameter
add(1)(5); // add(1,5)

// We can convert it to arrow functions\

const add2 = (a) => (b) => a + b; // (a,b) => a + b;

import { compose, pipe } from "lodash/fp";
import { produce } from "immer";

let input = "    JavaScript   ";

let output = "<div>" + input.trim + "</div>";

// 1 trim
// 2 wrapInDiv

const trim = (str) => str.trim();
const wrap = (type) => (str) => `<${type}>${str}</${type}>`;
const toLowerCase = (str) => str.toLowerCase();

const transform = pipe(trim, toLowerCase, wrap("div"));
console.log(transform(input));

/**
 * Immer: allow us to work with normal plain JS object, but it makes them inmutable
 *        we can write mutable code, but it takes charge on creating inmutable objects
 */
let book = { title: "Harry Potter" };

function publish(book) {
  return produce(book, (draftBook) => {
    draftBook.isPublished = true;
  });
}

let updated = publish(book);

console.log(book);
console.log(updated);
