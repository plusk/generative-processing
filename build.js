const fs = require("fs");
const data = require("./data.js");
const path = require("path");

const dir = "./dist";

const template = (sketch) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${sketch.title}</title>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.js"></script>
    <style>
      body {
        display: grid;
        place-items: center;
        height: 100vh;
        margin: 0;
        background: black;
      }
      ${sketch.dynamic ? "" : `
      @media (orientation: landscape) {
        canvas {
          width: initial !important;
          height: 100vh !important;
        }
      }
      @media (orientation: portrait) {
        canvas {
          width: 100vw !important;
          height: initial !important;
        }
      }
      `}
    </style>
    <script src="/${sketch.path}"></script>
  </head>
  <body></body>
</html>
`;

const pathToHtmlPath = (filePath) =>
  path.join(
    path.dirname(filePath),
    path.basename(filePath, path.extname(filePath)) + ".html"
  );

data.map((entry) => {
  console.log(`Building ${entry.title}`);

  const filePath = `${dir}/${entry.path}`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.copyFileSync(`./${entry.path}`, filePath);

  const finalFilePath = pathToHtmlPath(filePath);

  fs.writeFileSync(finalFilePath, template(entry), function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
});

console.log("Copying style files");
fs.copyFileSync("reset.css", "dist/reset.css");
fs.copyFileSync("style.css", "dist/style.css");

const frontpageTemplate = (entries) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generative Processing</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat&family=Open+Sans&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="reset.css" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main>
      ${entries
        .map(
          (entry) => entry.ignore ? "" : `
        <a class="sketch-entrance" href="/${pathToHtmlPath(entry.path)}">
          <div>${entry.title}</div>
          <img src=${entry.img} alt=${entry.title} />
        </a>
        `
        )
        .join("")}
    </main>
    <footer>
      <a href="https://www.instagram.com/anders.larsen.96/"
        ><img
          src="https://res.cloudinary.com/plusk/image/upload/v1604152555/instagram_r6guib.svg"
          alt="Instagram"
      /></a>
      <a href="https://github.com/plusk"
        ><img
          src="https://res.cloudinary.com/plusk/image/upload/v1604152555/github_avgksu.svg"
          alt="GitHub"
      /></a>
    </footer>
  </body>
</html>
`;

console.log("Writing index.html");

fs.writeFileSync(`${dir}/index.html`, frontpageTemplate(data), function (err) {
  if (err) throw err;
  console.log("Generated index");
});

fs.copyFileSync("palettes.json", "dist/palettes.json");
