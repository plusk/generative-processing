import React, { useEffect } from "react";
import styled from "styled-components";
import drawSketch from "../sketches/blobs.js";

type SketchProps = {
  title: string;
  description: string;
};

const Page = styled.main`
  display: flex;
  justify-content: center;
  padding: 5rem;
  gap: 2rem;
  height: 100vh;

  canvas {
    width: initial !important;
    height: calc(100vh - 10rem) !important;
  }
`;

const Info = styled.div`
  max-width: 40rem;

  h1 {
    margin-bottom: 3rem;
  }
`;

const Sketch = ({ title, description }: SketchProps) => {
  useEffect(() => {
    const container = document.querySelector("canvas");
    container && container.remove();
    drawSketch();
  }, []);

  return (
    <Page>
      <Info>
        <h1>{title}</h1>
        <p>{description}</p>
      </Info>
    </Page>
  );
};

export default Sketch;
