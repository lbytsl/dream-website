const fs = require("fs");
const path = require("path");

function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(fullPath, ext);
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      count++;
    }
  }
  return count;
}

// Prompt 目录还包含总入口和分类入口，它们不是独立提示词。
// 真正的提示词采用 docs/prompt/{分类}/{提示词}/index.mdx 结构。
function countPromptEntries(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name === "index.mdx") {
        const relativeParts = path.relative(dir, fullPath).split(path.sep);
        if (relativeParts.length >= 3) count++;
      }
    }
  }

  walk(dir);
  return count;
}

function countSkillEntries(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        const frontmatter = parseFrontmatter(fs.readFileSync(fullPath, "utf-8"));
        if (frontmatter.skill === "true") count++;
      }
    }
  }

  walk(dir);
  return count;
}

// 系列文章允许嵌套目录；只收集正文，资源文件夹不计为文章。
function collectBlogFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectBlogFiles(fullPath);
    return /\.mdx?$/.test(entry.name) ? [fullPath] : [];
  });
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = "";
  for (const line of lines) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)/);
    if (kv) {
      currentKey = kv[1];
      const val = kv[2].trim();
      if (val.startsWith("[") && val.endsWith("]")) {
        fm[currentKey] = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""));
      } else if (val.match(/^\d+$/)) {
        fm[currentKey] = parseInt(val, 10);
      } else {
        fm[currentKey] = val;
      }
    }
  }
  return fm;
}

function parseBlogPosts(blogDir) {
  if (!fs.existsSync(blogDir)) return [];
  const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

  const posts = [];
  for (const indexPath of collectBlogFiles(blogDir)) {
    const dirPath = path.dirname(indexPath);
    const dir = path.relative(blogDir, dirPath).split(path.sep).join("-");
    const content = fs.readFileSync(indexPath, "utf-8");
    const fm = parseFrontmatter(content);
    if (!fm.title || !fm.date || fm.draft === "true") continue;

    // 查找博客目录内的第一张图片作为封面，复制到 static 目录
    let cover = "";
    const files = fs.readdirSync(dirPath);
    const coversDir = path.join(root, "static", "img", "blog-covers");
    for (const f of files) {
      if (IMAGE_EXTS.some((ext) => f.toLowerCase().endsWith(ext))) {
        if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });
        const srcImg = path.join(dirPath, f);
        const ext = path.extname(f);
        const coverName = `${dir}-cover${ext}`;
        const dstImg = path.join(coversDir, coverName);
        fs.copyFileSync(srcImg, dstImg);
        cover = `/img/blog-covers/${coverName}`;
        break;
      }
    }

    posts.push({
      title: fm.title,
      date: fm.date,
      slug: fm.slug || dir,
      tags: fm.tags || [],
      description: fm.description || "",
      cover,
    });
  }

  // 保留完整文章数，再由首页取最近三篇。
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

const root = path.resolve(__dirname, "..");
const blogPosts = parseBlogPosts(path.join(root, "blog"));

const stats = {
  articles: blogPosts.length,
  prompts: countPromptEntries(path.join(root, "docs", "prompt")),
  skills: countSkillEntries(path.join(root, "docs", "skills")),
};

const recentPosts = blogPosts.slice(0, 3);

const outDir = path.join(root, "src", "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "stats.json"),
  JSON.stringify(stats, null, 2) + "\n"
);

fs.writeFileSync(
  path.join(outDir, "recent-posts.json"),
  JSON.stringify(recentPosts, null, 2) + "\n"
);

console.log("Stats:", stats);
console.log("Recent posts:", recentPosts.length);
