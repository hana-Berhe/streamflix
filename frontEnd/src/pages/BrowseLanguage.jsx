import { useMemo, useState } from "react";
import Row from "../components/Row/Row";
import TitleGrid from "../components/TitleGrid/TitleGrid";
import { hasTmdbKey, languageRequest } from "../services/tmdb";
import { localTitles } from "../utils/normalizeMovie";
import page from "../styles/page.module.css";

const LANGUAGES = [
  ["en", "English"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["it", "Italian"],
  ["ko", "Korean"],
  ["ja", "Japanese"],
  ["hi", "Hindi"],
  ["ta", "Tamil"],
  ["te", "Telugu"],
  ["pt", "Portuguese"],
  ["tr", "Turkish"],
  ["ar", "Arabic"],
  ["zh", "Mandarin"],
];

function BrowseLanguage() {
  const [language, setLanguage] = useState("ko");
  const name = LANGUAGES.find(([code]) => code === language)?.[1];

  const movieRequest = useMemo(() => languageRequest(language, "movie"), [language]);
  const tvRequest = useMemo(() => languageRequest(language, "tv"), [language]);

  return (
    <main className={page.pageRows}>
      <div className={page.headingRow}>
        <h1 className={page.heading}>Browse by Languages</h1>
        <label className={page.selectLabel}>
          Original language
          <select className={page.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasTmdbKey ? (
        <>
          <Row key={`tv-${language}`} title={`${name} TV Shows`} request={tvRequest} />
          <Row key={`movie-${language}`} title={`${name} Movies`} request={movieRequest} />
        </>
      ) : (
        <div style={{ padding: "0 var(--nf-gutter)" }}>
          <p className={page.muted} style={{ marginBottom: 24 }}>
            Language filtering needs live data. Add VITE_TMDB_API_KEY to the frontend .env to enable it.
            Here&apos;s everything available on this device:
          </p>
          <TitleGrid items={localTitles} />
        </div>
      )}
    </main>
  );
}

export default BrowseLanguage;
