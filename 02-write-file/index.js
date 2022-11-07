const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

stdout.write('Hello! Please write your text.\n');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.on('exit', () => stdout.write('Stream stopped. Bye'));
process.on('SIGINT', exit);

stdin.on('data', chunk => {
    if (chunk.toString().trim() === 'exit') exit();
    output.write(chunk.toString())});
stdin.on('error', error => console.log('Error', error.message));