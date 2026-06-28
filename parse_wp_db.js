const fs = require('fs');
const path = require('path');

const BANNED_REPLACEMENTS = {
    "delve into": "dig into",
    "delve": "dig",
    "tapestry": "mix",
    "multifaceted": "layered",
    "nuanced": "subtle",
    "comprehensive": "detailed",
    "in-depth": "thorough",
    "robust": "solid",
    "cutting-edge": "modern",
    "leverage": "use",
    "paramount": "critical",
    "pivotal": "key",
    "groundbreaking": "new",
    "revolutionary": "big change",
    "game-changer": "major shift",
    "transformative": "big change",
    "furthermore": "also",
    "moreover": "also",
    "subsequently": "then",
    "journey": "process",
    "unlock": "use",
    "discover": "find",
    "explore": "look at"
};

function replaceBannedWords(text) {
    if (!text) return "";
    let cleaned = text;
    for (const [banned, replacement] of Object.entries(BANNED_REPLACEMENTS)) {
        const regex = new RegExp('\\b' + banned + '\\b', 'gi');
        cleaned = cleaned.replace(regex, (match) => {
            if (match[0] === match[0].toUpperCase()) {
                return replacement[0].toUpperCase() + replacement.slice(1);
            }
            return replacement;
        });
    }
    return cleaned;
}

function findTablePrefix(sqlPath) {
    console.log("Scanning database.sql to detect table prefix...");
    const content = fs.readFileSync(sqlPath, { encoding: 'utf8', flag: 'r' }).substring(0, 10 * 1024 * 1024); // read first 10MB
    const match = content.match(/CREATE TABLE `([^`]+)posts`|INSERT INTO `([^`]+)posts`|CREATE TABLE `([^`]+)options`/);
    if (match) {
        const prefix = match[1] || match[2] || match[3];
        console.log(`Detected table prefix: '${prefix}'`);
        return prefix;
    }
    console.log("Warning: Prefix not detected. Using fallback prefix: 'wp_'");
    return "wp_";
}

function parseSqlValues(valuesStr) {
    const tuples = [];
    let i = 0;
    const n = valuesStr.length;
    
    while (i < n) {
        while (i < n && valuesStr[i] !== '(') {
            i++;
        }
        if (i >= n) break;
        i++; // skip '('
        
        const elements = [];
        while (i < n) {
            while (i < n && /\s/.test(valuesStr[i])) {
                i++;
            }
            if (i >= n) break;
            
            if (valuesStr[i] === "'") {
                i++; // skip opening quote
                const valChars = [];
                while (i < n) {
                    const c = valuesStr[i];
                    if (c === '\\') {
                        if (i + 1 < n) {
                            const next = valuesStr[i + 1];
                            if (next === 'n') valChars.push('\n');
                            else if (next === 'r') valChars.push('\r');
                            else if (next === 't') valChars.push('\t');
                            else valChars.push(next);
                            i += 2;
                        } else {
                            valChars.push(c);
                            i++;
                        }
                    } else if (c === "'") {
                        i++; // skip closing quote
                        break;
                    } else {
                        valChars.push(c);
                        i++;
                    }
                }
                elements.push(valChars.join(''));
            } else {
                const start = i;
                while (i < n && valuesStr[i] !== ',' && valuesStr[i] !== ')') {
                    i++;
                }
                const valRaw = valuesStr.substring(start, i).trim();
                if (valRaw.toUpperCase() === 'NULL') {
                    elements.push(null);
                } else if ((valRaw.startsWith('"') && valRaw.endsWith('"')) || (valRaw.startsWith("'") && valRaw.endsWith("'"))) {
                    elements.push(valRaw.substring(1, valRaw.length - 1));
                } else {
                    const num = Number(valRaw);
                    if (!isNaN(num)) {
                        elements.push(num);
                    } else {
                        elements.push(valRaw);
                    }
                }
            }
            
            while (i < n && /\s/.test(valuesStr[i])) {
                i++;
            }
            if (i >= n) break;
            if (valuesStr[i] === ',') {
                i++;
            } else if (valuesStr[i] === ')') {
                i++;
                tuples.push(elements);
                break;
            }
        }
    }
    return tuples;
}

function parseDatabase(sqlPath, prefix, targetTables) {
    const data = {};
    targetTables.forEach(t => data[t] = []);
    const tableMap = {};
    targetTables.forEach(t => tableMap[`${prefix}${t}`] = t);
    
    console.log("Reading database.sql line by line...");
    const content = fs.readFileSync(sqlPath, 'utf8');
    
    let currentStatement = [];
    let inStatement = false;
    let inString = false;
    let escaping = false;
    let targetTable = null;
    
    // Split lines
    const lines = content.split(/\r?\n/);
    console.log(`Processing ${lines.length} lines of SQL dump...`);
    
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        if (!inStatement) {
            if (line.startsWith("INSERT INTO ")) {
                const match = line.match(/INSERT INTO `([^`]+)`/);
                if (match) {
                    const tbl = match[1];
                    if (tableMap[tbl]) {
                        inStatement = true;
                        targetTable = tableMap[tbl];
                        currentStatement = [line];
                        inString = false;
                        escaping = false;
                    }
                }
            }
        } else {
            currentStatement.push(line);
        }
        
        if (inStatement) {
            const lastLine = currentStatement[currentStatement.length - 1];
            for (let c = 0; c < lastLine.length; c++) {
                const char = lastLine[c];
                if (escaping) {
                    escaping = false;
                } else if (char === '\\') {
                    escaping = true;
                } else if (char === "'") {
                    inString = !inString;
                } else if (char === ';' && !inString) {
                    // Statement completed!
                    const stmt = currentStatement.join('\n');
                    const valuesIndex = stmt.indexOf("VALUES");
                    const idx = valuesIndex !== -1 ? valuesIndex : stmt.indexOf("values");
                    if (idx !== -1) {
                        const valuesStr = stmt.substring(idx + 6).trim();
                        const rows = parseSqlValues(valuesStr);
                        data[targetTable].push(...rows);
                    }
                    inStatement = false;
                    currentStatement = [];
                    targetTable = null;
                    break;
                }
            }
        }
    }
    
    targetTables.forEach(t => {
        console.log(`Extracted ${data[t].length} rows for table: ${t}`);
    });
    return data;
}

function cleanHtmlToMarkdown(html, validSlugs, baseUrl = "racketedge.com") {
    if (!html) return "";
    
    // 1. Clean Gutenberg comments
    let md = html.replace(/<!--[\s\S]*?-->/g, '');
    
    // 2. Headings and basic HTML elements
    md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n');
    md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n');
    md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n');
    md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n');
    md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**');
    md = md.replace(/<(?:em|i)>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*');
    md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1\n\n');
    
    // 3. Lists
    md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1');
    md = md.replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n');
    
    // 4. Images
    md = md.replace(/<img[^>]+>/gi, (tag) => {
        const srcMatch = tag.match(/src=["\']([^"\']+)["\']/i);
        const altMatch = tag.match(/alt=["\']([^"\']*)["\']/i);
        let src = srcMatch ? srcMatch[1] : "";
        const alt = altMatch ? altMatch[1] : "Image";
        
        if (src.includes("wp-content/uploads")) {
            const parts = src.split("wp-content/uploads/");
            src = "/wp-content/uploads/" + parts[parts.length - 1];
        }
        return `![${alt}](${src})\n\n`;
    });
    
    // 5. Link auditing
    md = md.replace(/<a[^>]+href=["\']([^"\']+)["\'][^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) => {
        href = href.trim();
        text = text.trim();
        
        let isInternal = false;
        let slug = null;
        
        if (href.includes(baseUrl) || href.startsWith('/') || (!href.startsWith('http') && href)) {
            isInternal = true;
            let cleanUrl = href.includes(baseUrl) ? href.split(baseUrl)[1] : href;
            cleanUrl = cleanUrl.replace(/^\/+|\/+$/g, '');
            
            const parts = cleanUrl.split('/');
            if (parts.length > 0) {
                slug = parts[parts.length - 1].split('?')[0].split('#')[0];
            }
        }
        
        if (isInternal) {
            if (slug && validSlugs.has(slug)) {
                const staticPages = ['about', 'contact', 'privacy-policy', 'affiliate-disclosure'];
                if (staticPages.includes(slug)) {
                    return `[${text}](/${slug})`;
                } else {
                    return `[${text}](/posts/${slug})`;
                }
            } else {
                if (slug === "" || href === "/" || href === "") {
                    return `[${text}](/)`;
                }
                console.log(`  [Link Audit] Stripped broken link: '${href}' (Anchor: '${text}')`);
                return text; // Remove HTML tag, keep only anchor text
            }
        } else {
            // External links
            if (href.includes("amazon.com") || href.includes("amzn.to")) {
                return `<a href="${href}" target="_blank" rel="nofollow sponsored">${text}</a>`;
            } else {
                return `<a href="${href}" target="_blank">${text}</a>`;
            }
        }
    });
    
    // 6. Cleanups
    md = md.replace(/<\/?(?:div|section|span|iframe)[^>]*>/gi, '');
    md = md.replace(/\n{3,}/g, '\n\n');
    
    // HTML entity decode
    md = md.replace(/&nbsp;/g, ' ')
           .replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&#8217;/g, "'")
           .replace(/&#8211;/g, '-');
           
    return md.trim();
}

function findSqlFile(dir) {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (e) {
            continue;
        }
        if (stat.isDirectory()) {
            const found = findSqlFile(fullPath);
            if (found) return found;
        } else if (file === 'database.sql') {
            return fullPath;
        }
    }
    return null;
}

function runMigration() {
    const sqlPath = findSqlFile("extracted");
    if (!sqlPath) {
        console.error("Error: database.sql not found inside 'extracted' directory. Please verify that extraction succeeded.");
        process.exit(1);
    }
    
    const prefix = findTablePrefix(sqlPath);
    const targetTables = ['posts', 'postmeta', 'terms', 'term_taxonomy', 'term_relationships'];
    const dbData = parseDatabase(sqlPath, prefix, targetTables);
    
    console.log("Processing content maps...");
    
    // 1. Map postmeta
    const metaMap = {};
    dbData.postmeta.forEach(row => {
        if (row.length >= 4) {
            const pid = row[1];
            const key = row[2];
            const val = row[3];
            if (!metaMap[pid]) metaMap[pid] = {};
            metaMap[pid][key] = val;
        }
    });
    
    // 2. Map terms
    const termsMap = {};
    dbData.terms.forEach(row => {
        if (row.length >= 3) {
            const tid = row[0];
            const name = row[1];
            const slug = row[2];
            termsMap[tid] = { name, slug };
        }
    });
    
    // 3. Map term taxonomy
    const taxonomyMap = {};
    dbData.term_taxonomy.forEach(row => {
        if (row.length >= 3) {
            const ttid = row[0];
            const tid = row[1];
            const tax = row[2];
            taxonomyMap[ttid] = { termId: tid, taxonomy: tax };
        }
    });
    
    // 4. Map term relationships
    const postTermsMap = {};
    dbData.term_relationships.forEach(row => {
        if (row.length >= 2) {
            const pid = row[0];
            const ttid = row[1];
            if (!postTermsMap[pid]) postTermsMap[pid] = [];
            if (taxonomyMap[ttid]) {
                const tid = taxonomyMap[ttid].termId;
                const tax = taxonomyMap[ttid].taxonomy;
                if (termsMap[tid]) {
                    postTermsMap[pid].push({
                        name: termsMap[tid].name,
                        slug: termsMap[tid].slug,
                        taxonomy: tax
                    });
                }
            }
        }
    });
    
    // 5. Map attachments
    const attachmentsMap = {};
    dbData.posts.forEach(row => {
        if (row.length >= 21) {
            const pid = row[0];
            const ptype = row[20];
            if (ptype === 'attachment') {
                attachmentsMap[pid] = row[18]; // guid
            }
        }
    });
    
    // 6. Map valid published post slugs
    const validSlugs = new Set();
    const publishedItems = [];
    
    dbData.posts.forEach(row => {
        if (row.length >= 21) {
            const pid = row[0];
            const status = row[7];
            const slug = row[11];
            const ptype = row[20];
            if (status === 'publish' && (ptype === 'post' || ptype === 'page') && slug) {
                validSlugs.add(slug);
                publishedItems.push(row);
            }
        }
    });
    
    console.log(`Mapped ${validSlugs.size} published page/post slugs.`);
    
    // Create folders
    fs.mkdirSync("content/posts", { recursive: true });
    fs.mkdirSync("content/pages", { recursive: true });
    
    let postsCount = 0;
    let pagesCount = 0;
    
    publishedItems.forEach(row => {
        const pid = row[0];
        const date = row[2];
        const content = row[4];
        const title = row[5];
        const excerpt = row[6];
        const slug = row[11];
        const modified = row[14];
        const ptype = row[20];
        
        const meta = metaMap[pid] || {};
        const seoTitle = meta.rank_math_title || title;
        let seoDesc = meta.rank_math_description || excerpt || "";
        seoDesc = seoDesc.replace(/<[^>]+>/g, '').trim();
        const focusKw = meta.rank_math_focus_keyword || "";
        
        const termsList = postTermsMap[pid] || [];
        const categories = termsList.filter(t => t.taxonomy === 'category').map(t => t.name);
        const tags = termsList.filter(t => t.taxonomy === 'post_tag').map(t => t.name);
        
        let category = "General";
        const titleLower = title.toLowerCase();
        if (titleLower.includes("schläger") || titleLower.includes("tennisschläger")) {
            category = "Tennisschläger";
        } else if (titleLower.includes("badminton")) {
            category = "Badminton";
        } else if (titleLower.includes("racket") || titleLower.includes("racquet") || titleLower.includes("pure strike") || titleLower.includes("gravity mp") || titleLower.includes("speed mp") || titleLower.includes("ezone") || titleLower.includes("blade 98") || titleLower.includes("pro staff")) {
            category = "Tennis Rackets";
        } else if (titleLower.includes("string") || titleLower.includes("strings")) {
            category = "Tennis Strings";
        } else if (titleLower.includes("shoe") || titleLower.includes("shoes")) {
            category = "Tennis Shoes";
        } else if (titleLower.includes("bag") || titleLower.includes("bags")) {
            category = "Tennis Bags";
        } else if (titleLower.includes("ball machine") || titleLower.includes("ball machines")) {
            category = "Tennis Ball Machines";
        } else if (titleLower.includes("rules") || titleLower.includes("court") || titleLower.includes("scoring") || titleLower.includes("what is") || titleLower.includes("how do") || titleLower.includes("types of") || titleLower.includes("fastest-surface") || titleLower.includes("let-rule") || titleLower.includes("love-in-tennis") || titleLower.includes("ad-court") || titleLower.includes("how fast") || titleLower.includes("tennis-organizations") || titleLower.includes("net height") || titleLower.includes("dimensions") || titleLower.includes("set in") || titleLower.includes("let in") || titleLower.includes("love in") || titleLower.includes("ad court")) {
            category = "Tennis Guides";
        } else {
            const originalCat = categories.find(c => c !== "Uncategorized");
            if (originalCat) {
                category = originalCat;
            }
        }
        
        // Featured image
        let featuredImage = "";
        const thumbIdStr = meta._thumbnail_id;
        if (thumbIdStr) {
            const thumbId = parseInt(thumbIdStr, 10);
            if (!isNaN(thumbId)) {
                const attachMeta = metaMap[thumbId] || {};
                const attachedFile = attachMeta._wp_attached_file;
                if (attachedFile) {
                    featuredImage = "/wp-content/uploads/" + attachedFile.replace(/\\/g, '/');
                } else if (attachmentsMap[thumbId]) {
                    const guid = attachmentsMap[thumbId];
                    if (guid.includes("wp-content/uploads")) {
                        const parts = guid.split("wp-content/uploads/");
                        featuredImage = "/wp-content/uploads/" + parts[parts.length - 1];
                    }
                }
            }
        }
        
        console.log(`Processing: [${ptype.toUpperCase()}] '${title}' (slug: ${slug})...`);
        const rawMarkdownBody = cleanHtmlToMarkdown(content, validSlugs);
        const markdownBody = replaceBannedWords(rawMarkdownBody);
        
        const cleanTitle = replaceBannedWords(title);
        const cleanSeoTitle = replaceBannedWords(seoTitle);
        const cleanSeoDesc = replaceBannedWords(seoDesc);
        
        const frontmatter = [
            "---",
            `title: "${cleanTitle.replace(/"/g, '\\"')}"`,
            `seoTitle: "${cleanSeoTitle.replace(/"/g, '\\"')}"`,
            `description: "${cleanSeoDesc.replace(/"/g, '\\"')}"`,
            `date: "${date}"`,
            `dateModified: "${modified}"`,
            `slug: "${slug}"`,
            `focusKeyword: "${focusKw.replace(/"/g, '\\"')}"`,
            `category: "${category}"`
        ];
        
        if (tags.length > 0) {
            frontmatter.push("tags:");
            tags.forEach(t => frontmatter.push(`  - "${t}"`));
        }
        
        if (featuredImage) {
            frontmatter.push(`featuredImage: "${featuredImage}"`);
        }
        
        frontmatter.push("---");
        frontmatter.push("\n" + markdownBody);
        
        const fileContent = frontmatter.join('\n');
        
        let filename;
        if (ptype === 'post') {
            filename = `content/posts/${slug}.md`;
            postsCount++;
        } else {
            filename = `content/pages/${slug}.md`;
            pagesCount++;
        }
        
        fs.writeFileSync(filename, fileContent, 'utf8');
    });
    
    console.log(`\nCompleted! Generated ${postsCount} posts and ${pagesCount} pages.`);
    
    // Copy uploads media library to public folder
    let srcUploads = "extracted/wp-content/uploads";
    if (!fs.existsSync(srcUploads) && fs.existsSync("extracted/uploads")) {
        srcUploads = "extracted/uploads";
    }
    const destUploads = "public/wp-content/uploads";
    if (fs.existsSync(srcUploads)) {
        console.log(`Copying media library from '${srcUploads}' to '${destUploads}'...`);
        fs.mkdirSync(path.dirname(destUploads), { recursive: true });
        fs.cpSync(srcUploads, destUploads, { recursive: true });
        console.log("Media copy completed!");
        
        // Clean up obfuscated media directory hashes (e.g. 2026/021074d9c1/ -> 2026/02/)
        console.log("Cleaning up obfuscated media paths...");
        const years = fs.readdirSync(destUploads);
        for (const year of years) {
            const yearPath = path.join(destUploads, year);
            if (!fs.statSync(yearPath).isDirectory()) continue;
            if (!/^\d{4}$/.test(year)) continue;
            
            const subdirs = fs.readdirSync(yearPath);
            for (const subdir of subdirs) {
                const subdirPath = path.join(yearPath, subdir);
                if (!fs.statSync(subdirPath).isDirectory()) continue;
                
                const match = subdir.match(/^(\d{2})[a-f0-9]+$/);
                if (match) {
                    const month = match[1];
                    const targetMonthPath = path.join(yearPath, month);
                    if (!fs.existsSync(targetMonthPath)) {
                        fs.mkdirSync(targetMonthPath, { recursive: true });
                    }
                    
                    const files = fs.readdirSync(subdirPath);
                    for (const file of files) {
                        const srcFile = path.join(subdirPath, file);
                        const destFile = path.join(targetMonthPath, file);
                        fs.renameSync(srcFile, destFile);
                    }
                    fs.rmdirSync(subdirPath);
                }
            }
        }
        console.log("Media path cleanup completed successfully!");
    } else {
        console.log("Warning: No media uploads found in 'extracted/wp-content/uploads' or 'extracted/uploads'.");
    }
}

runMigration();
