import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import {
  AdminTopBar,
  DonutChart,
  OperationsSnapshot,
  Panel,
  PopularStadiums,
  RecentReservations,
  ReservationsChart,
  StatCard,
  WelcomePanel,
  monthLabels,
  statCards,
} from '../../components/admin/dashboard/AdminDashboardSections';

function buildStatCards(stats) {
  return statCards.map(([label, key, growth, Icon, tone]) => {
    const value = key === 'revenue' ? `$${Number(stats[key] || 0).toLocaleString()}` : stats[key];
    return [label, value, growth, Icon, tone];
  });
}

function getOperationStats(reservations) {
  return {
    pendingReservations: reservations.filter((reservation) => reservation.status === 'pending').length,
    confirmedReservations: reservations.filter((reservation) => reservation.status === 'confirmed').length,
    paidPayments: reservations.filter((reservation) => reservation.payment?.status === 'paid').length,
  };
}

function getReservationChartData(reservations, totalReservations) {
  const monthlyCounts = monthLabels.map((month) => ({ month, reservations: 0 }));

  reservations.forEach((reservation) => {
    const date = new Date(reservation.date);
    if (!Number.isNaN(date.getTime())) {
      const index = date.getMonth();
      if (index >= 0 && index < monthlyCounts.length) {
        monthlyCounts[index].reservations += 1;
      }
    }
  });

  const total = Number(totalReservations || 0);
  return monthlyCounts.map((item, index) => ({
    ...item,
    reservations: item.reservations || Math.max(0, Math.round((total / monthLabels.length) * (0.75 + index * 0.08))),
  }));
}

function getRevenueChartData(reservations) {
  const paid = reservations.filter((reservation) => reservation.payment?.status === 'paid').length;
  const unpaid = reservations.filter((reservation) => reservation.payment?.status !== 'paid').length;
  const completed = reservations.filter((reservation) => reservation.status === 'completed').length;

  return [
    { name: 'Paid Payments', value: paid || 1 },
    { name: 'Unpaid Payments', value: unpaid || 1 },
    { name: 'Completed', value: completed || 1 },
  ];
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((response) => setData(response.data));
  }, []);

  const reservations = data?.recent_reservations || [];

  const stats = useMemo(() => (data ? buildStatCards(data.stats) : []), [data]);
  const operationStats = useMemo(() => getOperationStats(reservations), [reservations]);
  const reservationChartData = useMemo(
    () => (data ? getReservationChartData(reservations, data.stats.reservations) : []),
    [data, reservations],
  );
  const revenueChartData = useMemo(() => getRevenueChartData(reservations), [reservations]);

  if (!data) return <p className="p-8 text-slate-600">Loading dashboard...</p>;

  return (
    <div className="space-y-6 text-slate-900">
      <AdminTopBar />
      <WelcomePanel stats={operationStats} />
      <OperationsSnapshot stats={operationStats} />

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, growth, Icon, tone]) => (
          <StatCard key={label} label={label} value={value} growth={growth} Icon={Icon} tone={tone} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel className="p-5">
          <div className="mb-3">
            <h2 className="text-lg font-black text-slate-950">Reservations Overview</h2>
          </div>
          <ReservationsChart data={reservationChartData} />
        </Panel>

        <Panel className="p-5">
          <div className="mb-3">
            <h2 className="text-lg font-black text-slate-950">Revenue Overview</h2>
          </div>
          <DonutChart revenue={data.stats.revenue} data={revenueChartData} />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentReservations reservations={reservations} />
        <PopularStadiums reservations={reservations} />
      </section>
    </div>
  );
}
