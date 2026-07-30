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

function countDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory()).length;
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
  const dirs = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

  const posts = [];
  for (const dir of dirs) {
    const indexPath = path.join(blogDir, dir, "index.md");
    if (!fs.existsSync(indexPath)) continue;
    const content = fs.readFileSync(indexPath, "utf-8");
    const fm = parseFrontmatter(content);
    if (!fm.title || !fm.date) continue;

    // 查找博客目录内的第一张图片作为封面，复制到 static 目录
    let cover = "";
    const dirPath = path.join(blogDir, dir);
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

  // 按日期倒序排列，取最近 3 篇
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts.slice(0, 3);
}

const root = path.resolve(__dirname, "..");

const stats = {
  articles: countDirs(path.join(root, "blog")),
  prompts: countPromptEntries(path.join(root, "docs", "prompt")),
  skills: countSkillEntries(path.join(root, "docs", "skills")),
};

const recentPosts = parseBlogPosts(path.join(root, "blog"));

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
