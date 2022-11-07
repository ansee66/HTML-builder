const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (err, files) => {
    if (err) {
        stdout.write(err.message);
    } else {
        const onlyFiles = files.filter(file => file.isFile());
        onlyFiles.forEach(file => {
            let parsedFileName = path.parse(file.name);

            fs.stat(path.join(__dirname, 'secret-folder', parsedFileName.base), (err, stats) => {
                if (err) stdout.write(err.message);
                console.log(`${parsedFileName.name} - ${parsedFileName.ext.slice(1)} - ${stats.size}bytes`);
            });
        })
    }
});