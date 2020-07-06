let palettes;
let cnv;

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);
  background(random(palettes["parchment"]["colors"]));
}

function draw() {}

function clickOnSave() {
  //saveCanvas();
}
