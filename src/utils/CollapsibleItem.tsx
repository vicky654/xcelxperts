import React from 'react';
import AnimateHeight from 'react-animate-height';
import IconCaretDown from '../components/Icon/IconCaretDown';
import { currency } from './CommonData';

interface CollapsibleItemProps {
  id: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({ id, title, subtitle, isActive, onToggle, children }) => {
  return (
    <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded mt-4  " style={{border:"1px solid #ddd"}}>
      <button
        type="button"
        className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${isActive ? '!text-primary bg-[#e5e7eb]' : ''}`}

        onClick={() => onToggle(id)}
      >


        {title} {" "} - {currency}     {subtitle}<br></br>

        <div className={`ltr:ml-auto rtl:mr-auto ${isActive ? 'rotate-180' : ''}`}>
          <IconCaretDown />
        </div>


      </button>
      <div>
        <AnimateHeight duration={300} height={isActive ? 'auto' : 0}>
          <div className="p-4 text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
            {children}
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
};

export default CollapsibleItem;
