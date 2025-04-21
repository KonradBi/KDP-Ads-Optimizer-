import React, { useState, useRef, useCallback, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';

// --- REVAMPED TOOLTIP COMPONENT USING PORTAL & JS POSITIONING --- 
interface TooltipProps {
  text: string;
  children: React.ReactElement; // Expect a single element child to attach refs and listeners
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const portalRootRef = useRef<HTMLElement | null>(null);
  const tooltipId = useId(); // Call useId unconditionally at the top level

  useEffect(() => {
    // Ensure portal root exists only on client-side
    portalRootRef.current = document.getElementById('tooltip-portal-root');
    if (!portalRootRef.current) {
      portalRootRef.current = document.createElement('div');
      portalRootRef.current.id = 'tooltip-portal-root';
      document.body.appendChild(portalRootRef.current);
    }
    // Cleanup portal root on component unmount
    return () => {
       if (portalRootRef.current && portalRootRef.current.parentElement === document.body && portalRootRef.current.childElementCount === 0) {
          // Only remove if it was created by this instance and is empty
          // This simple check might not be sufficient in complex scenarios
          // document.body.removeChild(portalRootRef.current); 
          // ^-- Commenting out removal for now to avoid race conditions if multiple tooltips unmount
       }
    };
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = triggerRect.top - tooltipRect.height - 8;
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8;
    
    if (top < 8) {
        top = triggerRect.bottom + 8;
    }

    setPosition({ top, left });
  }, []);

  const showTooltip = useCallback(() => {
    setIsVisible(true);
    requestAnimationFrame(calculatePosition);
  }, [calculatePosition]);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
  }, []);

  const tooltipContent = (
    <div
      ref={tooltipRef}
      id={tooltipId} // Add id to the tooltip content for aria-describedby
      className={`fixed z-50 w-max max-w-xs px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg transition-opacity duration-300 pointer-events-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      role="tooltip"
    >
      {text}
      {/* Arrow: position needs adjustment based on potential flipping */}
       <div className="absolute left-1/2 top-full -mt-1 w-3 h-3 bg-gray-900 transform -translate-x-1/2 rotate-45"></div>
    </div>
  );

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
        aria-describedby={isVisible ? tooltipId : undefined} // Use the generated id conditionally
      >
        {children}
      </span>
      {portalRootRef.current && isVisible ? ReactDOM.createPortal(tooltipContent, portalRootRef.current) : null}
    </>
  );
};

// --- END REVAMPED TOOLTIP --- 

export default Tooltip; 