import { useState } from "react";
import Tabs from "../components/Tabs";
import ShortenForm from "../components/ShortenForm";
import QrForm from "../components/QrForm";
import ShortResult from "../components/ShortResult";
import QrResult from "../components/QrResult";
import { validateUrl } from "../utils/validateUrl";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TABS = {
  SHORT_LINK: "short-link",
  QR_CODE: "qr-code",
};

const Home = () => {
  const [activeTab, setActiveTab] = useState(TABS.SHORT_LINK);
  const [activeCard, setActiveCard] = useState(null);
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
    <div className="flex min-h-[calc(100vh-64px)] flex-col px-6 py-8 sm:px-8 lg:px-12">
      <section className="mt-6 mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
          Build stronger digital connections
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-300">
          Use our URL shortener, QR Codes, and analytics to connect your audience
          with the right content — faster and smarter.
        </p>
      </section>

      <main className="grid flex-1 gap-8 
px-6 sm:px-8 md:px-10 lg:px-14 
md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] 
md:items-start">

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
      {/* Dynamic Free Plan Section */}
      <div className="mt-10 w-full bg-[#06162d] py-10">
        <section className="mx-auto max-w-6xl px-6 text-center">
          {/* Top label */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            SIGN UP FOR FREE
          </p>

          {/* Heading */}
          <h2 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl">
            Your free plan includes:
          </h2>

          {/* SHORT LINK */}
          {activeTab === TABS.SHORT_LINK && (
            <ul className="flex flex-nowrap items-center justify-center gap-8 text-sm text-slate-200 sm:text-base">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaCheckCircle className="text-orange-500 text-lg" />
                <span>10 short links/month</span>
              </li>

              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaCheckCircle className="text-orange-500 text-lg" />
                <span>3 custom back-halves/month</span>
              </li>

              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaCheckCircle className="text-orange-500 text-lg" />
                <span>Unlimited link clicks</span>
              </li>
            </ul>
          )}

          {/* QR CODE */}
          {activeTab === TABS.QR_CODE && (
            <ul className="flex flex-nowrap items-center justify-center gap-8 text-sm text-slate-200 sm:text-base">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaCheckCircle className="text-orange-500 text-lg" />
                <span>5 QR Codes/month</span>
              </li>

              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaCheckCircle className="text-orange-500 text-lg" />
                <span>Unlimited QR Code scans</span>
              </li>

              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaCheckCircle className="text-orange-500 text-lg" />
                <span>QR Code customizations</span>
              </li>
            </ul>
          )}
        </section>
      </div>


      {/* </section> */}
      {/* Bitly-style New Section */}
      {/* QUICKSHRINK Hero Section */}
      <section className="mt-24 rounded-3xl bg-[#faf7f2] px-6 py-20 text-center sm:px-10">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
          Great connections start with a click or scan
        </p>

        <h2 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold text-slate-900 sm:text-5xl">
          The Quickshrink Connections Platform
        </h2>

        <p className="mx-auto mb-10 max-w-3xl text-lg text-slate-600">
          All the products you need to build brand connections, manage links and QR
          Codes, and connect with audiences everywhere, in a single unified platform.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition">
            Get started for free →
          </button>

          <button className="flex items-center gap-2 rounded-full border-2 border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition">
            Get a quote →
          </button>
        </div>
      </section>
      <section className="mt-24 rounded-3xl bg-[#faf7f2] px-6 py-20">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm uppercase tracking-widest text-slate-500">
              Great connections start with a click or scan
            </p>
            <h2 className="mb-5 text-4xl font-extrabold text-slate-900">
              The Quickshrink Connections Platform
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              All the products you need to manage links, QR codes, and audience
              connections — in one platform.
            </p>
          </div>

          {/* Cards */}
          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-3 items-stretch">

            {/* URL SHORTENER */}
            <div
              onMouseEnter={() => setActiveCard("url")}
              onMouseLeave={() => setActiveCard(null)}
              className={`
                relative h-[420px] overflow-hidden rounded-3xl bg-white p-8
                transition-all duration-300 ease-out
                ${activeCard === "url" ? "shadow-2xl scale-105 z-10" : ""}
                ${activeCard && activeCard !== "url" ? "opacity-50 scale-95" : ""}
              `}

            >
              {/* TOP */}
              <div>
                <h3 className="mb-3 flex items-center justify-between text-xl font-bold text-slate-900">
                  URL Shortener

                </h3>

                <p className="text-slate-600">
                  Make every link more powerful with branded short URLs and analytics.
                </p>
              </div>

              {/* BOTTOM */}
              <div
                className={`
        absolute inset-x-0 bottom-0 px-8 pb-8
        transition-all duration-300 ease-out
        ${activeCard === "url" ? "max-h-56 opacity-100" : "max-h-0 opacity-0"}
        overflow-hidden
      `}
              >
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Branded short links</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Click analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Link management</span>
                  </li>
                </ul>


                <button className="mt-5 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Get started
                </button>
              </div>
            </div>

            {/* QR CODES — PRIMARY */}
            <div
              onMouseEnter={() => setActiveCard("qr")}
              onMouseLeave={() => setActiveCard(null)}
              className={`
      relative h-[420px] overflow-hidden rounded-3xl bg-white p-8
      transition-all duration-300 ease-out
      ${activeCard === "qr" ? "shadow-2xl scale-110 z-10" : ""}
      ${activeCard && activeCard !== "qr" ? "opacity-50 scale-95" : ""}
    `}
            >
              {/* TOP */}
              <div>
                <h3 className="mb-3 flex items-center justify-between text-xl font-bold text-slate-900">
                  QR Codes
                </h3>

                <p className="text-slate-600">
                  QR Code solutions for every business and brand experience.
                </p>
              </div>

              {/* BOTTOM */}
              <div
                className={`
        absolute inset-x-0 bottom-0 px-8 pb-8
        transition-all duration-300 ease-out
        ${activeCard === "qr" ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}
        overflow-hidden
      `}
              >
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Fully customizable QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Dynamic QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Multiple destinations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Advanced analytics & tracking</span>
                  </li>
                </ul>

                <div className="mt-6 flex flex-col gap-3">
                  <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    Get started for free
                  </button>
                  <button className="rounded-full border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            {/* LANDING PAGES */}
            <div
              onMouseEnter={() => setActiveCard("lp")}
              onMouseLeave={() => setActiveCard(null)}
              className={`
    relative h-[420px] overflow-hidden rounded-3xl bg-white p-8
    transition-all duration-300 ease-out
    ${activeCard === "lp" ? "shadow-2xl scale-110 z-10" : ""}
    ${activeCard && activeCard !== "lp" ? "opacity-50 scale-95" : ""}
    `}

            >
              {/* TOP */}
              <div>
                <h3 className="mb-3 flex items-center justify-between text-xl font-bold text-slate-900">
                  Landing Pages

                </h3>

                <p className="text-slate-600">
                  Create fast, mobile-optimized landing pages in minutes.
                </p>
              </div>

              {/* BOTTOM */}
              <div
                className={`
        absolute inset-x-0 bottom-0 px-8 pb-8
        transition-all duration-300 ease-out
        ${activeCard === "lp" ? "max-h-56 opacity-100" : "max-h-0 opacity-0"}
        overflow-hidden
      `}
              >
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Mobile optimized</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Easy builder</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-sm" />
                    <span>Conversion focused</span>
                  </li>
                </ul>

                <button className="mt-5 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Learn more
                </button>
              </div>
            </div>

          </div>


        </div>
      </section>




    </div>
  );
};

export default Home;

