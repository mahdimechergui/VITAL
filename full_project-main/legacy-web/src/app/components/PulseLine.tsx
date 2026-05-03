import { motion } from "motion/react";

interface PulseLineProps {
  health: number; // 0-100
  className?: string;
}

export function PulseLine({ health, className = "" }: PulseLineProps) {
  const getColor = () => {
    if (health >= 80) return "#06b6d4"; // cyan
    if (health >= 50) return "#a855f7"; // purple
    return "#ec4899"; // pink
  };

  const pulsePoints = [
    { x: 0, y: 50 },
    { x: 10, y: 50 },
    { x: 15, y: 30 },
    { x: 20, y: 70 },
    { x: 25, y: 20 },
    { x: 30, y: 50 },
    { x: 90, y: 50 },
    { x: 95, y: 30 },
    { x: 100, y: 50 },
  ];

  const pathData = pulsePoints
    .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className={`relative h-24 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getColor()} stopOpacity="0.2" />
            <stop offset="50%" stopColor={getColor()} stopOpacity="1" />
            <stop offset="100%" stopColor={getColor()} stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#pulseGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2, ease: "easeInOut" },
            opacity: { duration: 0.5 },
          }}
        />
      </svg>
      
      <motion.div
        className="absolute top-1/2 left-0 w-1 h-1 rounded-full"
        style={{ backgroundColor: getColor(), boxShadow: `0 0 10px ${getColor()}` }}
        animate={{
          left: ["0%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
