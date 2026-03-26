/// <reference types="vite/client" />

export {};

type SketchLoader = () => Promise<unknown>;

const allModules = import.meta.glob<SketchLoader>([
  "./sketches/**/*.ts",
  "./doodles/**/*.ts",
  "./archive/**/*.ts",
]);

const EXCLUDE = new Set(["palettes", "utils", "base", "template"]);

const sketches = Object.fromEntries(
  Object.entries(allModules)
    .filter(([path]) => {
      const name = path.split("/").pop()!.replace(".ts", "");
      return !EXCLUDE.has(name);
    })
    .map(([path, mod]) => [path.replace(/^\.\//, "").replace(/\.ts$/, ""), mod]),
);

const params = new URLSearchParams(location.search);
const sketchParam = params.get("s");

if (sketchParam && sketches[sketchParam]) {
  document.body.classList.add("sketch");

  await sketches[sketchParam]();

  const back = document.createElement("a");
  back.href = "/";
  back.textContent = "← back";
  back.className = "back-link";
  document.body.appendChild(back);
} else {
  renderPicker();
}

function renderPicker() {
  const groups = new Map<string, string[]>();

  for (const path of Object.keys(sketches)) {
    const parts = path.split("/");
    const name = parts.pop()!;
    const dir = parts.join("/");
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir)!.push(name);
  }

  const sorted = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));

  const groups_html = sorted
    .map(([dir, names]) => {
      const label = formatGroupLabel(dir);
      const links = names
        .slice()
        .sort()
        .map((n) => `<a href="/?s=${dir}/${n}">${n}</a>`)
        .join("");
      return `<div class="group">
        <div class="group-label">${label}</div>
        <div class="items">${links}</div>
      </div>`;
    })
    .join("");

  document.body.innerHTML = `<h1>generative processing</h1>${groups_html}`;
}

function formatGroupLabel(dir: string): string {
  // sketches/v1/circleseed → v1 / <span>circleseed</span>
  // doodles → <span>doodles</span>
  // archive/article → archive / <span>article</span>
  const parts = dir.replace(/^sketches\//, "").split("/");
  if (parts.length === 1) return `<span>${parts[0]}</span>`;
  const prefix = parts.slice(0, -1).join(" / ");
  const last = parts[parts.length - 1];
  return `${prefix} / <span>${last}</span>`;
}
