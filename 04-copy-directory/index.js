const fs = require('fs');
const path = require('path');

async function copyDir(fromDir, toDir) {
    await fs.promises.rm(toDir, {recursive: true, force: true});
    await fs.promises.mkdir(toDir, {recursive: true});

    const files = await fs.promises.readdir(fromDir, {withFileTypes: true});

    files.forEach(file => {
        if (file.isFile()) {
            fs.promises.copyFile(path.join(fromDir, file.name), path.join(toDir, file.name));
        } else {
            copyDir(path.join(fromDir, file.name), path.join(toDir, file.name));
        }
    })
};

try {
    copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
} catch (error) {
    console.log(error.message);
}
