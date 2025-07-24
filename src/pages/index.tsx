import React from "react";
import Home from "../components/Home";

const IndexPage = ({ theme }: { theme: string }) => {
  return <Home theme={theme} />;
};

export default IndexPage;