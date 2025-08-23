import React from "react";

type Props = { children: React.ReactNode };

const layout = (props: Props) => {
  return <div className="pt-10  min-h-screen flex items-center justify-center">{props.children}</div>;
};

export default layout;
