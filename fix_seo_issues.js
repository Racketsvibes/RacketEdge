const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'content', 'posts');

// Banned AI words → natural replacements
const BANNED_REPLACEMENTS = [
    [/\bdelve(?:s|d)?\b/gi, (m) => m[0] === m[0].toUpperCase() ? 'Dig' : 'dig'],
    [/\btapestry\b/gi, 'mix'],
    [/\bmultifaceted\b/gi, 'varied'],
    [/\bnuanced\b/gi, 'subtle'],
    [/\bcomprehensive\b/gi, 'complete'],
    [/\bin-depth\b/gi, 'detailed'],
    [/\brobust\b/gi, 'solid'],
    [/\bcutting-edge\b/gi, 'modern'],
    [/\bleverage(?:s|d)?\b/gi, 'use'],
    [/\bparamount\b/gi, 'key'],
    [/\bpivotal\b/gi, 'key'],
    [/\bgroundbreaking\b/gi, 'innovative'],
    [/\brevolutionary\b/gi, 'breakthrough'],
    [/\bgame-changer\b/gi, 'major upgrade'],
    [/\btransformative\b/gi, 'significant'],
    [/\bfurthermore\b/gi, 'Also'],
    [/\bmoreover\b/gi, "What's more"],
    [/\bsubsequently\b/gi, 'then'],
    [/\bunlock(?:s|ed|ing)?\b/gi, 'open up'],
];

// All available slugs for internal linking
function getAllSlugs() {
    return fs.readdirSync(POSTS_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''));
}

// Topic keywords mapped to slugs for smart internal linking
function getTopicMap() {
    return {
        'tennis racket': 'best-tennis-rackets',
        'tennis rackets': 'best-tennis-rackets',
        'racket review': 'best-tennis-rackets',
        'beginner racket': 'best-beginner-tennis-racket',
        'beginner tennis': 'best-beginner-tennis-racket',
        'tennis string': 'best-tennis-strings-experts-choice',
        'tennis strings': 'best-tennis-strings-experts-choice',
        'tennis bag': 'best-tennis-bags',
        'tennis bags': 'best-tennis-bags',
        'tennis shoe': 'best-tennis-shoes-for-women',
        'tennis shoes': 'best-tennis-shoes-for-women',
        'ball machine': 'best-tennis-ball-machines',
        'ball machines': 'best-tennis-ball-machines',
        'wilson racket': 'best-wilson-tennis-rackets',
        'wilson tennis': 'best-wilson-tennis-rackets',
        'head racket': 'best-head-tennis-racquets',
        'head tennis': 'best-head-tennis-racquets',
        'babolat': 'best-babolat-tennis-racket',
        'babolat racket': 'best-babolat-tennis-racket',
        'tennis elbow': 'best-tennis-rackets-for-tennis-elbow',
        'junior racket': 'best-junior-tennis-rackets',
        'junior tennis': 'best-junior-tennis-rackets',
        'racket stiffness': 'tennis-racket-stiffness',
        'stiffness': 'tennis-racket-stiffness',
        'racket weight': 'tennis-racket-weight',
        'tennis court': 'tennis-court-dimensions',
        'court dimensions': 'tennis-court-dimensions',
        'tennis net': 'tennis-net-height',
        'net height': 'tennis-net-height',
        'tennis shots': 'types-of-tennis-shots',
        'forehand': 'types-of-tennis-shots',
        'backhand': 'types-of-tennis-shots',
        'volley': 'types-of-tennis-shots',
        'serve': 'types-of-tennis-shots',
        'court surface': 'fastest-tennis-surface',
        'clay court': 'fastest-tennis-surface',
        'grass court': 'fastest-tennis-surface',
        'hard court': 'fastest-tennis-surface',
        'fastest surface': 'fastest-tennis-surface',
        'tennis scoring': 'set-in-tennis',
        'tennis set': 'set-in-tennis',
        'deuce': 'love-in-tennis',
        'love in tennis': 'love-in-tennis',
        'let rule': 'let-rule-in-tennis',
        'let in tennis': 'let-rule-in-tennis',
        'ad court': 'ad-court-in-tennis',
        'advantage court': 'ad-court-in-tennis',
        'racket brand': 'top-tennis-racket-brands',
        'tennis organization': 'tennis-organizations',
        'badminton racket': 'best-badminton-rackets',
        'badminton': 'best-badminton-rackets',
        'string tension': 'badminton-racket-string-tension-complete-guide',
        'carlos alcaraz': 'carlos-alcaraz-racket',
        'alcaraz racket': 'carlos-alcaraz-racket',
        'italian open': 'italian-open-tennis-tournament',
        'yonex ezone': 'yonex-ezone-100-review',
        'wilson blade': 'wilson-blade-98-vs-babolat-pure-strike',
        'pure strike': 'wilson-blade-98-vs-babolat-pure-strike',
        'wilson tour slam': 'wilson-tour-slam-racket-review',
        'head speed': 'head-speed-mp-review',
        'head gravity': 'head-gravity-mp-review',
        'yonex ezone 98': 'yonex-ezone-98-review',
        'tennis ball speed': 'how-fast-does-a-tennis-ball-go',
    };
}

function parseFrontmatter(content) {
    const parts = content.split('---');
    if (parts.length < 3) return null;
    const fmStr = parts[1];
    const body = parts.slice(2).join('---').trim();
    
    const metadata = {};
    const fmLines = fmStr.split('\n');
    const tagLines = [];
    let inTags = false;
    
    fmLines.forEach(line => {
        if (line.trim().startsWith('tags:')) {
            inTags = true;
            return;
        }
        if (inTags) {
            if (line.trim().startsWith('- ')) {
                tagLines.push(line);
                return;
            }
            inTags = false;
        }
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim();
            const val = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
            metadata[key] = val;
        }
    });
    
    return { metadata, body, tagLines, rawFrontmatter: fmStr };
}

function rebuildFile(metadata, body, tagLines) {
    const lines = [
        '---',
        `title: "${metadata.title.replace(/"/g, '\\"')}"`,
        `seoTitle: "${metadata.seoTitle.replace(/"/g, '\\"')}"`,
        `description: "${metadata.description.replace(/"/g, '\\"')}"`,
        `date: "${metadata.date}"`,
        `dateModified: "${metadata.dateModified}"`,
        `slug: "${metadata.slug}"`,
        `focusKeyword: "${metadata.focusKeyword}"`,
        `category: "${metadata.category}"`,
    ];
    
    if (tagLines.length > 0) {
        lines.push('tags:');
        tagLines.forEach(t => lines.push(t));
    }
    
    if (metadata.featuredImage) {
        lines.push(`featuredImage: "${metadata.featuredImage}"`);
    }
    
    lines.push('---');
    lines.push('');
    lines.push(body);
    
    return lines.join('\n');
}

function getPrimaryKeyword(focusKw) {
    if (!focusKw) return '';
    return focusKw.split(',')[0].trim().toLowerCase();
}

function fixBannedWords(text) {
    let fixed = text;
    let count = 0;
    BANNED_REPLACEMENTS.forEach(([regex, replacement]) => {
        const before = fixed;
        fixed = fixed.replace(regex, replacement);
        if (before !== fixed) count++;
    });
    return { text: fixed, count };
}

function fixSeoTitle(metadata, primaryKw) {
    if (!primaryKw) return false;
    const currentTitle = (metadata.seoTitle || metadata.title || '').toLowerCase();
    if (currentTitle.includes(primaryKw)) return false;
    
    // Try to insert keyword naturally
    let seoTitle = metadata.seoTitle || metadata.title;
    
    // If title contains a related word, we can work with it
    // Otherwise prepend keyword
    const kwCapitalized = primaryKw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Keep under 60 chars
    if (seoTitle.length + kwCapitalized.length + 3 <= 60) {
        seoTitle = `${kwCapitalized}: ${seoTitle}`;
    } else {
        // Replace some part or trim
        seoTitle = `${kwCapitalized} - ${seoTitle.substring(0, 55 - kwCapitalized.length)}`;
    }
    
    if (seoTitle.length > 60) {
        seoTitle = seoTitle.substring(0, 57) + '...';
    }
    
    metadata.seoTitle = seoTitle;
    return true;
}

function fixMetaDescription(metadata, primaryKw) {
    if (!primaryKw) return false;
    const currentDesc = (metadata.description || '').toLowerCase();
    if (currentDesc.includes(primaryKw)) return false;
    
    let desc = metadata.description;
    const kwCapitalized = primaryKw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Prepend keyword mention naturally
    if (desc.length + kwCapitalized.length + 20 <= 160) {
        desc = `${kwCapitalized} guide: ${desc}`;
    } else {
        // Insert at beginning and trim
        desc = `${kwCapitalized}: ${desc}`;
    }
    
    if (desc.length > 160) {
        desc = desc.substring(0, 157) + '...';
    }
    
    metadata.description = desc;
    return true;
}

function fixH1InBody(body) {
    const h1Regex = /^# /gm;
    if (!h1Regex.test(body)) return { text: body, fixed: false };
    return { text: body.replace(/^# /gm, '## '), fixed: true };
}

function fixImageAlt(body, primaryKw) {
    if (!primaryKw) return { text: body, fixed: false };
    
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let hasImageWithKw = false;
    let firstImgFound = false;
    
    // Check if any image already has the keyword
    while ((match = imgRegex.exec(body)) !== null) {
        if (match[1].toLowerCase().includes(primaryKw)) {
            hasImageWithKw = true;
            break;
        }
    }
    
    if (hasImageWithKw) return { text: body, fixed: false };
    
    // Fix the first image's alt to include keyword
    const kwCapitalized = primaryKw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let fixed = false;
    const newBody = body.replace(/!\[([^\]]*)\]\(([^)]+)\)/, (m, alt, src) => {
        if (!fixed) {
            fixed = true;
            const newAlt = alt ? `${kwCapitalized} - ${alt}` : kwCapitalized;
            // Keep under 125 chars
            const trimmedAlt = newAlt.length > 125 ? newAlt.substring(0, 122) + '...' : newAlt;
            return `![${trimmedAlt}](${src})`;
        }
        return m;
    });
    
    return { text: newBody, fixed };
}

function fixSubheadingKeyword(body, primaryKw) {
    if (!primaryKw) return { text: body, fixed: false };
    
    const headingRegex = /^(#{2,3})\s+(.*?)$/gm;
    let match;
    let hasKwInHeading = false;
    
    while ((match = headingRegex.exec(body)) !== null) {
        if (match[2].toLowerCase().includes(primaryKw)) {
            hasKwInHeading = true;
            break;
        }
    }
    
    if (hasKwInHeading) return { text: body, fixed: false };
    
    // Find the first H2 that looks like it could naturally include the keyword
    const kwCapitalized = primaryKw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let fixed = false;
    
    const newBody = body.replace(/^(#{2})\s+(.*?)$/m, (m, hashes, text) => {
        if (!fixed) {
            fixed = true;
            // If heading is short enough, append keyword context
            if (text.length < 40) {
                return `${hashes} ${text}: ${kwCapitalized} Guide`;
            }
            return `${hashes} ${kwCapitalized}: ${text}`;
        }
        return m;
    });
    
    return { text: newBody, fixed };
}

function fixFirstTenPercent(body, primaryKw) {
    if (!primaryKw) return { text: body, fixed: false };
    
    const tenPercent = Math.max(200, Math.floor(body.length * 0.1));
    const firstChunk = body.substring(0, tenPercent).toLowerCase();
    
    if (firstChunk.includes(primaryKw)) return { text: body, fixed: false };
    
    // Find the end of the first paragraph and insert keyword mention
    const firstParaEnd = body.indexOf('\n\n');
    if (firstParaEnd === -1) return { text: body, fixed: false };
    
    const kwCapitalized = primaryKw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const firstPara = body.substring(0, firstParaEnd);
    const rest = body.substring(firstParaEnd);
    
    // Append keyword to first paragraph
    const newFirst = firstPara.trimEnd() + ` This ${primaryKw} guide has everything you need.`;
    
    return { text: newFirst + rest, fixed: true };
}

function countInternalLinks(body) {
    const linkRegex = /\[([^\]]+)\]\(\/posts\/([^)]+)\)/g;
    let count = 0;
    let match;
    while ((match = linkRegex.exec(body)) !== null) {
        count++;
    }
    return count;
}

function addInternalLinks(body, currentSlug, allSlugs) {
    const existingCount = countInternalLinks(body);
    if (existingCount >= 3) return { text: body, added: 0 };
    
    const topicMap = getTopicMap();
    const needed = 3 - existingCount;
    const bodyLower = body.toLowerCase();
    let linksAdded = 0;
    let newBody = body;
    
    // Already linked slugs
    const alreadyLinked = new Set();
    const existingLinksRegex = /\[([^\]]+)\]\(\/posts\/([^)]+)\)/g;
    let m;
    while ((m = existingLinksRegex.exec(body)) !== null) {
        alreadyLinked.add(m[2]);
    }
    alreadyLinked.add(currentSlug);
    
    // Try to find topic mentions in the body and link them
    for (const [topic, slug] of Object.entries(topicMap)) {
        if (linksAdded >= needed) break;
        if (alreadyLinked.has(slug)) continue;
        if (!allSlugs.includes(slug)) continue;
        
        // Check if the topic is mentioned in the body
        const topicRegex = new RegExp(`\\b${topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const topicMatch = topicRegex.exec(newBody);
        
        if (topicMatch) {
            // Only link the first occurrence, and only if it's not already inside a link
            const beforeMatch = newBody.substring(Math.max(0, topicMatch.index - 2), topicMatch.index);
            const afterMatch = newBody.substring(topicMatch.index + topicMatch[0].length, topicMatch.index + topicMatch[0].length + 2);
            
            // Skip if already inside a markdown link
            if (beforeMatch.includes('[') || afterMatch.includes(']') || beforeMatch.includes('(')) continue;
            
            const anchorText = topicMatch[0];
            const linkedText = `[${anchorText}](/posts/${slug})`;
            newBody = newBody.substring(0, topicMatch.index) + linkedText + newBody.substring(topicMatch.index + topicMatch[0].length);
            alreadyLinked.add(slug);
            linksAdded++;
        }
    }
    
    // If still not enough links, add a "Related Articles" section before FAQ or at end
    if (linksAdded < needed) {
        const remainingNeeded = needed - linksAdded;
        const relatedLinks = [];
        
        // Pick related posts by category similarity
        for (const slug of allSlugs) {
            if (relatedLinks.length >= remainingNeeded) break;
            if (alreadyLinked.has(slug)) continue;
            
            // Pick slugs that share words with current slug
            const currentWords = currentSlug.split('-');
            const candidateWords = slug.split('-');
            const common = currentWords.filter(w => candidateWords.includes(w) && w.length > 3);
            
            if (common.length > 0) {
                const displayName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                relatedLinks.push(`- [${displayName}](/posts/${slug})`);
                alreadyLinked.add(slug);
                linksAdded++;
            }
        }
        
        if (relatedLinks.length > 0) {
            const relatedSection = `\n\n## Related Articles\n\n${relatedLinks.join('\n')}\n`;
            
            // Insert before FAQ section if exists
            const faqIndex = newBody.search(/^##\s+FAQ/im);
            if (faqIndex !== -1) {
                newBody = newBody.substring(0, faqIndex) + relatedSection + '\n' + newBody.substring(faqIndex);
            } else {
                newBody += relatedSection;
            }
        }
    }
    
    return { text: newBody, added: linksAdded };
}

// ============== MAIN ==============
function main() {
    console.log('=== RacketEdge SEO Fix Script ===\n');
    
    const allSlugs = getAllSlugs();
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    
    let totalBannedFixed = 0;
    let totalSeoTitleFixed = 0;
    let totalDescFixed = 0;
    let totalH1Fixed = 0;
    let totalAltFixed = 0;
    let totalSubheadingFixed = 0;
    let totalFirst10Fixed = 0;
    let totalLinksAdded = 0;
    
    files.forEach(filename => {
        const filepath = path.join(POSTS_DIR, filename);
        const content = fs.readFileSync(filepath, 'utf8');
        const parsed = parseFrontmatter(content);
        
        if (!parsed) {
            console.log(`[SKIP] ${filename}: Invalid frontmatter`);
            return;
        }
        
        let { metadata, body, tagLines } = parsed;
        const primaryKw = getPrimaryKeyword(metadata.focusKeyword);
        const currentSlug = metadata.slug;
        const changes = [];
        
        // 1. Fix banned AI words
        const bannedResult = fixBannedWords(body);
        if (bannedResult.count > 0) {
            body = bannedResult.text;
            changes.push(`Replaced ${bannedResult.count} banned AI words`);
            totalBannedFixed += bannedResult.count;
        }
        
        // Also fix banned words in metadata
        const titleBanned = fixBannedWords(metadata.title);
        if (titleBanned.count > 0) metadata.title = titleBanned.text;
        const seoTitleBanned = fixBannedWords(metadata.seoTitle || metadata.title);
        if (seoTitleBanned.count > 0) metadata.seoTitle = seoTitleBanned.text;
        const descBanned = fixBannedWords(metadata.description);
        if (descBanned.count > 0) metadata.description = descBanned.text;
        
        // 2. Fix SEO title
        if (fixSeoTitle(metadata, primaryKw)) {
            changes.push(`Fixed SEO title to include '${primaryKw}'`);
            totalSeoTitleFixed++;
        }
        
        // 3. Fix meta description
        if (fixMetaDescription(metadata, primaryKw)) {
            changes.push(`Fixed description to include '${primaryKw}'`);
            totalDescFixed++;
        }
        
        // 4. Fix H1 in body
        const h1Result = fixH1InBody(body);
        if (h1Result.fixed) {
            body = h1Result.text;
            changes.push('Fixed H1 → H2 in body');
            totalH1Fixed++;
        }
        
        // 5. Fix image alt text
        const altResult = fixImageAlt(body, primaryKw);
        if (altResult.fixed) {
            body = altResult.text;
            changes.push('Fixed image alt to include keyword');
            totalAltFixed++;
        }
        
        // 6. Fix subheading keyword
        const subResult = fixSubheadingKeyword(body, primaryKw);
        if (subResult.fixed) {
            body = subResult.text;
            changes.push('Fixed subheading to include keyword');
            totalSubheadingFixed++;
        }
        
        // 7. Fix first 10% keyword
        const firstResult = fixFirstTenPercent(body, primaryKw);
        if (firstResult.fixed) {
            body = firstResult.text;
            changes.push('Added keyword to first 10% of content');
            totalFirst10Fixed++;
        }
        
        // 8. Add internal links
        const linkResult = addInternalLinks(body, currentSlug, allSlugs);
        if (linkResult.added > 0) {
            body = linkResult.text;
            changes.push(`Added ${linkResult.added} internal links`);
            totalLinksAdded += linkResult.added;
        }
        
        // Write back if changes were made
        if (changes.length > 0) {
            const newContent = rebuildFile(metadata, body, tagLines);
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log(`[FIXED] ${filename}:`);
            changes.forEach(c => console.log(`  ✓ ${c}`));
        } else {
            console.log(`[OK] ${filename}: No fixes needed`);
        }
    });
    
    console.log('\n=== Summary ===');
    console.log(`Banned AI words fixed: ${totalBannedFixed}`);
    console.log(`SEO titles fixed: ${totalSeoTitleFixed}`);
    console.log(`Descriptions fixed: ${totalDescFixed}`);
    console.log(`H1→H2 fixes: ${totalH1Fixed}`);
    console.log(`Image alts fixed: ${totalAltFixed}`);
    console.log(`Subheadings fixed: ${totalSubheadingFixed}`);
    console.log(`First 10% keyword fixes: ${totalFirst10Fixed}`);
    console.log(`Internal links added: ${totalLinksAdded}`);
    console.log(`\nTotal posts processed: ${files.length}`);
}

main();
