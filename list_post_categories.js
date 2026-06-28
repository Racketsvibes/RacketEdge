const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDir = 'content/posts';
if (!fs.existsSync(postsDir)) {
    console.error("Posts directory not found.");
    process.exit(1);
}

const files = fs.readdirSync(postsDir);
console.log(`Scanning ${files.length} posts for categories...\n`);

const categoriesMap = {};

files.forEach(file => {
    const fullPath = path.join(postsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(content);
    
    console.log(`Post: '${file}' -> Category: '${data.category}'`);
    
    if (!categoriesMap[data.category]) categoriesMap[data.category] = [];
    categoriesMap[data.category].push(file);
});

console.log("\nSummary of Categories:");
for (const [cat, list] of Object.entries(categoriesMap)) {
    console.log(`- ${cat}: ${list.length} posts`);
}
