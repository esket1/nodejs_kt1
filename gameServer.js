const zmq = require('zeromq/v5-compat');
const socket = zmq.socket('rep');
let range;
let number;

socket.on('message', (message) => {
    const data = JSON.parse(message.toString());
    console.log(`Сообщение от клиента: ${JSON.stringify(data)}`)
    
    if (data.range) {
        const [min, max] = data.range.split('-').map(Number);
        range = { min, max };
        number = Math.floor((range.min + range.max) / 2);
        socket.send(JSON.stringify({ answer: number }));
        return;
    };
    
    if (data.hint) {
        if (data.hint === 'more') {
            range.min = number + 1;
        } else if (data.hint === 'less') {
            range.max = number - 1;
        };
    }
    
    number = Math.floor((range.min + range.max) / 2);
    socket.send(JSON.stringify({ answer: number }));
})

socket.bind('tcp://127.0.0.1:60123', error => {
    if (!error) {
        console.log("Готов к игре...")
    } else { console.error(error) }
});