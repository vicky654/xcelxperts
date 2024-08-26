import React from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import CountUp from "react-countup";
import Wavify from "react-wavify";
import IconRefresh from "../../components/Icon/IconRefresh";
import { curryGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import { capacity, currency } from "../../utils/CommonData";

interface VerticalProgressBarWithWaveProps {
  percentage: number; // The percentage to fill the progress bar
  alert: any; // Alert data for display
  width?: number; // Optional: width of the progress bar
  height?: number; // Optional: height of the progress bar
  color?: string; // Optional: color of the progress bar
}

const VerticalProgressBarWithWave: React.FC<VerticalProgressBarWithWaveProps> = ({
  percentage,
  alert,
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
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    padding: "5px 0",
    zIndex: 10, // Ensure the label is above the wave
  };
  const d: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    padding: "5px 0",
    zIndex: 10, // Ensure the label is above the wave
  };
  const PercentagelabelStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    padding: "5px 0",
    zIndex: 10, // Ensure the label is above the wave
  };

  // Define the style for the alert details
  const detailsStyle: React.CSSProperties = {
    marginTop: "10px", // Space between the progress bar and the details
    textAlign: "left",
    fontSize: "14px",
    lineHeight: "1.5",
    listStyle: "none",
    padding: 0,
  };

  // Tooltip styles
  const tooltipStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    // cursor: "pointer",
  };

  const tooltipTextStyle: React.CSSProperties = {
    visibility: "hidden",
    width: "120px",
    backgroundColor: "#555",
    color: "#fff",
    textAlign: "center",
    borderRadius: "6px",
    padding: "5px",
    position: "absolute",
    zIndex: 1,
    bottom: "125%",
    left: "50%",
    marginLeft: "-60px",
    opacity: 0,
    transition: "opacity 0.3s",
  };

  // Hover effect for tooltip
  const showTooltipStyle: React.CSSProperties = {
    visibility: "visible",
    opacity: 1,
  };


  return (
    <div  className="columncenter">
      <div style={containerStyle}>
        <div style={fillerStyle}>
          <Wavify
            fill={alert?.bg_color} // Use the same color as the bar
            paused={false}
            options={{
              height: 1, // Increased wave height for visibility
              amplitude: 20, // Increased wave amplitude for more noticeable effect
              speed: 0.15, // Adjust wave speed
              points: 5, // Adjust number of wave points
            }}
            style={waveStyle}
          />
      
        </div>
        <span style={PercentagelabelStyle}>
          <CountUp
              end={percentage}
              separator=","
              start={0}
              duration={1.94}
            />

            %
          </span>
      </div>
      <ul style={detailsStyle}>

        <li style={{ ...tooltipStyle, display: "flex", justifyContent: "space-start", alignItems: "center" }}>
          <strong className="ms-2 mr-1">Capacity:</strong>

          <OverlayTrigger
            placement="top" 
            delay={{ show: 250, hide: 400 }} // Optional delay settings
            overlay={
              <Tooltip className="custom-tooltip"> {/* Optional custom class for styling */}
              Avg Sale:  {capacity} {alert?.average_sale}  {/* Tooltip content */}
              </Tooltip>
            }
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>
             {capacity}  <CountUp
                end={alert?.capacity || 0} // Use default value if capacity is undefined
                separator=","
                start={0}
                duration={2.94}
              />
              {/* <IconRefresh className="w-6 h-6" /> */}
              <i style={{ fontWeight: "bold" }} className="fi fi-br-info"></i>


              {/* <FontAwesomeIcon icon={faInfoCircle} style={iconStyle} /> */}
            </span>
          </OverlayTrigger>

          <span style={tooltipTextStyle} className="tooltip-text">Total tank capacity</span>
        </li>
        <li style={{ ...tooltipStyle, display: "flex", justifyContent: "space-start", alignItems: "center" }}>
          <strong className="ms-2 mr-1">Usage:</strong> {capacity}  <CountUp
            end= {alert?.ullage}
            separator=","
            start={0}
            duration={1.94}
          />
          <span style={tooltipTextStyle} className="tooltip-text">Empty space in the tank</span>
        </li>
        <li style={{ ...tooltipStyle, display: "flex", justifyContent: "space-start", alignItems: "center" }}>
          <strong className="ms-2 mr-1">Fuel Left:</strong>

         {capacity}  <CountUp
            end={alert?.fuel_left}
            separator=","
            start={0}
            duration={1.94}
          />
          <span
            style={{
              backgroundColor: alert?.bg_color,
              padding: "4px",
              marginLeft: "10px",
              borderRadius: `4px`, // Use template literals to include bg_color
            }}
          >
            {alert?.days_left} Days
          </span>



          <span style={tooltipTextStyle} className="tooltip-text">Fuel remaining in the tank</span>
        </li>
        <li style={{ ...tooltipStyle, display: "flex", justifyContent: "space-start", alignItems: "center" }}>
          <strong className="ms-2 mr-1">Usage Percentage:</strong>

          <CountUp
            end={alert?.ullage_percentage}
            separator=","
            start={0}
            duration={1.94}
          />
          %
          <span style={tooltipTextStyle} className="tooltip-text">Percentage of empty space</span>
        </li>
      </ul>
    </div >
  );
};

export default VerticalProgressBarWithWave;
