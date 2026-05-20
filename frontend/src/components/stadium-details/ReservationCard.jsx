import { CalendarDays } from 'lucide-react';
import FavoriteButton from '../FavoriteButton';
import TimePickerField from './TimePickerField';

const hoursBetween = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  return ((endHours * 60 + endMinutes) - (startHours * 60 + startMinutes)) / 60;
};

export default function ReservationCard({
  stadium,
  form,
  today,
  minStartTime,
  error,
  isFavorite,
  onFormChange,
  onSubmit,
  onFavoriteChange,
}) {
  const duration = Math.max(hoursBetween(form.start_time, form.end_time), 0);
  const totalPrice = duration * Number(stadium.price_per_hour || 0);
  const canReserve = Boolean(form.date && form.start_time && form.end_time);

  return (
    <aside className="card h-fit p-5">
      <p className="text-lg font-black text-slate-950">Book this field</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="text-xs font-bold text-slate-700">
          Select Date
          <input
            className="input mt-2"
            type="date"
            min={today}
            value={form.date}
            onChange={(event) => onFormChange({ ...form, date: event.target.value, start_time: '', end_time: '' })}
            required
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <TimePickerField
            label="Start Time"
            value={form.start_time}
            placeholder="Select start"
            minTime={minStartTime}
            disabled={!form.date}
            onChange={(time) => onFormChange({ ...form, start_time: time, end_time: '' })}
          />
          <TimePickerField
            label="End Time"
            value={form.end_time}
            placeholder="Select end"
            afterTime={form.start_time}
            disabled={!form.start_time}
            onChange={(time) => onFormChange({ ...form, end_time: time })}
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-black text-slate-700">Selected time</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="block font-semibold text-muted">Start</span>
              <strong className="mt-1 block text-slate-950">{form.start_time || '--:--'}</strong>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <span className="block font-semibold text-muted">End</span>
              <strong className="mt-1 block text-slate-950">{form.end_time || '--:--'}</strong>
            </div>
          </div>
          <input type="hidden" name="start_time" value={form.start_time || ''} required />
          <input type="hidden" name="end_time" value={form.end_time || ''} required />
        </div>

        <div className="divide-y divide-slate-100 rounded-lg bg-slate-50 p-4 text-sm">
          <p className="flex justify-between py-2"><span>Price / hour</span><strong>${stadium.price_per_hour}</strong></p>
          <p className="flex justify-between py-2"><span>Duration</span><strong>{duration} hour</strong></p>
          <p className="flex justify-between py-2"><span>Total Price</span><strong className="text-primary">${totalPrice.toFixed(2)}</strong></p>
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn-primary" disabled={!canReserve}><CalendarDays size={18} /> Reserve Now</button>
        <FavoriteButton
          stadiumId={stadium.id}
          initial={isFavorite}
          onChange={(_, nextValue) => onFavoriteChange(nextValue)}
          variant="button"
        />
      </form>
    </aside>
  );
}
