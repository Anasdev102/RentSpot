import { CalendarDays } from 'lucide-react';
import FavoriteButton from '../FavoriteButton';

const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '16:00 - 17:00', '19:00 - 20:00'];

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
  return (
    <aside className="card h-fit p-5">
      <p className="text-lg font-black text-slate-950">Book this field</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="text-xs font-bold text-slate-700">
          Select Date
          <input className="input mt-2" type="date" min={today} value={form.date} onChange={(event) => onFormChange({ ...form, date: event.target.value })} required />
        </label>
        <div>
          <p className="mb-2 text-xs font-bold text-slate-700">Available Time Slots</p>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button key={slot} type="button" className={`rounded-md border px-2 py-2 text-[11px] font-bold ${slot.startsWith(form.start_time) ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary'}`}>
                {slot}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-bold text-slate-700">Start<input className="input mt-2" type="time" min={minStartTime} value={form.start_time} onChange={(event) => onFormChange({ ...form, start_time: event.target.value })} required /></label>
          <label className="text-xs font-bold text-slate-700">End<input className="input mt-2" type="time" value={form.end_time} onChange={(event) => onFormChange({ ...form, end_time: event.target.value })} required /></label>
        </div>
        <div className="divide-y divide-slate-100 rounded-lg bg-slate-50 p-4 text-sm">
          <p className="flex justify-between py-2"><span>Price / hour</span><strong>${stadium.price_per_hour}</strong></p>
          <p className="flex justify-between py-2"><span>Total Price</span><strong className="text-primary">${stadium.price_per_hour}</strong></p>
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn-primary"><CalendarDays size={18} /> Reserve Now</button>
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
