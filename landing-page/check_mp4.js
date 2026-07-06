/* eslint-disable */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'media', 'hero-bg.mp4');
const buffer = fs.readFileSync(filePath);

let offset = 0;
let moovOffset = -1;
let mdatOffset = -1;
let hasAudio = false;

while (offset < buffer.length) {
    const size = buffer.readUInt32BE(offset);
    if (size === 0) break;
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    
    if (type === 'moov') {
        moovOffset = offset;
        // Search inside moov for trak -> mdia -> hdlr
        // This is a naive search just looking for the string 'soun' (Sound handler)
        const moovBuffer = buffer.slice(offset, offset + size);
        if (moovBuffer.includes('soun')) {
            hasAudio = true;
        }
    } else if (type === 'mdat') {
        mdatOffset = offset;
    }
    
    offset += size;
}

console.log('moov before mdat:', moovOffset < mdatOffset);
console.log('has audio:', hasAudio);
