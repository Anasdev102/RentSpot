export default function ReviewsList({ reviews = [] }) {
  return (
    <div>
      <h2 className="mt-10 text-2xl font-black">Reviews</h2>
      <div className="mt-4 grid gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="card p-4">
            <p className="font-bold">{review.user?.name} <span className="text-gold">{review.rating}/5</span></p>
            <p className="mt-1 text-muted">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
