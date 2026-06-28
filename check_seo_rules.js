const fs = require('fs');
const path = require('path');

const BANNED_AI_WORDS = [
    "delve", "tapestry", "multifaceted", "nuanced", "comprehensive", 
    "in-depth", "robust", "cutting-edge", "leverage", "paramount", 
    "pivotal", "groundbreaking", "revolutionary", "game-changer", 
    "transformative", "furthermore", "moreover", "subsequently", 
    "journey", "unlock", "discover", "explore"
];

function checkPostCompliance(filepath) {
    const filename = path.basename(filepath);
    const content = fs.readFileSync(filepath, 'utf8');
    const parts = content.split("---");
    if (parts.length < 3) {
        return { status: "error", message: "Invalid frontmatter structure." };
    }
    
    const frontmatterStr = parts[1];
    const bodyStr = parts.slice(2).join("---").trim();
    
    // Parse metadata
    const metadata = {};
    frontmatterStr.split("\n").forEach(line => {
        const colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim();
            const val = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
            metadata[key] = val;
        }
    });
    
    const title = metadata.title || "";
    const seoTitle = metadata.seoTitle || title;
    const description = metadata.description || "";
    const slug = metadata.slug || "";
    const focusKw = (metadata.focusKeyword || "").toLowerCase();
    
    const issues = [];
    const warnings = [];
    const successes = [];
    
    // 1. Banned AI Words Audit
    const foundAiWords = [];
    const bodyLower = bodyStr.toLowerCase();
    BANNED_AI_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(bodyLower)) {
            foundAiWords.push(word);
        }
    });
    if (foundAiWords.length > 0) {
        warnings.push(`AI Fingerprints Detected (Banned words): ${foundAiWords.join(', ')}`);
    } else {
        successes.push("No banned AI words detected.");
    }
    
    // 2. Word Count Check
    const wordCount = bodyStr.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 1800) {
        warnings.push(`Post length is ${wordCount} words (RankMath recommends 1,800+ words).`);
    } else {
        successes.push(`Content length is solid (${wordCount} words).`);
    }
    
    // 3. Focus Keyword Checks
    if (focusKw) {
        const keywords = focusKw.split(',').map(k => k.trim()).filter(k => k.length > 0);
        keywords.forEach(kw => {
            if (!seoTitle.toLowerCase().includes(kw)) {
                issues.push(`Focus keyword '${kw}' NOT found in SEO Title.`);
            } else {
                successes.push(`Focus keyword '${kw}' found in SEO Title.`);
            }
            
            if (!description.toLowerCase().includes(kw)) {
                issues.push(`Focus keyword '${kw}' NOT found in Meta Description.`);
            } else {
                successes.push(`Focus keyword '${kw}' found in Meta Description.`);
            }
            
            const slugKw = kw.replace(/\s+/g, '-');
            if (!slug.toLowerCase().includes(slugKw)) {
                warnings.push(`Focus keyword '${kw}' might not be in slug '${slug}'.`);
            } else {
                successes.push(`Focus keyword '${kw}' found in slug.`);
            }
            
            const first10Percent = bodyLower.substring(0, Math.max(200, Math.floor(bodyLower.length * 0.1)));
            if (!first10Percent.includes(kw)) {
                warnings.push(`Focus keyword '${kw}' NOT found in the first 10% of content body.`);
            } else {
                successes.push(`Focus keyword '${kw}' found in first 10% of content.`);
            }
            
            // Subheading keyword check
            let subheadingMatch = false;
            const headingRegex = /^(##|###)\s+(.*?)$/gm;
            let match;
            while ((match = headingRegex.exec(bodyStr)) !== null) {
                if (match[2].toLowerCase().includes(kw)) {
                    subheadingMatch = true;
                    break;
                }
            }
            if (!subheadingMatch) {
                warnings.push(`Focus keyword '${kw}' NOT found in any H2 or H3 subheadings.`);
            } else {
                successes.push(`Focus keyword '${kw}' found in a subheading.`);
            }
            
            // Image alt check
            let altMatch = false;
            const altRegex = /!\[(.*?)\]/g;
            let altMatchArr;
            let hasImages = false;
            while ((altMatchArr = altRegex.exec(bodyStr)) !== null) {
                hasImages = true;
                if (altMatchArr[1].toLowerCase().includes(kw)) {
                    altMatch = true;
                    break;
                }
            }
            if (hasImages) {
                if (!altMatch) {
                    warnings.push(`Focus keyword '${kw}' NOT found in any image alt attributes.`);
                } else {
                    successes.push(`Focus keyword '${kw}' found in at least one image alt attribute.`);
                }
            }
        });
    } else {
        warnings.push("No Focus Keyword defined in post metadata.");
    }
    
    // 4. Heading structures check
    const bodyH1Regex = /^#\s+/gm;
    if (bodyH1Regex.test(bodyStr)) {
        issues.push("Found H1 tag (#) inside the post body. Heading hierarchy should start at H2 (##) in markdown body.");
    }
    
    return {
        status: "success",
        title,
        slug,
        wordCount,
        issues,
        warnings,
        successes
    };
}

function main() {
    const postsDir = "content/posts";
    if (!fs.existsSync(postsDir)) {
        console.error(`Error: Directory '${postsDir}' does not exist. Run parse_wp_db.js first.`);
        process.exit(1);
    }
    
    const posts = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
    console.log(`Auditing ${posts.length} posts against RacketEdge SEO rules...\n`);
    
    let totalIssues = 0;
    let totalWarnings = 0;
    
    posts.forEach(filename => {
        const filepath = path.join(postsDir, filename);
        const report = checkPostCompliance(filepath);
        
        if (report.status === "error") {
            console.log(`[-] ${filename}: ${report.message}`);
            return;
        }
        
        console.log(`==================================================`);
        console.log(`POST: ${report.title} (${filename})`);
        console.log(`Word Count: ${report.wordCount} words`);
        console.log(`==================================================`);
        
        if (report.issues.length > 0) {
            console.log("🛑 ISSUES (Must fix):");
            report.issues.forEach(issue => {
                console.log(`  - ${issue}`);
                totalIssues++;
            });
        }
        
        if (report.warnings.length > 0) {
            console.log("⚠️ WARNINGS (Review):");
            report.warnings.forEach(warning => {
                console.log(`  - ${warning}`);
                totalWarnings++;
            });
        }
        
        if (report.issues.length === 0 && report.warnings.length === 0) {
            console.log("✅ 100% compliant with SEO, AEO & GEO guidelines!");
        }
        console.log();
    });
    
    console.log("--------------------------------------------------");
    console.log(`Audit Summary: Found ${totalIssues} issues and ${totalWarnings} warnings across ${posts.length} posts.`);
    console.log("--------------------------------------------------");
}

main();
