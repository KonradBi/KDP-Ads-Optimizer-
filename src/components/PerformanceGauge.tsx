import React from 'react';

interface PerformanceGaugeProps {
  value: number;
  min?: number;
  max?: number;
  thresholds?: [number, number]; // [warning, success]
  unit?: string;
  label?: string;
}

const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({
  value,
  min = 0,
  max = 3, // Default max for ROAS, adjust as needed
  thresholds = [1, 2], // Default thresholds for ROAS [bad/warning, warning/good]
  unit = 'x',
  label = 'Effective ROAS',
}) => {
  const [warnThreshold, successThreshold] = thresholds;

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  let valueColorClass = 'text-green-400';
  let barBgClass = 'bg-green-500';
  let descriptor = 'Good';

  if (value < warnThreshold) {
    valueColorClass = 'text-red-400';
    barBgClass = 'bg-red-500';
    descriptor = 'Poor';
  } else if (value < successThreshold) {
    valueColorClass = 'text-yellow-400';
    barBgClass = 'bg-yellow-500';
    descriptor = 'Okay';
  }

  const filledBarStyle = {
    width: `${percentage}%`,
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        {label && <span className="text-sm font-medium text-slate-400">{label}</span>}
        <div className="text-right">
            <span className={`text-lg font-bold ${valueColorClass}`}>{value.toFixed(2)}{unit}</span>
            <span className={`block text-xs font-medium ${valueColorClass}`}>{descriptor}</span>
        </div>
      </div>
      {/* Bar Container */}
      <div className="relative w-full h-2 bg-slate-600 rounded-full overflow-hidden">
         {/* Filled Portion */}
         <div 
           className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${barBgClass}`}
           style={filledBarStyle}
         >
         </div>
      </div>
      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}+</span>
      </div>
    </div>
  );
};

export default PerformanceGauge; 