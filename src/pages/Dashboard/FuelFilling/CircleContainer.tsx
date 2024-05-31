import React from 'react';
import Wavify from 'react-wavify';
import './CircleContainer.css';

interface CircleContainerProps {
  value: number;
}

const CircleContainer: React.FC<CircleContainerProps> = ({ value }) => {
  return (
    <div className="circle-container">
      <div className="circle">
        <div className="wave"></div>
      </div>
      <div className="desc">
        <h2>Today</h2>
        <p><b>{value}<span>%</span></b></p>
      </div>
      <Wavify className="custom-class-name" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        options={{
          height: 30,
          amplitude: 40,
          speed: 0.2,
          // color: 'rgba(0, 0, 255, 0.1)',
          points: 3
        }}
      />
    </div>
  );
};

export default CircleContainer;
