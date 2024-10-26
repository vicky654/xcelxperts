import React from "react";
import './SalaryCard.css'; // Assuming you want to keep styles separate
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { currency } from "../../../utils/CommonData";



const SalaryCard: React.FC<any> = ({
    name, phone, shift, salary, debit, credit, payable, payableInfo
}) => {
    return (
        <div className="salary-card" style={{borderRadius:"0px"}}>
            <div className="card-header">
                <h2 className="flexstart font-bold ">   {name}</h2>
                <span className="spacebetween">
                    <p> <strong>Phone:</strong> {phone}</p>
                    <p>   <strong>Shift:</strong>{shift}</p>
                </span>
            </div>
            <div className="card-body">
                <div className="spacebetween">

                    <p><strong>Salary:</strong> {currency}{salary}</p>
                    <p><strong>Debit:</strong> {currency}{debit}</p>

                    <p><strong>Credit:</strong>     {currency}{credit}</p>
                    <p><strong>Payable:
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip className='ModalTooltip p-3' id="tooltip-amount" style={{ lineHeight: "30px" }}>
                                    {payableInfo}
                                </Tooltip>
                            }
                        >
                            <span className=''> <i style={{ lineHeight: "10px", fontSize: "15px" }} className="fi fi-tr-comment-info"></i></span>
                        </OverlayTrigger>

                    </strong> {currency}{payable}</p>

                </div>

            </div>
        </div>
    );
};

export default SalaryCard;
