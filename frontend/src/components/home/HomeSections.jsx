import { BadgeCheck, CalendarCheck, CreditCard, Dumbbell, Headphones, Lock, MapPin, Medal, Search, Send, ShieldCheck, Sparkles, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../SectionHeader';
import SmoothSelect from '../SmoothSelect';
import StadiumCard from '../StadiumCard';
import { useLanguage } from '../../i18n/LanguageContext';

export function HeroSection({
  sportOptions,
  cityOptions,
  heroSportId,
  heroCity,
  onSportChange,
  onCityChange,
  onSubmit,
}) {
  const { t } = useLanguage();
  const heroBadges = [
    [Zap, t('home.fastBooking')],
    [ShieldCheck, t('home.securePayment')],
    [BadgeCheck, t('home.instantConfirmation')],
  ];

  return (
    <section className="hero-field relative overflow-hidden text-white">
      <div className="mx-auto grid min-h-[420px] max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-20">
        <div>
          <h1 className="max-w-xl text-5xl font-black leading-tight md:text-6xl">
            {t('home.heroTitlePrefix')} <span className="text-secondary">{t('home.heroTitleHighlight')}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white">{t('home.heroText')}</p>
          <div className="mt-9 flex flex-wrap gap-5 text-sm font-bold">
            {heroBadges.map(([Icon, badge]) => (
              <span key={badge} className="inline-flex items-center gap-2"><Icon className="text-gold" size={18} fill="currentColor" /> {badge}</span>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="ml-auto grid w-full max-w-2xl gap-0 rounded-lg bg-white p-4 text-text shadow-soft md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="border-b border-black/10 px-4 py-2 md:border-b-0 md:border-r">
            <span className="flex items-center gap-2 text-sm font-black"><MapPin className="text-primary" size={16} /> {t('home.sport')}</span>
            <SmoothSelect
              name="sport_id"
              value={heroSportId}
              onChange={onSportChange}
              placeholder={t('home.allSports')}
              className="mt-2"
              options={[{ value: '', label: t('home.allSports') }, ...sportOptions.map((sport) => ({ value: sport.id, label: sport.name }))]}
            />
          </label>
          <label className="border-b border-black/10 px-4 py-2 md:border-b-0 md:border-r">
            <span className="flex items-center gap-2 text-sm font-black"><MapPin className="text-primary" size={16} /> {t('home.city')}</span>
            <SmoothSelect
              name="city"
              value={heroCity}
              onChange={onCityChange}
              placeholder={t('home.allCities')}
              className="mt-2"
              options={[{ value: '', label: t('home.allCities') }, ...cityOptions.map((city) => ({ value: city, label: city }))]}
            />
          </label>
          <label className="px-4 py-2">
            <span className="flex items-center gap-2 text-sm font-black"><CalendarCheck className="text-primary" size={16} /> {t('home.date')}</span>
            <input name="date" className="mt-2 w-full bg-transparent text-sm font-semibold text-muted outline-none" type="date" />
          </label>
          <button className="btn-primary min-h-20 flex-col px-6"><Search size={22} /> {t('home.search')}</button>
        </form>
      </div>
      <div className="absolute -bottom-10 left-0 h-20 w-full -skew-y-2 bg-white" />
    </section>
  );
}

export function PopularSportsSection() {
  const { t } = useLanguage();
  const featuredSports = [
    ['Football', t('home.footballFields'), Trophy, 'text-primary', 'bg-primary/10'],
    ['Padel', t('home.padelCourts'), Dumbbell, 'text-secondary', 'bg-secondary/10'],
    ['Tennis', t('home.tennisCourts'), Trophy, 'text-primary', 'bg-primary/10'],
    ['Basketball', t('home.basketballCourts'), Medal, 'text-orange-500', 'bg-orange-100'],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-16">
      <SectionHeader title={t('home.popularSports')} />
      <div className="grid gap-5 md:grid-cols-4">
        {featuredSports.map(([name, text, Icon, iconColor, bgColor]) => (
          <div key={name} className="rounded-lg bg-white p-8 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
            <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${bgColor} ${iconColor}`}><Icon size={38} /></div>
            <h3 className="mt-5 font-black">{name}</h3>
            <p className="mt-2 text-sm text-muted">{text}</p>
            <div className={`mx-auto mt-4 h-1 w-8 rounded-full ${name === 'Padel' ? 'bg-secondary' : name === 'Basketball' ? 'bg-gold' : 'bg-primary'}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturedStadiumsSection({ stadiums, favoriteIds, onFavoriteChange }) {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-black">{t('home.featuredStadiums')}</h2>
          <Link to="/stadiums" className="text-sm font-bold text-primary">{t('home.viewAllStadiums')} &rarr;</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {stadiums.slice(0, 3).map((stadium) => (
            <StadiumCard
              key={stadium.id}
              stadium={stadium}
              isFavorite={favoriteIds.includes(stadium.id)}
              onFavoriteChange={onFavoriteChange}
            />
          ))}
          {stadiums.length === 0 && <p className="text-muted">{t('home.noStadiums')}</p>}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const { t } = useLanguage();
  const howItWorks = [
    [Sparkles, t('home.chooseField'), t('home.chooseFieldText')],
    [CalendarCheck, t('home.selectTime'), t('home.selectTimeText')],
    [CreditCard, t('home.payPlay'), t('home.payPlayText')],
  ];

  return (
    <section id="how" className="bg-gradient-to-b from-white to-primary/5 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader title={t('home.howTitle')} />
        <div className="relative grid gap-8 md:grid-cols-3">
          {howItWorks.map(([Icon, title, text], index) => (
            <div key={title} className="relative text-center">
              <span className="mx-auto mb-3 grid h-7 w-7 place-items-center rounded-full bg-secondary text-sm font-black text-white">{index + 1}</span>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-white shadow-soft"><Icon size={34} /></div>
              <h3 className="mt-5 font-black">{title}</h3>
              <p className="mx-auto mt-2 max-w-48 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  const { t } = useLanguage();
  const reasons = [
    [ShieldCheck, t('home.realtime'), t('home.realtimeText'), 'text-primary'],
    [Lock, t('home.securePayment'), t('home.securePaymentText'), 'text-secondary'],
    [Sparkles, t('home.easyBooking'), t('home.easyBookingText'), 'text-primary'],
    [Medal, t('home.trustedFields'), t('home.trustedFieldsText'), 'text-gold'],
  ];

  return (
    <section id="about" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader title={t('home.whyTitle')} />
        <div className="grid gap-6 md:grid-cols-4">
          {reasons.map(([Icon, title, text, color]) => (
            <div key={title} className="rounded-lg bg-white p-7 text-center shadow-soft">
              <Icon className={`mx-auto ${color}`} size={44} />
              <h3 className="mt-5 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection({
  user,
  contact,
  contactErrors,
  contactMessage,
  contactLoading,
  supportEmail,
  onContactChange,
  onSubmit,
}) {
  const { t } = useLanguage();
  const hasErrors = Object.keys(contactErrors).length > 0;

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 pb-16">
      <div className="grid gap-8 rounded-lg bg-primary/5 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-10">
        <div>
          <h2 className="text-4xl font-black">{t('home.needHelp')}</h2>
          <div className="mt-4 h-1 w-9 rounded-full bg-secondary" />
          <p className="mt-6 max-w-sm font-semibold leading-7 text-muted">{t('home.contactText')}</p>
          <div className="mt-8 grid gap-5 text-muted">
            <p className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-white"><Headphones size={19} /></span> +212 6 12 34 56 78</p>
            <p className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white"><CreditCard size={19} /></span> {supportEmail}</p>
            <p className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-white"><MapPin size={19} /></span> Morocco</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 rounded-lg bg-white p-6 shadow-soft">
          {user && <p className="rounded-lg bg-primary/10 p-3 text-sm font-semibold text-primary">{t('home.linkedAccount')} {user.email}</p>}
          {!user && <p className="rounded-lg bg-gold/10 p-3 text-sm font-semibold text-muted">{t('home.guestMessage')}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input" placeholder={t('home.fullName')} value={contact.name} onChange={(event) => onContactChange({ ...contact, name: event.target.value })} required />
            <input className="input" placeholder={t('home.emailAddress')} type="email" value={contact.email} onChange={(event) => onContactChange({ ...contact, email: event.target.value })} required />
          </div>
          {contactErrors.name && <p className="-mt-2 text-sm font-semibold text-red-600">{contactErrors.name[0]}</p>}
          {contactErrors.email && <p className="-mt-2 text-sm font-semibold text-red-600">{contactErrors.email[0]}</p>}
          <input className="input" placeholder={t('home.subject')} value={contact.subject} onChange={(event) => onContactChange({ ...contact, subject: event.target.value })} />
          <textarea className="input min-h-32" placeholder={t('home.yourMessage')} value={contact.message} onChange={(event) => onContactChange({ ...contact, message: event.target.value })} required />
          {contactErrors.message && <p className="-mt-2 text-sm font-semibold text-red-600">{contactErrors.message[0]}</p>}
          {contactMessage && <p className={`rounded-lg p-3 text-sm font-semibold ${hasErrors ? 'bg-red-50 text-red-700' : 'bg-secondary/10 text-secondary'}`}>{contactMessage}</p>}
          <button disabled={contactLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary disabled:opacity-60">{contactLoading ? t('home.sending') : t('home.sendMessage')} <Send size={17} /></button>
        </form>
      </div>
    </section>
  );
}
