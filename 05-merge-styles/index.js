const fs = require('fs');
const path = require('path');

async function buildBundle() {
    try {
        const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
        const onlyCssFiles = await files.filter(file => file.isFile() && path.extname(file.name) === ".css");
        const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    
        onlyCssFiles.forEach(file => {
            const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
            readableStream.pipe(bundle, { end: false });
        })
    } catch (error) {
        console.log(error);
    }
}
buildBundle();