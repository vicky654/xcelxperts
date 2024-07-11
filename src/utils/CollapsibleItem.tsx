import React from 'react';
import AnimateHeight from 'react-animate-height';

interface CollapsibleItemProps {
  id: string;
  title: string;
  isActive: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({ id, title, isActive, onToggle, children }) => {
  return (
    <div className="border border-[#d3d3d3] dark:border-[#1b2e4b] rounded">
      <button
        type="button"
        className="p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b]"
        onClick={() => onToggle(id)}
      >
     
        {title}
        <div className="ltr:ml-auto rtl:mr-auto">
       
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
