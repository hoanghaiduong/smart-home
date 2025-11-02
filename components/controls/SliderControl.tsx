import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  // We will use a CSS variable to handle the gradient background for both themes
  const backgroundStyle = { '--track-percentage': `${percentage}%` } as React.CSSProperties;

  return (
    <div className="space-y-2 pt-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-semibold text-sky-600 dark:text-sky-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={backgroundStyle}
      />
      <style>{`
        .slider-thumb {
          background: linear-gradient(to right, #0ea5e9 var(--track-percentage), #64748b80 var(--track-percentage));
        }
        .dark .slider-thumb {
          background: linear-gradient(to right, #38bdf8 var(--track-percentage), #334155 var(--track-percentage));
        }

        .slider-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            border: 3px solid #0ea5e9;
            cursor: pointer;
            transition: all 0.2s;
        }
        .dark .slider-thumb::-webkit-slider-thumb {
             border-color: #38bdf8;
        }

        .slider-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            border: 3px solid #0ea5e9;
            cursor: pointer;
            transition: all 0.2s;
        }
        .dark .slider-thumb::-moz-range-thumb {
             border-color: #38bdf8;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 0 10px #38bdf8;
        }
        .slider-thumb::-moz-range-thumb:hover {
             transform: scale(1.1);
            box-shadow: 0 0 10px #38bdf8;
        }
      `}</style>
    </div>
  );
};