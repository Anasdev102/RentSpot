export default function StadiumDetailsLoader() {
  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="h-[330px] animate-pulse rounded-lg bg-slate-200" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
          <div className="card p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Preparing field details</p>
            <h1 className="mt-3 text-2xl font-black text-slate-950">Getting your stadium ready...</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              We are loading photos, availability, pricing, and reviews so you can book with confidence.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </section>
        <aside className="card h-fit p-5">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 grid gap-4">
            <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-9 animate-pulse rounded-md bg-slate-100" />
              ))}
            </div>
            <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-11 animate-pulse rounded-lg bg-primary/20" />
          </div>
        </aside>
      </div>
    </div>
  );
}
