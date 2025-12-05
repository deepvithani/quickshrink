import { useEffect, useState } from 'react'
import { FaGoogle, FaFacebookF, FaTwitter, FaMicrosoft } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

const TABS = {
  SHORT_LINK: 'short-link',
  QR_CODE: 'qr-code',
}

const validateUrl = (value) => {
  if (!value.trim()) {
    return 'Please paste a valid URL.'
  }

  let parsed
  try {
    parsed = new URL(value.trim())
  } catch {
    return 'That does not look like a valid URL. Include https:// or http://'
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return 'Only HTTP and HTTPS URLs are supported.'
  }

  return parsed.toString()
}

function App() {
  const [showLoader, setShowLoader] = useState(true)
  const [authMode, setAuthMode] = useState(null) // 'login' | 'signup' | null
  const [activeTab, setActiveTab] = useState(TABS.SHORT_LINK)

  // Short link state (auto-generated codes only)
  const [longUrl, setLongUrl] = useState('')
  const [isSubmittingShort, setIsSubmittingShort] = useState(false)
  const [shortError, setShortError] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  // Standalone QR state
  const [qrUrl, setQrUrl] = useState('')
  const [isSubmittingQr, setIsSubmittingQr] = useState(false)
  const [qrError, setQrError] = useState('')
  const [qrSvg, setQrSvg] = useState('')

  const handleShortenSubmit = async (event) => {
    event.preventDefault()
    setShortError('')
    setShortUrl('')

    const validated = validateUrl(longUrl)
    if (typeof validated === 'string' && validated.startsWith('http') === false) {
      setShortError(validated)
      return
    }

    const normalizedUrl = validated

    setIsSubmittingShort(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: normalizedUrl,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || 'Unable to shorten URL right now.')
      }

      const payload = await response.json()
      setShortUrl(payload.shortUrl)
    } catch (err) {
      setShortError(err.message || 'Unexpected error, please try again.')
    } finally {
      setIsSubmittingShort(false)
    }
  }

  const handleQrSubmit = async (event) => {
    event.preventDefault()
    setQrError('')
    setQrSvg('')

    const validated = validateUrl(qrUrl)
    if (typeof validated === 'string' && validated.startsWith('http') === false) {
      setQrError(validated)
      return
    }

    const normalizedUrl = validated
    setIsSubmittingQr(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizedUrl }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || 'Unable to generate QR code right now.')
      }

      const payload = await response.json()
      if (payload.qrCodeSvg) {
        setQrSvg(payload.qrCodeSvg)
      }
    } catch (err) {
      setQrError(err.message || 'Unexpected error, please try again.')
    } finally {
      setIsSubmittingQr(false)
    }
  }

  const handleCopy = async () => {
    if (!shortUrl) return
    try {
      await navigator.clipboard.writeText(shortUrl)
    } catch {
      // ignore clipboard errors
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1100)
    return () => clearTimeout(timer)
  }, [])

  const renderLoader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="relative flex flex-col items-center gap-5 text-slate-100">
        <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -right-10 -bottom-14 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <p className="text-3xl font-black tracking-[0.2em] text-white drop-shadow-lg sm:text-4xl">
            QUICKSHRINK
          </p>
          <div className="flex items-center justify-center gap-3 text-4xl sm:text-5xl">
            <span className="animate-pulse text-brand-200">⟮</span>
            <span className="h-7 w-7 animate-spin rounded-full border-4 border-slate-800 border-t-brand-400" />
            <span className="animate-pulse text-brand-200">⟯</span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
            Crafting your experience
          </p>
        </div>
      </div>
    </div>
  )

  const AuthField = ({ id, label, placeholder, type = 'text', rightIcon }) => (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="block w-full rounded border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-slate-400">{rightIcon}</span>
        )}
      </div>
    </div>
  )

  const SocialRow = () => (
    <div className="flex flex-wrap gap-2">
      {[
        { label: 'Google', Icon: FaGoogle },
        { label: 'Facebook', Icon: FaFacebookF },
        { label: 'X (Twitter)', Icon: FaXTwitter },
        { label: 'Microsoft', Icon: FaMicrosoft },
      ].map(({ label, Icon }) => (
        <button
          key={label}
          type="button"
          className="flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand-400 hover:text-brand-700"
        >
          <Icon className="text-base" />
          {label}
        </button>
      ))}
    </div>
  )

  const renderAuthPage = (mode) => {
    if (!mode) return null
    const isLogin = mode === 'login'

    return (
      <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/70 backdrop-blur">
        <div className="min-h-screen bg-slate-100 shadow-2xl">
          <div className="flex justify-end px-4 py-3">
            <button
              type="button"
              onClick={() => setAuthMode(null)}
              className="rounded-full px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
            >
              ✕
            </button>
          </div>

          <div className="grid min-h-[calc(100vh-64px)] gap-0 border-t border-slate-200 bg-white lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col px-8 pb-12 pt-6 sm:px-12 sm:pt-10">
              <div className="mb-6 space-y-1">
                <h1 className="text-4xl font-black text-slate-800">{isLogin ? 'Log In' : 'Sign Up'}</h1>
                <p className="text-sm text-slate-600">
                  {isLogin ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        className="font-semibold text-[#0077a8] underline-offset-2 hover:underline"
                        onClick={() => setAuthMode('signup')}
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already a user?{' '}
                      <button
                        type="button"
                        className="font-semibold text-[#0077a8] underline-offset-2 hover:underline"
                        onClick={() => setAuthMode('login')}
                      >
                        Log In
                      </button>
                    </>
                  )}
                </p>
              </div>

              <form className="space-y-4">
                {!isLogin && (
                  <AuthField id="signup-name" label="Name" placeholder="Enter Full Name" />
                )}
                <AuthField id={`${mode}-email`} label="Email" placeholder="Enter Email Address" />
                <AuthField
                  id={`${mode}-password`}
                  label="Password"
                  type="password"
                  placeholder="Enter Password"
                  rightIcon="👁"
                />

                {!isLogin && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="h-1.5 flex-1 rounded bg-gradient-to-r from-slate-300 via-amber-300 to-green-400" />
                      <span>Security</span>
                      <span className="text-slate-500">ⓘ</span>
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" className="rounded border-slate-400 text-brand-500" />
                      <span>Keep me logged in</span>
                    </label>
                    <button type="button" className="font-semibold text-[#0077a8] hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded bg-slate-400 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-500"
                >
                  {isLogin ? 'Log In' : 'Sign Up'}
                </button>

                {!isLogin && (
                  <p className="text-[12px] leading-relaxed text-slate-500">
                    By Signing Up, you agree to our Terms of Service, Privacy Policy, and Use of Cookies.
                  </p>
                )}
              </form>

              <div className="my-6 flex items-center gap-4 text-sm font-semibold text-slate-500">
                <div className="h-px flex-1 bg-slate-300" />
                <span>or</span>
                <div className="h-px flex-1 bg-slate-300" />
              </div>

              <SocialRow />
            </div>

            <div className="relative overflow-hidden bg-gradient-to-b from-[#0c7ea3] via-[#0b5f88] to-[#063b58] text-white">
              <div className="absolute inset-0 opacity-30" />
              <div className="relative flex h-full flex-col items-center justify-center px-6 py-10 text-center sm:px-8">
                <div className="mb-6 flex h-64 w-64 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                  <div className="h-44 w-44 rounded-full bg-white/20 backdrop-blur" />
                </div>
                <h3 className="text-2xl font-bold">
                  {isLogin ? 'Welcome Back!' : 'Amplify Your Success'}
                </h3>
                <p className="mt-3 max-w-md text-sm text-white/80">
                  {isLogin
                    ? 'Your dashboard is waiting—shorten, track, and share smarter.'
                    : 'Create data-driven shortened links and branded QR codes with QuickShrink.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTabs = () => (
    <div className="mb-6 flex rounded-full bg-slate-900/60 p-1 text-sm text-slate-300">
      <button
        type="button"
        onClick={() => setActiveTab(TABS.SHORT_LINK)}
        className={`flex-1 rounded-full px-4 py-2 transition ${
          activeTab === TABS.SHORT_LINK
            ? 'bg-slate-950 text-slate-50 shadow-sm'
            : 'hover:text-slate-50'
        }`}
      >
        Short Link
      </button>
      <button
        type="button"
        onClick={() => setActiveTab(TABS.QR_CODE)}
        className={`flex-1 rounded-full px-4 py-2 transition ${
          activeTab === TABS.QR_CODE
            ? 'bg-slate-950 text-slate-50 shadow-sm'
            : 'hover:text-slate-50'
        }`}
      >
        QR Code
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950/90 text-slate-100">
      {showLoader && renderLoader()}
      {renderAuthPage(authMode)}

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.15),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.08),transparent_30%)]" />

      <header className="sticky top-0 z-30 w-full bg-[#0b3c50] text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black tracking-[0.18em] text-white">QUICKSHRINK</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {['Plans', 'Features', 'Domains', 'Resources'].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded px-2 py-1 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0b3c50] transition hover:shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-10">

        <main className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] md:items-start">
          <section>
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-soft sm:p-8">
              <div className="pointer-events-none absolute inset-x-10 -top-32 -z-10 h-56 rounded-full bg-brand-500/20 blur-3xl" />

              <div className="mb-4 space-y-2 sm:mb-5">
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  Turn long URLs into shareable links or scannable codes.
                </h1>
                <p className="max-w-xl text-sm text-slate-400 sm:text-[0.925rem]">
                  Choose whether you want a classic short link or a standalone QR code.
                  Each action talks to its own dedicated API endpoint.
                </p>
              </div>

              {renderTabs()}

              {activeTab === TABS.SHORT_LINK ? (
                <form onSubmit={handleShortenSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="long-url"
                      className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                    >
                      Paste your long link
                    </label>
                    <div className="relative">
                      <input
                        id="long-url"
                        type="url"
                        required
                        value={longUrl}
                        onChange={(event) => setLongUrl(event.target.value)}
                        placeholder="https://example.com/my-long-url"
                        className="block w-full rounded-2xl border border-slate-800/90 bg-slate-900/50 px-4 py-3.5 text-sm text-slate-100 shadow-inner outline-none ring-2 ring-transparent transition focus:border-brand-500/60 focus:ring-brand-500/30"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-400 ring-1 ring-slate-800">
                          Required
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingShort}
                    className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(8,145,178,0.45)] transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none"
                  >
                    {isSubmittingShort ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-950" />
                        <span>Getting your short link…</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <span>Get your link for free</span>
                      </span>
                    )}
                  </button>

                  {shortError && (
                    <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-200">
                      {shortError}
                    </div>
                  )}
                </form>
              ) : (
                <form onSubmit={handleQrSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="qr-url"
                      className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                    >
                      Enter your QR Code destination
                    </label>
                    <div className="relative">
                      <input
                        id="qr-url"
                        type="url"
                        required
                        value={qrUrl}
                        onChange={(event) => setQrUrl(event.target.value)}
                        placeholder="https://example.com/my-long-url"
                        className="block w-full rounded-2xl border border-slate-800/90 bg-slate-900/50 px-4 py-3.5 text-sm text-slate-100 shadow-inner outline-none ring-2 ring-transparent transition focus:border-brand-500/60 focus:ring-brand-500/30"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-400 ring-1 ring-slate-800">
                          Required
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingQr}
                    className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(8,145,178,0.45)] transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none"
                  >
                    {isSubmittingQr ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-950" />
                        <span>Creating your QR code…</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <span>Get your QR Code for free</span>
                      </span>
                    )}
                  </button>

                  {qrError && (
                    <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-200">
                      {qrError}
                    </div>
                  )}
                </form>
              )}
            </div>
          </section>

          <aside className="space-y-4 md:space-y-6">
            {activeTab === TABS.SHORT_LINK ? (
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-soft sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Short link result
                  </p>
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] text-slate-500 ring-1 ring-slate-800">
                    Redirect handled by backend
                  </span>
                </div>

                {shortUrl ? (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="group flex w-full items-center justify-between rounded-2xl border border-brand-500/40 bg-slate-950/70 px-4 py-3 text-left text-sm text-slate-100 shadow-inner hover:border-brand-400/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{shortUrl}</p>
                        <p className="mt-1 text-[0.7rem] text-slate-500">
                          Click to copy and share anywhere you want.
                        </p>
                      </div>
                      <span className="ml-3 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-500/90 text-slate-950 shadow-md group-active:scale-95">
                        ⧉
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm text-slate-500">
                    <p className="text-[0.82rem] text-slate-300">
                      Your shortened link will appear here after you paste a URL and click{' '}
                      <span className="font-medium text-brand-300">Get your link</span>.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-soft sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    QR code result
                  </p>
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] text-slate-500 ring-1 ring-slate-800">
                    No database write
                  </span>
                </div>

                {qrSvg ? (
                  <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        QR Code
                      </p>
                      <p className="text-[0.7rem] text-slate-500">
                        Download or scan directly for your campaign.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <div
                        className="inline-flex rounded-2xl bg-white p-3 shadow-md"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: qrSvg }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm text-slate-500">
                    <p className="text-[0.82rem] text-slate-300">
                      Paste a destination URL on the QR tab and click{' '}
                      <span className="font-medium text-brand-300">Get your QR Code</span>{' '}
                      to see it here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
