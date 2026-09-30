import { useEffect, useMemo, useState } from 'react';
import CourtCard from '../components/CourtCard.jsx';
import { courts as fallbackCourts } from '../data/courts.js';
import { getCourts } from '../services/courtService.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function CourtsPage() {
  const { t, pick } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getCourts()
      .then((data) => {
        if (!cancelled) setCourts(data);
      })
      .catch(() => {
        if (!cancelled) setCourts(fallbackCourts);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filteredCourts = useMemo(() => {
    return courts.filter((court) => {
      const currentType = pick(court.typeLabel);
      const search = searchTerm.trim().toLowerCase();
      const pool = [pick(court.name), currentType, pick(court.description)].join(' ').toLowerCase();
      const matchesSearch = !search || pool.includes(search);
      return matchesSearch;
    });
  }, [searchTerm, pick, courts]);

  if (isLoading) {
    return (
      <div className="page section">
        <div className="empty-state">
          <h2>جاري تحميل الملاعب...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page section">
      <div className="courts-hero">
        <div>
          <p className="eyebrow">{t('courts.eyebrow')}</p>
          <h1>{t('courts.title')}</h1>
          <p>{t('courts.desc')}</p>
        </div>
        <div className="courts-hero-card">
          <strong>{filteredCourts.length}</strong>
          <span>{t('courts.visible')}</span>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <span>🔎</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t('courts.searchPlaceholder')}
          />
        </div>
      </div>

      {filteredCourts.length === 0 ? (
        <div className="empty-state">
          <h2>{t('courts.emptyTitle')}</h2>
          <p>{t('courts.emptyText')}</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredCourts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}
    </div>
  );
}
