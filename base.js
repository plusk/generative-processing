let cnv;

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);
}

function draw() {}

function clickOnSave() {
  saveCanvas();
}
