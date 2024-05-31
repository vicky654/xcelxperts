import React from 'react';
import './Tube.css';

import Wavify from 'react-wavify';
interface TubeProps {
  value: number;
}

const Tube: React.FC<TubeProps> = ({ value }) => {
  return (
    <div className="tube-container">
      <div className="tube">
        <div className="fill" style={{ height: `${value}%` }}>
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
      </div>
    </div>
  );
};

export default Tube;
