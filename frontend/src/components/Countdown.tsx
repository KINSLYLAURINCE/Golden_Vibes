import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string;
}

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Jours", value: timeLeft.days },
    { label: "Heures", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-6 justify-center">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-secondary border border-border flex items-center justify-center gold-glow">
            <span className="text-2xl sm:text-3xl font-bold text-primary font-display">{String(u.value).padStart(2, "0")}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{u.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
