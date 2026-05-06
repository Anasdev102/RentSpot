import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function normalizeOptions(options) {
  return options.map((option) =>
    typeof option === "string" || typeof option === "number"
      ? { value: String(option), label: String(option) }
      : {
          value: String(option.value ?? ""),
          label: option.label ?? String(option.value ?? ""),
        },
  );
}

export default function SmoothSelect({
  value = "",
  onChange,
  options = [],
  placeholder = "Select",
  className = "",
  name,
  disabled = false,
  required = false,
}) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const selected = normalizedOptions.find(
    (option) => option.value === String(value),
  );
  const displayLabel =
    String(value ?? "") === "" ? placeholder : selected?.label || placeholder;

  useEffect(() => {
    let timeoutId;

    if (open) {
      setMounted(true);
    } else {
      timeoutId = window.setTimeout(() => setMounted(false), 200);
    }

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    const close = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const choose = (nextValue) => {
    onChange?.(nextValue);
    setOpen(false);
  };
  const hasOptions = normalizedOptions.length > 0;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ""}
          required={required}
        />
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`input flex items-center justify-between gap-3 text-left shadow-sm transition-all duration-300 ease-out hover:shadow-md ${disabled ? "cursor-not-allowed opacity-60" : ""} ${open ? "border-primary ring-4 ring-primary/10" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={`min-w-0 truncate ${String(value ?? "") !== "" && selected ? "text-slate-700" : "text-slate-500"}`}
        >
          {displayLabel}
        </span>
        <ChevronDown
          className={`shrink-0 text-slate-500 transition-all duration-300 ease-out ${open ? "rotate-180 text-primary" : ""}`}
          size={16}
        />
      </button>

      {mounted && (
        <div
          className={`absolute left-0 right-0 z-50 mt-2 max-h-64 origin-top overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,35,65,0.16)]
  transition-all duration-300 ease-out
  ${
    open
      ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
      : "pointer-events-none scale-95 opacity-0 -translate-y-2"
  }`}
          role="listbox"
        >
          {!hasOptions && (
            <div className="px-3 py-2 text-xs font-semibold text-slate-400">No options available</div>
          )}
          {normalizedOptions.map((option) => (
            <button
              key={`${option.value}-${option.label}`}
              type="button"
              onClick={() => choose(option.value)}
              className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold
      transition-all duration-300 ease-out
      hover:bg-primary/10 hover:text-primary
      ${
        String(value) === option.value
          ? "bg-primary text-white hover:bg-primary hover:text-white"
          : "text-slate-700"
      }`}
              role="option"
              aria-selected={String(value) === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
