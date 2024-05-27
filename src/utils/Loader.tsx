import React from "react";

import { Card, Collapse } from "react-bootstrap";

const Loaderimg = () => {
  const [expanded, setExpanded] = React.useState(true);


  return (
    <div id="global-loader">
      <div className="fullscreen">
        <Card className="card card-none">
          <Collapse in={expanded}  timeout={500}>
            <div className="card-body ">
              <div className="dimmer active">
                <span className="loader"></span>
              </div>
            </div>
          </Collapse>
        </Card>
      </div>
    </div>
  );
};

export default Loaderimg;
