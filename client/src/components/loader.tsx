import React from "react";
import { PropagateLoader } from "react-spinners";

const BtnLoader = () => {
  return (
    <PropagateLoader
      color="#ffffff"
      size={5}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default BtnLoader;
