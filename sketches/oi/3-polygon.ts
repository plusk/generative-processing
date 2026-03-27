import p5 from "p5";

new p5((p: p5) => {
  const STROKE_WEIGHT = 3;
  const PADDING = 216;
  const SHAPE_COUNT = 7;

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);

    (p as any).angleMode((p as any).DEGREES);

    p.strokeWeight(STROKE_WEIGHT);
  };

  p.draw = () => {
    p.background(p.color("#ff7b7b"));

    const Y_STEP = (p.height - PADDING * 2) / (SHAPE_COUNT - 1);
    const X_STEP = (p.width - PADDING * 2) / (SHAPE_COUNT - 1);

    for (let y = PADDING; y <= p.height - PADDING; y += Y_STEP) {
      let col = 1;
      for (let x = PADDING; x <= p.width - PADDING; x += X_STEP) {
        p.push();
        p.translate(x, y);
        p.rotate(-90);
        polygon(0, 0, 37.5, col + 1);
        p.pop();
        col++;
      }
    }
  };

  const polygon = (x: number, y: number, radius: number, count: number) => {
    const vertices: any[] = [];
    for (let angle = 0; angle < 360; angle += 360 / count) {
      vertices.push({
        x: x + p.cos(angle) * radius,
        y: y + p.sin(angle) * radius,
      });
    }

    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      if (i === vertices.length - 1) {
        drawEdges(v, vertices[0]);
      } else {
        drawEdges(v, vertices[i + 1]);
      }
    }
  };

  const drawEdges = (v1: any, v2: any) => {
    p.line(v1.x, v1.y, v2.x, v2.y);
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
