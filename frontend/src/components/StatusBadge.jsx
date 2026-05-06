const styles = {
  pending: 'bg-gold/15 text-gold',
  confirmed: 'bg-primary/10 text-primary',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-secondary/10 text-secondary',
  unpaid: 'bg-gray-100 text-muted',
  paid: 'bg-secondary/10 text-secondary',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-blue-100 text-primary',
  active: 'bg-secondary/10 text-secondary',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${styles[status] || styles.active}`}>
      {status}
    </span>
  );
}
