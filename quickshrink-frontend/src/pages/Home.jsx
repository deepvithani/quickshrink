import { useState } from "react";
import Tabs from "../components/Tabs";
import ShortenForm from "../components/ShortenForm";
import QrForm from "../components/QrForm";
import ShortResult from "../components/ShortResult";
import QrResult from "../components/QrResult";
import { validateUrl } from "../utils/validateUrl";
import { useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TABS = {
  SHORT_LINK: "short-link",
  QR_CODE: "qr-code",
};

const Home = () => {
  const [activeTab, setActiveTab] = useState(TABS.SHORT_LINK);

  const [longUrl, setLongUrl] = useState("");
  const [isSubmittingShort, setIsSubmittingShort] = useState(false);
  const [shortError, setShortError] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortQrSvg, setShortQrSvg] = useState("");

  const [qrUrl, setQrUrl] = useState("");
  const [isSubmittingQr, setIsSubmittingQr] = useState(false);
  const [qrError, setQrError] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalUsers: 0,
    totalClicks: 0,
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch(() => { });
  }, []);
  const handleShortenSubmit = async (event) => {
    event.preventDefault();
    setShortError("");
    setShortUrl("");
    setShortQrSvg("");

    const validated = validateUrl(longUrl);
    if (typeof validated === "string" && validated.startsWith("http") === false) {
      setShortError(validated);
      return;
    }

    const normalizedUrl = validated;
    setIsSubmittingShort(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Unable to shorten URL right now.");
      }

      const payload = await response.json();
      setShortUrl(payload.shortUrl);
      setShortQrSvg(payload.qrCodeSvg || "");
    } catch (err) {
      setShortError(err.message || "Unexpected error, please try again.");
    } finally {
      setIsSubmittingShort(false);
    }
  };

  const handleQrSubmit = async (event) => {
    event.preventDefault();
    setQrError("");
    setQrSvg("");

    const validated = validateUrl(qrUrl);
    if (typeof validated === "string" && validated.startsWith("http") === false) {
      setQrError(validated);
      return;
    }

    const normalizedUrl = validated;
    setIsSubmittingQr(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`, },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Unable to generate QR code right now.");
      }

      const payload = await response.json();
      if (payload.qrSvg) {
        setQrSvg(payload.qrSvg);
      }
    } catch (err) {
      setQrError(err.message || "Unexpected error, please try again.");
    } finally {
      setIsSubmittingQr(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-10">
      <main className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] md:items-start">
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-soft sm:p-8">
            <div className="pointer-events-none absolute inset-x-10 -top-32 -z-10 h-56 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="mb-4 sm:mb-5" />
            {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-sm opacity-80">Total Links</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalLinks}</p>
              </div>

              <div className="rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-sm opacity-80">Total Users</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalUsers}</p>
              </div>

              <div className="rounded-xl bg-slate-900 p-5 text-white">
                <p className="text-sm opacity-80">Total Clicks</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalClicks}</p>
              </div>
            </div> */}
            <Tabs activeTab={activeTab} onChange={setActiveTab} tabs={TABS} />

            {activeTab === TABS.SHORT_LINK ? (
              <ShortenForm
                longUrl={longUrl}
                onChange={setLongUrl}
                onSubmit={handleShortenSubmit}
                isSubmitting={isSubmittingShort}
                error={shortError}
              />
            ) : (
              <QrForm
                qrUrl={qrUrl}
                onChange={setQrUrl}
                onSubmit={handleQrSubmit}
                isSubmitting={isSubmittingQr}
                error={qrError}
              />
            )}
          </div>
        </section>

        <aside className="space-y-4 md:space-y-6">
          {activeTab === TABS.SHORT_LINK ? (
            <ShortResult shortUrl={shortUrl} onCopy={handleCopy} />
          ) : (
            <QrResult qrSvg={activeTab === TABS.SHORT_LINK ? shortQrSvg : qrSvg} />
          )}
        </aside>
      </main>
    </div>
  );
};

export default Home;

