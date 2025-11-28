
const blocks = [
  { name: "Background",   cls: "bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)]" },
  { name: "Surface",      cls: "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]" },
  { name: "Elevated",     cls: "bg-[var(--color-elevated)] text-[var(--color-text)] border border-[var(--color-border)]" },
  { name: "Text",         cls: "bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)]" },
  { name: "Muted (text)", cls: "bg-[var(--color-background)] text-[var(--color-muted)] border border-[var(--color-border)]" },
  { name: "Navbar link",  cls: "bg-[var(--color-background)] text-[var(--color-navbar-link)] border border-[var(--color-border)]" },
  { name: "Primary",      cls: "bg-[var(--color-primary)] text-[var(--color-onprimary)]" },
  { name: "Hover",        cls: "bg-[var(--color-hover)] text-[var(--color-text)] border border-[var(--color-border)]" },
  { name: "Hover strong", cls: "bg-[var(--color-hover-strong)] text-[var(--color-text)] border border-[var(--color-border)]" },

  { name: "Brand",        cls: "bg-brand text-white" },
  { name: "Brand strong", cls: "bg-brand-strong text-white" },
  { name: "Gray 50",      cls: "bg-gray-50 text-[var(--color-text-on-light)] border border-[var(--color-border)]" },
  { name: "Gray 100",     cls: "bg-gray-100 text-[var(--color-text-on-light)] border border-[var(--color-border)]" },
  { name: "Gray 800",     cls: "bg-gray-800 text-[var(--color-text-on-dark)]" },
  { name: "Gray 900",     cls: "bg-gray-900 text-[var(--color-text-on-dark)]" },
];

export default function ColorGuide() {
  return (
    <main className="min-h-screen p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">🎨 Guía rápida de colores</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Paleta minimalista (light/dark). Cambia el sistema a modo oscuro para
          ver los cambios.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blocks.map(({ name, cls }) => (
          <div
            key={name}
            className={`rounded-lg h-28 px-4 py-3 flex flex-col justify-between shadow-sm ${cls}`}
          >
            <div className="text-sm font-semibold">{name}</div>
            <div className="text-xs opacity-80">
              <code>{cls}</code>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
