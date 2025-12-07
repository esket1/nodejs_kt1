const zmq = require('zeromq/v5-compat');
const socket = zmq.socket('req');
let randomNum;

function checkNum(range) {
    console.log(`Диапазон чисел: от ${range.min} до ${range.max}`)
    if (!(range.min) || !(range.max) || isNaN(range.min) || isNaN(range.max)) {
        console.error("При запуске необходимо указать два числа (диапазон)!");
        process.exit();
    }
    if (range.min > range.max) {
        console.error("Первое число в диапазоне не может быть больше второго!")
        process.exit();
    }
    if (range.min < 0 || range.max < 0) {
        console.error("Числа не могут быть отрицательными!")
        process.exit();
    }
    return true
}

function getNum(args) {
    const num1 = parseFloat(args[0]);
    const num2 = parseFloat(args[1]);
    const numbers = { min: num1, max: num2 };
    if (checkNum(numbers)) {
        getRandomNum(numbers);
        return numbers;
    }
}

function getRandomNum(range) {
    randomNum = Math.round(Math.random() * (range.max - range.min) + range.min);
    console.log(`Загадал число: ${randomNum}`)
}

socket.on('message', (message) => {
    const data = JSON.parse(message.toString());

    const answer = Math.round(data.answer);
    console.log(`Сервер предположил: ${answer}`);

    if (answer === randomNum) {
        console.log(`Загаданное число ${randomNum} успешно угадано!`);
        process.exit();
    } else if (answer > randomNum) {
        socket.send(JSON.stringify({ hint: "less" }));
    } else {
        socket.send(JSON.stringify({ hint: "more" }));
    }
})

socket.connect('tcp://127.0.0.1:60123')

const range = getNum(process.argv.slice(2));
socket.send(JSON.stringify({ range: `${range.min}-${range.max}` }));