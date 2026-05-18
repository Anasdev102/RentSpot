import { CircleDot, Facebook, Instagram, Send, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-footer text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-black text-white"><CircleDot size={24} /> <span>RENT<span className="text-secondary">SPOT</span></span></h3>
          <p className="mt-3 text-sm leading-6 text-white/70">{t('footer.description')}</p>
          <div className="mt-5 flex gap-3 text-white/80"><Facebook size={18} /><Instagram size={18} /><Twitter size={18} /><Youtube size={18} /></div>
        </div>
        <div>
          <h4 className="font-bold">{t('footer.quickLinks')}</h4>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            <a href="/">{t('nav.home')}</a>
            <a href="/stadiums">{t('nav.stadiums')}</a>
            <a href="/#how">{t('nav.how')}</a>
            <a href="/#contact">{t('nav.contact')}</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold">{t('footer.popularSports')}</h4>
          <div className="mt-3 grid gap-2 text-sm text-white/70"><span>Football</span><span>Padel</span><span>Tennis</span><span>Basketball</span></div>
        </div>
        <div>
          <h4 className="font-bold">{t('footer.legal')}</h4>
          <div className="mt-3 grid gap-2 text-sm text-white/70"><span>{t('footer.terms')}</span><span>{t('footer.privacy')}</span><span>{t('footer.refund')}</span><span>{t('footer.faq')}</span></div>
        </div>
        <div>
          <h4 className="font-bold">{t('footer.newsletter')}</h4>
          <p className="mt-3 text-sm text-white/70">{t('footer.newsletterText')}</p>
          <div className="mt-3 flex gap-2">
            <input className="input border-white/10 bg-white text-text placeholder:text-muted" placeholder={t('footer.emailPlaceholder')} />
            <button className="rounded-lg bg-secondary px-4 text-white"><Send size={18} /></button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">{t('footer.rights')}</div>
    </footer>
  );
}
