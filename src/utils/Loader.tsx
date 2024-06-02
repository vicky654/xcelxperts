import React from "react";

import { Card, Collapse } from "react-bootstrap";

const LoaderImg = () => {
  const [expanded, setExpanded] = React.useState(true);


  return (


    <div id="global-loader" className="main-content">
      <div className="fullscreen">
        <div>
          <span className="animate-[spin_3s_linear_infinite] border-8 border-r-warning border-l-primary border-t-danger border-b-success rounded-full w-14 h-14 inline-block align-middle m-auto mb-10" style={{ borderColor: '#084a9e #ec6c21 #cfb40b #084a9e' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoaderImg;
