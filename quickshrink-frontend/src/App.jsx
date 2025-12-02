import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

function App() {
  const [longUrl, setLongUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [qrCodeSvg, setQrCodeSvg] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!longUrl.trim()) {
      setError('Please paste a valid URL to shorten.')
      return
    }

    let parsed
    try {
      parsed = new URL(longUrl.trim())
    } catch {
      setError('That does not look like a valid URL. Include https:// or http://')
      return
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      setError('Only HTTP and HTTPS URLs are supported.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longUrl: parsed.toString(),
          alias: alias.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || 'Unable to shorten URL right now.')
      }

      const payload = await response.json()
      setShortUrl(payload.shortUrl)

      if (payload.qrCodeSvg) {
        setQrCodeSvg(payload.qrCodeSvg)
      } else {
        await loadQrCode(payload.shortUrl)
      }
    } catch (err) {
      setError(err.message || 'Unexpected error, please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadQrCode = async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/qr?url=${encodeURIComponent(url)}`)
      if (!response.ok) return
      const svg = await response.text()
      setQrCodeSvg(svg)
    } catch {
      // silently ignore QR errors; the core feature is shortening
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

  return (
    <div className="min-h-screen bg-slate-950/90 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/50">
              <span className="text-xl font-semibold text-brand-300">QS</span>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-50">
                QuickShrink
              </p>
              <p className="text-xs text-slate-400">
                Lightning-fast URL shortener & QR generator
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-xs text-slate-400 sm:flex">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-3 py-1 ring-1 ring-slate-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>MVP Core • URL → Short link + QR</span>
            </span>
          </div>
        </header>

        <main className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] md:items-start">
          <section>
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-soft sm:p-8">
              <div className="pointer-events-none absolute inset-x-10 -top-32 -z-10 h-56 rounded-full bg-brand-500/20 blur-3xl" />

              <div className="mb-6 space-y-2 sm:mb-8">
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                  Shrink long links into smart, branded redirects.
                </h1>
                <p className="max-w-xl text-sm text-slate-400 sm:text-[0.925rem]">
                  Paste any long URL, optionally choose a custom alias, and get a short
                  link plus QR code in one click. Designed for campaigns, profiles, and
                  product launches.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="long-url"
                    className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                  >
                    Destination URL
                  </label>
                  <div className="relative">
                    <input
                      id="long-url"
                      type="url"
                      required
                      value={longUrl}
                      onChange={(event) => setLongUrl(event.target.value)}
                      placeholder="https://your-long-link.com/campaign/winter-2025?source=..."
                      className="block w-full rounded-2xl border border-slate-800/90 bg-slate-900/50 px-4 py-3.5 text-sm text-slate-100 shadow-inner outline-none ring-2 ring-transparent transition focus:border-brand-500/60 focus:ring-brand-500/30"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-400 ring-1 ring-slate-800">
                        Required
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] md:items-end">
                  <div className="space-y-2">
                    <label
                      htmlFor="alias"
                      className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                    >
                      Custom alias (optional)
                    </label>
                    <div className="flex rounded-2xl border border-slate-800/90 bg-slate-900/40 text-sm text-slate-100 shadow-inner ring-2 ring-transparent focus-within:border-brand-500/60 focus-within:ring-brand-500/30">
                      <div className="hidden items-center gap-1 border-r border-slate-800/80 bg-slate-900/80 px-3 text-xs text-slate-500 sm:flex">
                        <span className="truncate max-w-[9rem]">
                          {window?.location?.origin ?? 'yourdomain.com'}
                        </span>
                        <span>/</span>
                      </div>
                      <input
                        id="alias"
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        spellCheck="false"
                        value={alias}
                        onChange={(event) =>
                          setAlias(event.target.value.replace(/\s+/g, '-').toLowerCase())
                        }
                        placeholder="my-campaign"
                        className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                      />
                    </div>
                    <p className="text-[0.7rem] text-slate-500">
                      Letters, numbers, and dashes only. We&apos;ll check availability
                      when you shorten.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(8,145,178,0.45)] transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-950" />
                        <span>Generating smart link…</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <span>Shorten &amp; create QR</span>
                      </span>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-200">
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.7rem] text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 px-2.5 py-1 ring-1 ring-slate-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>No account required for basic shortening</span>
                </span>
                <span>•</span>
                <span>Designed to extend into analytics, auth &amp; teams later.</span>
              </div>
            </div>
          </section>

          <aside className="space-y-4 md:space-y-6">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-soft sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Result
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

                  {qrCodeSvg && (
                    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                          QR Code
                        </p>
                        <p className="text-[0.7rem] text-slate-500">
                          Scan on mobile to test your redirect.
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <div
                          className="inline-flex rounded-2xl bg-white p-3 shadow-md"
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-sm text-slate-500">
                  <p className="text-[0.82rem] text-slate-300">
                    Your shortened link and QR code will appear here after you paste a URL
                    and click <span className="font-medium text-brand-300">Shorten</span>.
                  </p>
                  <ul className="space-y-1.5 text-[0.75rem] text-slate-500">
                    <li>• Ideal for bio links, offline campaigns, or product packaging.</li>
                    <li>• Works seamlessly with your backend&apos;s redirect logic.</li>
                    <li>• Architected to plug in analytics and auth with minimal changes.</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/40 p-4 text-[0.7rem] text-slate-400 sm:p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Frontend architecture notes
              </p>
              <ul className="space-y-1.5">
                <li>
                  • The app is a single-page React client built on Vite, with Tailwind for
                  design tokens and layout.
                </li>
                <li>
                  • All network calls are routed through <code>VITE_API_BASE_URL</code>,
                  keeping backend environments configurable.
                </li>
                <li>
                  • The UI is intentionally componentizable so you can later extract layout,
                  forms, and result cards into separate modules and add routing (auth,
                  dashboards, admin) without rewrites.
                </li>
              </ul>
            </div>
          </aside>
        </main>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/80 pt-4 text-[0.7rem] text-slate-500">
          <p>QuickShrink • Modern URL shortener experience.</p>
          <p className="text-right">
            Backend: Node/Express · DB: MongoDB / SQL · Short IDs: nanoid · QR: qrcode
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
