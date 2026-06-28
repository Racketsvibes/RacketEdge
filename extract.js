const fs = require('fs');
const path = require('path');

const wpressFile = "racketedge-com-20260624-101349-3ta0pdcp7o13.wpress";
if (!fs.existsSync(wpressFile)) {
    console.error(`Error: ${wpressFile} not found.`);
    process.exit(1);
}

const filenameSize = 255;
const contentSize = 14;
const mtimeSize = 12;
const prefixSize = 4096;
const headerSize = filenameSize + contentSize + mtimeSize + prefixSize; // 4377

const outDir = "extracted";
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const totalSize = fs.statSync(wpressFile).size;
let bytesRead = 0;

console.log(`Starting extraction of ${wpressFile} (${(totalSize / (1024*1024)).toFixed(1)} MB) to '${outDir}'...`);

const fd = fs.openSync(wpressFile, 'r');
const headerBuffer = Buffer.alloc(headerSize);

let fileCount = 0;
let lastPercent = -1;

while (true) {
    let read;
    try {
        read = fs.readSync(fd, headerBuffer, 0, headerSize, null);
    } catch (e) {
        console.error(`\nRead error at byte ${bytesRead}: ${e.message}`);
        break;
    }
    
    bytesRead += read;
    
    if (read < headerSize) {
        break;
    }
    
    // Check for EOF block (all nulls)
    let isAllNull = true;
    for (let k = 0; k < headerSize; k++) {
        if (headerBuffer[k] !== 0) {
            isAllNull = false;
            break;
        }
    }
    if (isAllNull) {
        console.log("Reached end-of-archive marker.");
        break;
    }
    
    // Decode header fields
    let filename = headerBuffer.subarray(0, filenameSize).toString('utf8').replace(/\0/g, '').trim();
    let sizeStr = headerBuffer.subarray(filenameSize, filenameSize + contentSize).toString('utf8').replace(/\0/g, '').trim();
    let size = parseInt(sizeStr, 10) || 0;
    let mtimeStr = headerBuffer.subarray(filenameSize + contentSize, filenameSize + contentSize + mtimeSize).toString('utf8').replace(/\0/g, '').trim();
    let mtime = parseInt(mtimeStr, 10) || 0;
    let prefix = headerBuffer.subarray(filenameSize + contentSize + mtimeSize, headerSize).toString('utf8').replace(/\0/g, '').trim();
    
    let relPath = filename;
    if (prefix && prefix !== '.') {
        relPath = path.join(prefix, filename);
    }
    
    relPath = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
    const destPath = path.join(outDir, relPath);
    
    // Read file content
    const contentBuffer = Buffer.alloc(size);
    let contentBytesRead = 0;
    while (contentBytesRead < size) {
        const chunk = fs.readSync(fd, contentBuffer, contentBytesRead, size - contentBytesRead, null);
        if (chunk === 0) {
            console.warn(`\nWarning: Expected {size} bytes for {relPath}, but hit EOF after reading {contentBytesRead} bytes.`);
            break;
        }
        contentBytesRead += chunk;
    }
    bytesRead += contentBytesRead;
    
    // Write content to disk
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, contentBuffer.subarray(0, contentBytesRead));
    
    // Set modified time
    if (mtime) {
        try {
            fs.utimesSync(destPath, new Date(), new Date(mtime * 1000));
        } catch (e) {}
    }
    
    fileCount++;
    const percent = Math.floor((bytesRead / totalSize) * 100);
    if (percent !== lastPercent && percent % 5 === 0) {
        process.stdout.write(`Progress: ${percent}% | Extracted ${fileCount} files...\r`);
        lastPercent = percent;
    }
}

fs.closeSync(fd);
console.log(`\nExtraction completed! Total files extracted: ${fileCount}`);
