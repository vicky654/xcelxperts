// Loader.tsx
import React from 'react';

const loaderStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  display: 'block',
  margin: '15px auto',
  position: 'relative',
  background: '#FFF',
  boxShadow: '-24px 0 #FFF, 24px 0 #FFF',
  boxSizing: 'border-box',
  animation: 'shadowPulse 2s linear infinite',
};

const keyframes = `
@keyframes shadowPulse {
  33% {
    background: #FFF;
    box-shadow: -24px 0 #3b3f5c, 24px 0 #FFF;
  }
  66% {
    background: #3b3f5c;
    box-shadow: -24px 0 #FFF, 24px 0 #FFF;
  }
  100% {
    background: #FFF;
    box-shadow: -24px 0 #FFF, 24px 0 #3b3f5c;
  }
}`;

const SmallLoader: React.FC = () => {
  return (
    <>
      <style>
        {keyframes}
      </style>
      <span style={loaderStyle}></span>
    </>
  );
};

export default SmallLoader;
