import React, { forwardRef } from 'react';

interface CustomSwitchProps {
    checked: boolean;
    onChange: () => void;
}

const CustomSwitch = forwardRef<HTMLInputElement, CustomSwitchProps>(({ checked, onChange }, ref) => (
    <div className="mt-2">
        <label className="w-12 h-6 relative">
            <input
                type="checkbox"
                className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                checked={checked}
                onChange={onChange}
                ref={ref}
            />
            <span className={`outline_checkbox block h-full rounded-full transition-all duration-300 ${checked ? 'bg-primary border-primary' : 'bg-[#9ca3af] border-[#9ca3af]'}`}>
                <span className={`absolute bottom-1 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${checked ? 'bg-white left-7' : 'bg-white left-1'}`}>
                    {checked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8f95a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    )}
                </span>
            </span>
        </label>
    </div>
));

export default CustomSwitch;
