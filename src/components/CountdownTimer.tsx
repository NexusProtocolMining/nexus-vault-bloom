import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownTimerProps {
  targetTimestamp: bigint | undefined;
  label: string;
  onExpired?: () => void;
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg px-3 py-2 min-w-[3.5rem]">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-primary font-mono"
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
    </div>
    <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
  </div>
);

export const CountdownTimer = ({ targetTimestamp, label, onExpired }: CountdownTimerProps) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetTimestamp);

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg"
        >
          <span className="text-primary font-semibold">Ready!</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex items-center justify-center gap-2">
        {days > 0 && <TimeUnit value={days} label="Days" />}
        <TimeUnit value={hours} label="Hrs" />
        <TimeUnit value={minutes} label="Min" />
        <TimeUnit value={seconds} label="Sec" />
      </div>
    </div>
  );
};
