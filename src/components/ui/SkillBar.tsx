import { motion } from 'framer-motion';

interface SkillBarProps {
  label: string;
  percentage: number;
  color: string;
  delay?: number;
}

export default function SkillBar({ label, percentage, color, delay = 0 }: SkillBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-500">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-deep-700/50 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}
