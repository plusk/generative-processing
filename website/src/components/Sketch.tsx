import React from "react";
import styled from "styled-components";

type SketchProps = {
  title: string;
  description: string;
};

const Container = styled.main`
  padding: 10rem;

  h1 {
    margin-bottom: 3rem;
  }

  p {
    max-width: 40rem;
  }
`;

const Sketch = ({ title, description }: SketchProps) => {
  return (
    <Container>
      <h1>{title}</h1>
      <p>{description}</p>
    </Container>
  );
};

export default Sketch;
