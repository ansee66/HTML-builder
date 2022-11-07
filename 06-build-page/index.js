const fs = require('fs');
const path = require('path');

fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});

async function buildHTML() {
    try {
        const components = await fs.promises.readdir(path.join(__dirname, 'components'));
        fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (error, data) => {
            if (error) console.log(error.message);
            const regexp = /\{\{(.*)\}\}/;
            let lines = data.split('\n');
            let filledTemplate = [];
            lines.forEach(line => {
                if (regexp.test(line)) {
                    let tag = line.replace(/[^a-zA-Z0-9_-]/gi,"");
                    components.forEach((component) => {
                        let nameComponent = component.slice(0, -5);
                        if (nameComponent === tag) {
                            line = fs.promises.readFile(path.join(__dirname, 'components', component), 'utf8');
                        }
                    })
                }
                filledTemplate.push(line);
            })
            fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), filledTemplate)  
        });
    } catch (error) {
        console.log(error);
    }  
}
buildHTML();

async function buildBundle() {
    try {
        const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
        const onlyCssFiles = await files.filter(file => file.isFile() && path.extname(file.name) === ".css");
        const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

        onlyCssFiles.forEach(file => {
            const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
            readableStream.pipe(bundle, { end: false });
        })
    } catch (error) {
        console.log(error);
    }
}
buildBundle();

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
    copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
} catch (error) {
    console.log(error.message);
}