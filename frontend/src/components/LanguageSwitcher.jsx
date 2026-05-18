import { Languages } from 'lucide-react';
import SmoothSelect from './SmoothSelect';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { language, languages, setLanguage } = useLanguage();

  return (
    <div className="flex min-w-[92px] items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 shadow-sm">
      <Languages size={14} className="text-slate-500" />
      <SmoothSelect
        value={language}
        onChange={setLanguage}
        className="min-w-[58px]"
        options={languages.map((item) => ({ value: item.code, label: item.label }))}
      />
    </div>
  );
}
