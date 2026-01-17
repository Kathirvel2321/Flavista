//destructuring assignment
const user ={
    firstname: "John",
    lastname: "Doe",
    age: 30,
    city: "New York"   

}

const {firstname, lastname, age, city} = user;

console.log(firstname, age);

//spread operator
const arr1 = [1,2,3];
const arr2 = [4,5,6];
const arr3 = [...arr1, ...arr2];
console.log(arr3);

//rest operator
const numbers = [1,2,3,4,5];
const [first, ...rest] = numbers;
console.log(first, rest);

//arrow function
const sum = (...numbers) => numbers.reduce((fis, curr) => fis + curr, 0);
console.log(sum(1,2,3,4,5));

//template literals
const name = "Alice";
const greeting = `Hello, ${name}! Welcome to the JavaScript world.`;
console.log(greeting);

//default parameters
const multiply = (a, b = 2) => a * b;
console.log(multiply(5));
console.log(multiply(5, 3));

//filter method
const nums = [1,2,3,4,5,6];
const evenNums = nums.filter(num => num % 2 === 0);
console.log(evenNums);

//map method
const squaredNums = nums.map(num => num * num);
console.log(squaredNums);
const number = nums.map(num => `<li>${num}</li>`);
console.log(number);


//find method
const foundNum = nums.find(num => num > 4);
console.log(foundNum);

//includes method
const hasThree = nums.includes(3);
console.log(hasThree);
