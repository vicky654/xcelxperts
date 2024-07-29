import React from "react";
import Wavify from "react-wavify";

interface VerticalProgressBarWithWaveProps {
  percentage: number;  // The percentage to fill the progress bar
  width?: number;      // Optional: width of the progress bar
  height?: number;     // Optional: height of the progress bar
  color?: string;      // Optional: color of the progress bar
}

const VerticalProgressBarWithWave: React.FC<VerticalProgressBarWithWaveProps> = ({
  percentage,
  width = 50,
  height = 300,
  color = "#4caf50", // Default bar and wave color
}) => {
  const containerStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: "#e0e0df", // Background color for the container
    borderRadius: 5,
    overflow: "hidden",
    position: "relative", // For positioning the wave
    display: "flex",
    alignItems: "flex-end", // Align items to the bottom
  };

  const fillerStyle: React.CSSProperties = {
    width: "100%",
    height: `${percentage}%`,
    backgroundColor: color,
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start", // Align wave to the top of the filler
    overflow: "hidden", // Clip wave animation within the filler
  };

  const waveStyle: React.CSSProperties = {
    position: "absolute",
    top: 0, // Position the wave at the top of the filler
    width: "100%",
    height: "100%",
    // opacity: 0.5, // Set wave opacity to differentiate from the bar
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    padding: "5px 0",
    zIndex: 10, // Ensure the label is above the wave
  };
const fillcolor= "#E6AC27"
  return (
    <div style={containerStyle}>
      <div style={fillerStyle}>
        <Wavify
          fill={fillcolor} // Use the same color as the bar
          paused={false}
          options={{
            height: 1, // Increased wave height for visibility
            amplitude: 20, // Increased wave amplitude for more noticeable effect
            speed: 0.15, // Adjust wave speed
            points: 5, // Adjust number of wave points
          }}
          style={waveStyle}
        />
        <span style={labelStyle}>{`${percentage}%`}</span>
      </div>
    </div>
  );
};

export default VerticalProgressBarWithWave;
