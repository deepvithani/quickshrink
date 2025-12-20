import { useState } from "react";
import Tabs from "../components/Tabs";
import ShortenForm from "../components/ShortenForm";
import QrForm from "../components/QrForm";
import ShortResult from "../components/ShortResult";
import QrResult from "../components/QrResult";
import { validateUrl } from "../utils/validateUrl";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import UseCasesSlider from "../components/UseCasesSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { FaQuoteLeft } from 'react-icons/fa';
import Dashimag from '../../src/assets/dashboard.png'
import Footer from "../components/Footer";

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
  const testimonials = [
    {
      quote:
        "When it came to deciding on a platform to use for generating all of our QR Codes, there was a general consensus among the team—of course we should use Bitly! We didn’t even give it a second thought.",
      name: "Melody Park",
      role: "Marketing Lead at Smalls",
      image: "/images/user1.jpg",
    },
    {
      quote:
        "When customers receive a status update from us, they can click on our encrypted link through the Bitly short link and directly view their order without having to log in, which is a smoother user experience and still keeps their information secure.",
      name: "Phil Gergen",
      role: "Chief Information Officer at Koozie Group",
      image: "/images/user2.jpg",
    },
  ];


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
    <>
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
          <div
            className="
    grid gap-6 items-stretch
    grid-cols-3
    max-[1080px]:grid-cols-1
  "
          >


            {/* URL SHORTENER */}
            <div
              onMouseEnter={() => setActiveCard("url")}
              onMouseLeave={() => setActiveCard(null)}
              className={`
         relative h-[420px] overflow-hidden rounded-3xl bg-white p-8
                transition-all duration-300 ease-out card
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


                <div className="pt-3 flex flex-col gap-3 buttons-container">
                  <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    Get started for free
                  </button>
                  <button className="rounded-full border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            {/* QR CODES — PRIMARY */}
            <div
              onMouseEnter={() => setActiveCard("qr")}
              onMouseLeave={() => setActiveCard(null)}
              className={`
relative h-[420px] overflow-hidden rounded-3xl bg-white p-8
                transition-all duration-300 ease-out card
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

                <div className="pt-3 flex flex-col gap-3 buttons-container">
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
                transition-all duration-300 ease-out card
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

                <div className="pt-3 flex flex-col gap-3 buttons-container">
                  <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    Get started for free
                  </button>
                  <button className="rounded-full border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

          </div>


        </div>
      </section>
      {/* STATS SECTION */}
      <section className="mt-24 bg-[#faf7f2] py-24">
        <div className="mx-auto max-w-7xl px-6">

          {/* Heading */}
          <h2 className="mb-16 text-center text-4xl font-extrabold text-[#0a2540] sm:text-5xl">
            Adopted and loved by millions of users for <br className="hidden sm:block" />
            over a decade
          </h2>

          {/* Cards Grid */}
          <div
            className="
        grid gap-6
        grid-cols-4
        max-[1080px]:grid-cols-2
        max-[640px]:grid-cols-1
      "
          >
            {/* CARD 1 */}
            <div className="rounded-3xl bg-[#efece6] p-8">
              <div className="mb-6 text-3xl">🌍</div>
              <p className="mb-2 text-5xl font-extrabold text-[#0a2540]">600K+</p>
              <p className="text-lg text-[#0a2540]">
                Global paying customers
              </p>
            </div>

            {/* CARD 2 */}
            <div className="rounded-3xl bg-[#efece6] p-8">
              <div className="mb-6 text-3xl">🔗</div>
              <p className="mb-2 text-5xl font-extrabold text-[#0a2540]">256M</p>
              <p className="text-lg text-[#0a2540]">
                Links & QR Codes created monthly
              </p>
            </div>

            {/* CARD 3 */}
            <div className="rounded-3xl bg-[#efece6] p-8">
              <div className="mb-6 text-3xl">❤️</div>
              <p className="mb-2 text-5xl font-extrabold text-[#0a2540]">800+</p>
              <p className="text-lg text-[#0a2540]">
                App integrations
              </p>
            </div>

            {/* CARD 4 */}
            <div className="rounded-3xl bg-[#efece6] p-8">
              <div className="mb-6 text-3xl">🎯</div>
              <p className="mb-2 text-5xl font-extrabold text-[#0a2540]">10B</p>
              <p className="text-lg text-[#0a2540]">
                Connections (clicks & scans monthly)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BITLY STYLE TESTIMONIAL SLIDER */}
      <section className="mt-24 bg-[#f60] py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">

          {/* Heading */}
          <h2 className="mb-16 text-4xl font-extrabold text-[#0a2540]">
            What our customers are saying
          </h2>

          {/* Slider */}
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".testimonial-next",
              prevEl: ".testimonial-prev",
            }}
            slidesPerView={1}
            loop
            className="relative"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="relative mx-auto max-w-4xl rounded-[32px] bg-[#fffaf4] px-12 py-14 text-left shadow-xl">

                  {/* Quote icon */}
                  <FaQuoteLeft className="mb-2 text-4xl text-[#f60]" />

                  {/* Quote */}
                  <p className="text-xl leading-relaxed text-[#0a2540]">
                    {t.quote}
                  </p>

                  {/* User */}
                  {/* <div className="mt-10 flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-[#0a2540]">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </div> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons */}
          <div className="mt-10 flex justify-center gap-4">
            <button className="testimonial-prev flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#0a2540] text-[#0a2540] hover:bg-[#0a2540] hover:text-white transition">
              <FaArrowLeft />
            </button>
            <button className="testimonial-next flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#0a2540] text-[#0a2540] hover:bg-[#0a2540] hover:text-white transition">
              <FaArrowRight />
            </button>
          </div>

        </div>
      </section>
      <UseCasesSlider />

      {/* MORE THAN A LINK SHORTENER SECTION */}
      <section className="relative overflow-hidden bg-[#071b34] py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">

          {/* Heading */}
          <h2 className="mb-6 text-4xl font-extrabold text-orange-400 sm:text-5xl">
            More than a link shortener
          </h2>

          {/* Sub text */}
          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-200">
            Knowing how your clicks and scans are performing should be as easy as making
            them. Track, analyze, and optimize all your connections in one place.
          </p>

          {/* CTA */}
          <button
            className="
        inline-flex items-center gap-3 rounded-full
        border-2 border-white px-8 py-4
        text-lg font-semibold text-white
        hover:bg-white hover:text-[#071b34]
        transition
      "
          >
            Get started for free
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Dashboard Image */}
        <div className="relative mt-20 flex justify-center px-6">
          <img
            src={Dashimag}  // <-- replace with your image path
            alt="Dashboard preview"
            className="
        w-full max-w-5xl rounded-3xl shadow-2xl
      "
          />
        </div>

        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <span className="absolute left-10 top-20 text-4xl text-slate-400">*</span>
          <span className="absolute right-20 top-32 text-5xl text-slate-400">✦</span>
          <span className="absolute left-10 bottom-24 text-4xl text-slate-400">✱</span>
        </div>
      </section>




    </div>
      <Footer />
      </>
  );
};

export default Home;

