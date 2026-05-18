import Link from "next/link";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  number?: string;
}

/**
 * Reusable page header for each top-level route.
 * - kicker: small uppercase category label above the title (e.g. "참가 안내")
 * - title:  the page H1
 * - subtitle: short description under the title
 * - number: optional "01"–"09" badge (kept for sites that want section numbers)
 */
export default function PageHeader({ kicker, title, subtitle, number }: PageHeaderProps) {
  return (
    <header className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="text-[13px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Home
          </Link>
          {kicker && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                {kicker}
              </span>
            </>
          )}
        </div>

        <div className="flex items-baseline gap-4">
          {number && (
            <span className="text-3xl lg:text-4xl font-bold text-blue-600 tabular-nums">
              {number}
            </span>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
        </div>

        {subtitle && (
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
