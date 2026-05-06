import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const currency = import.meta.env.VITE_PAYPAL_CURRENCY || 'USD';

export default function PayPalButton({ reservationId, onPaid }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reservationId || !clientId || !containerRef.current) {
      return undefined;
    }

    let cancelled = false;

    const renderButtons = () => {
      if (cancelled || !window.paypal || !containerRef.current) {
        return;
      }

      containerRef.current.innerHTML = '';

      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          shape: 'rect',
          label: 'paypal',
        },
        createOrder: async () => {
          const { data } = await api.post(`/reservations/${reservationId}/paypal/order`);
          return data.id;
        },
        onApprove: async (data) => {
          await api.post(`/reservations/${reservationId}/paypal/capture`, {
            paypal_order_id: data.orderID,
          });
          onPaid?.();
        },
        onError: (paypalError) => {
          setError(paypalError?.message || 'PayPal payment failed.');
        },
      }).render(containerRef.current);
    };

    if (window.paypal) {
      renderButtons();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
    script.async = true;
    script.onload = renderButtons;
    script.onerror = () => setError('Unable to load PayPal checkout.');
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [reservationId, onPaid]);

  if (!clientId) {
    return (
      <p className="rounded-lg bg-gold/10 p-3 text-sm font-semibold text-muted">
        PayPal is ready, but `VITE_PAYPAL_CLIENT_ID` is not configured.
      </p>
    );
  }

  return (
    <div>
      <div ref={containerRef} />
      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
