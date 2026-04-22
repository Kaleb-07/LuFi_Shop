const fs = require('fs');
const path = require('path');

const directory = 'src';

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            // Replace /shop/ with /
            content = content.replace(/\/shop\//g, '/');
            // Replace "/shop" or '/shop' (exact matches)
            content = content.replace(/\"\/shop\"/g, '"/"');
            content = content.replace(/\'\/shop\'/g, "'/'");
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(directory);
