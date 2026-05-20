import { Clock } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const buildTimes = () => {
  const times = [];

  for (let hour = 8; hour <= 22; hour += 1) {
    for (const minute of ['00', '30']) {
      if (hour === 22 && minute === '30') continue;
      times.push(`${String(hour).padStart(2, '0')}:${minute}`);
    }
  }

  return times;
};

const timeOptions = buildTimes();

export default function TimePickerField({
  label,
  value,
  placeholder = 'Select time',
  minTime,
  afterTime,
  disabled = false,
  onChange,
}) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);

  const options = useMemo(() => (
    timeOptions.filter((time) => {
      if (minTime && time < minTime) return false;
      if (afterTime && time <= afterTime) return false;
      return true;
    })
  ), [afterTime, minTime]);

  useEffect(() => {
    const close = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const choose = (time) => {
    onChange(time);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <p className="mb-2 text-xs font-bold text-slate-700">{label}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`input flex items-center justify-between gap-3 text-left transition-all duration-300 ease-out ${open ? 'border-primary ring-4 ring-primary/10' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <span className={value ? 'font-black text-slate-950' : 'font-semibold text-slate-400'}>{value || placeholder}</span>
        <Clock size={16} className={`text-slate-500 transition-all duration-300 ease-out ${open ? 'text-primary' : ''}`} />
      </button>

      {open && (
        <div className="panel-pop absolute left-0 right-0 z-50 mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,35,65,0.16)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-black text-slate-950">Choose time</p>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black text-primary">30 min</span>
          </div>
          <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto pr-1">
            {options.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => choose(time)}
                className={`rounded-lg border px-2 py-2 text-xs font-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-sm ${
                  value === time ? 'border-primary bg-primary text-white hover:text-white' : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {options.length === 0 && <p className="rounded-lg bg-slate-50 p-3 text-xs font-semibold text-muted">No available time for this selection.</p>}
        </div>
      )}
    </div>
  );
}
