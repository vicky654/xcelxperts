import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

interface DropdownActionProps {
    row: any; // Define row type as per your use case
    isEditPermissionAvailable: boolean;
    isDeletePermissionAvailable: boolean;
    isAddonPermissionAvailable: boolean;
    EditUser: (row: any) => void;
    handleDelete: (id: string) => void;
}

const DropdownAction: React.FC<DropdownActionProps> = ({
    row,
    isEditPermissionAvailable,
    isDeletePermissionAvailable,
    isAddonPermissionAvailable,
    EditUser,
    handleDelete,
}) => {
    return (
        <Dropdown className="dropdown btn-group">
            <Dropdown.Toggle variant="Primary" type="button" className=" d-flex action-extra-down-hide">
                <span className=" action-drop-icon">
                    <i className="fa fa-ellipsis-h three-dot-icon" aria-hidden="true"></i>
                </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu">
                {isEditPermissionAvailable && (
                    <Dropdown.Item className="dropdown-item dropdown-background">
                        <div onClick={() => EditUser(row)}>
                            <div style={{ width: '100%' }}>
                                <div className="action-edit-button">
                                    <span>
                                        <i className="setting-icon fi fi-rr-file-edit"></i> Edit
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Dropdown.Item>
                )}
                {isDeletePermissionAvailable && (
                    <Dropdown.Item className="dropdown-item dropdown-background-delete">
                        <Link to="#" onClick={() => handleDelete(row.id)}>
                            <div style={{ width: '100%' }}>
                                <div className="action-delete-button">
                                    <span>
                                        <i className="fi fi-rr-trash-xmark"></i> Delete
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </Dropdown.Item>
                )}
                {isAddonPermissionAvailable && (
                    <Dropdown.Item className="dropdown-item dropdown-background-other">
                        <Link to={`/assign-client-addon/${row.id}`}>
                            <span>
                                <i className="fi fi-rs-user"></i> Assign Addon
                            </span>
                        </Link>
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default DropdownAction;
