import { Star } from 'lucide-react';
import SmoothSelect from '../SmoothSelect';

export default function ReviewForm({ reservations, review, message, onReviewChange, onSubmit }) {
  return (
    <form id="review-form" onSubmit={onSubmit} className="card mt-8 grid gap-4 p-6 md:grid-cols-[1fr_160px_1fr_auto]">
      <SmoothSelect
        value={review.reservation_id}
        onChange={(value) => onReviewChange({ ...review, reservation_id: value })}
        required
        disabled={reservations.length === 0}
        placeholder={reservations.length === 0 ? 'No reservations yet' : 'Select reservation stadium'}
        options={[{ value: '', label: reservations.length === 0 ? 'No reservations yet' : 'Select reservation stadium' }, ...reservations.map((item) => ({ value: item.id, label: `${item.stadium?.name} - ${item.status}` }))]}
      />
      <SmoothSelect
        value={review.rating}
        onChange={(value) => onReviewChange({ ...review, rating: Number(value) })}
        options={[5, 4, 3, 2, 1].map((rating) => ({ value: rating, label: `${rating} stars` }))}
      />
      <input className="input" placeholder="Comment" value={review.comment} onChange={(event) => onReviewChange({ ...review, comment: event.target.value })} />
      <button className="btn-primary" disabled={reservations.length === 0}><Star size={18} /> Review</button>
      {message && <p className={`md:col-span-4 rounded-lg p-3 text-sm font-semibold ${message.type === 'success' ? 'bg-secondary/10 text-secondary' : 'bg-gold/10 text-slate-700'}`}>{message.text}</p>}
    </form>
  );
}
