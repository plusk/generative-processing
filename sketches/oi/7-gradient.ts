import p5 from "p5";

new p5((p: p5) => {
  let COLORS: any;

  const STROKE_WEIGHT = 3;
  const PADDING = 216;
  const SHAPE_COUNT = 7;

  const PALETTE = {
    bg: ["#ff7b7b"],
    colors: [
      "#A1F5E3",
      "#E7E7E7",
      "#FFFFFF",
      "#0e0e0e",
      "#0e0e0e",
      "#0e0e0e",
      "#0e0e0e",
      "#0e0e0e",
    ],
  };

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);

    COLORS = PALETTE.colors;

    (p as any).angleMode((p as any).DEGREES);
    p.frameRate(1);

    p.strokeWeight(STROKE_WEIGHT);
  };

  p.draw = () => {
    drawGradientBackground();

    const Y_STEP = (p.height - PADDING * 2) / (SHAPE_COUNT - 1);
    const X_STEP = (p.width - PADDING * 2) / (SHAPE_COUNT - 1);

    let row = 1;
    for (let y = PADDING; y <= p.height - PADDING; y += Y_STEP) {
      let col = 1;
      for (let x = PADDING; x <= p.width - PADDING; x += X_STEP) {
        p.push();
        p.translate(x, y);
        p.rotate(-90);
        polygon(0, 0, 37.5, col + 1, row);
        p.pop();
        col++;
      }
      row++;
    }
  };

  const polygon = (x: number, y: number, radius: number, count: number, row: number) => {
    const vertices: any[] = [];
    for (let angle = 0; angle < 360; angle += 360 / count) {
      vertices.push({
        x: x + p.cos(angle) * radius,
        y: y + p.sin(angle) * radius,
      });
    }

    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      p.stroke(p.random(COLORS));
      if (i === 0) {
        drawOrDont(v, vertices[vertices.length - 1], row);
        drawOrDont(v, { x, y }, row);
        drawOrDont(v, vertices[i + 1], row);
      } else if (i === vertices.length - 1) {
        drawOrDont(v, vertices[i - 1], row);
        drawOrDont(v, { x, y }, row);
        drawOrDont(v, vertices[0], row);
      } else {
        drawOrDont(v, vertices[i - 1], row);
        drawOrDont(v, { x, y }, row);
        drawOrDont(v, vertices[i + 1], row);
      }
    }
  };

  const drawOrDont = (v1: any, v2: any, row: number) => {
    const randy = 0.5 * (p as any).exp(row - 1);
    if (p.random() < 0.5) {
      p.line(
        v1.x + p.random(-randy, randy),
        v1.y + p.random(-randy, randy),
        v2.x + p.random(-randy, randy),
        v2.y + p.random(-randy, randy),
      );
      p.strokeWeight(STROKE_WEIGHT * 3);
      p.point(v1.x + p.random(-randy, randy), v1.y + p.random(-randy, randy));
      p.point(v2.x + p.random(-randy, randy), v2.y + p.random(-randy, randy));
      p.strokeWeight(STROKE_WEIGHT);
    }
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };

  const drawGradientBackground = () => {
    const colorTop = p.color("#FF9999");
    const colorBot = p.color("#FF5B5B");
    p.strokeWeight(1);
    for (let y = 0; y < p.height; y++) {
      const fraction = y / p.height;
      const colorHere = p.lerpColor(colorTop, colorBot, fraction);
      p.stroke(colorHere);
      p.line(0, y, p.width, y);
    }
    p.strokeWeight(STROKE_WEIGHT);
  };
});
