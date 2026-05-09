export function renderDocs(env) {
    const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWRP API // Reference</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Oswald:wght@500;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'tac-dark':   '#050505',
                        'tac-panel':  '#0a0a0a',
                        'tac-card':   '#0d0d0d',
                        'tac-border': 'rgba(255,255,255,0.06)',
                        'tac-accent': '#8b1919', // Red accent
                        'tac-red':    '#ef4444',
                        'tac-green':  '#10b981',
                        'tac-blue':   '#3b82f6',
                        'tac-purple': '#a855f7',
                        'tac-muted':  '#52525b',
                    },
                    fontFamily: {
                        'sans':    ['Inter', 'sans-serif'],
                        'display': ['Oswald', 'sans-serif'],
                        'mono':    ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <style>
        body { background: #050505; color: #a1a1aa; }
        .ep { background: #0d0d0d; border: 1px solid rgba(255,255,255,0.06); }
        .ep-header { cursor: pointer; user-select: none; transition: background 0.15s; }
        .ep-header:hover { background: rgba(255,255,255,0.03); }
        .ep-body { display: none; border-top: 1px solid rgba(255,255,255,0.06); }
        .ep.open .ep-body { display: block; }
        .ep.open .ep-chevron { transform: rotate(180deg); }
        .ep-chevron { transition: transform 0.2s; }
        .m-get    { color:#10b981; border-color:rgba(16,185,129,.25); background:rgba(16,185,129,.07); }
        pre { background:#000; border:1px solid rgba(255,255,255,0.06); padding:.85rem 1rem; font-size:.72rem; line-height:1.6; overflow-x:auto; border-radius:2px; }
        .param-table { width:100%; font-family:'JetBrains Mono',monospace; font-size:.7rem; border-collapse:collapse; }
        .param-table th { color:#52525b; text-transform:uppercase; letter-spacing:.1em; padding:.5rem .75rem; text-align:left; border-bottom:1px solid rgba(255,255,255,0.06); font-weight:500; }
        .param-table td { padding:.5rem .75rem; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:top; }
        .nav-link { display:flex; align-items:center; gap:.65rem; padding:.5rem .75rem; font-family:'JetBrains Mono',monospace; font-size:.68rem; color:#52525b; transition:all .15s; border-left:2px solid transparent; text-decoration:none; }
        .nav-link:hover { color:#a1a1aa; }
        .nav-link.active { color:#8b1919; border-left-color:#8b1919; background:rgba(139,25,25,0.05); }
    </style>
</head>
<body class="flex min-h-screen font-sans">
    <!-- Sidebar -->
    <aside id="sidebar" class="fixed inset-y-0 left-0 w-60 bg-tac-panel border-r border-tac-border flex flex-col z-50">
        <div class="h-14 flex items-center px-5 border-b border-tac-border gap-2.5 shrink-0">
            <div class="absolute left-0 top-0 h-14 w-0.5 bg-tac-accent"></div>
            <i data-lucide="terminal" class="w-4 h-4 text-tac-accent"></i>
            <span class="font-display text-base font-bold tracking-widest text-white uppercase">SWRP API</span>
        </div>
        <nav class="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            <p class="font-mono text-[9px] text-tac-muted tracking-[.2em] uppercase px-2 pb-2 pt-1">Endpoints</p>
            <a href="#staff" class="nav-link active"><i data-lucide="users" class="w-3.5 h-3.5 shrink-0"></i>Staff</a>
        </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1 ml-60 min-w-0">
        <div class="px-6 md:px-10 py-10 max-w-5xl mx-auto w-full">
            <div class="mb-10">
                <h1 class="font-display text-3xl font-bold text-white tracking-wider uppercase mb-1">API Reference</h1>
                <p class="font-mono text-[11px] text-tac-muted">SWRP Website · Cloudflare Workers</p>
            </div>

            <section id="staff" class="mb-12 scroll-mt-20">
                <div class="flex items-center gap-4 mb-6">
                    <i data-lucide="users" class="w-4 h-4 text-tac-accent"></i>
                    <h3 class="font-display text-xl font-bold text-white uppercase tracking-wider">Staff</h3>
                    <div class="flex-1 h-px bg-tac-border"></div>
                </div>

                <!-- GET /api/v1/staff -->
                <div class="ep open">
                    <div class="ep-header p-4 flex flex-wrap items-center gap-2.5" onclick="toggle(this.parentElement)">
                        <span class="m-get px-2.5 py-0.5 font-mono text-[10px] font-bold border uppercase tracking-wider">GET</span>
                        <code class="font-mono text-[13px] font-semibold text-white">/api/v1/staff</code>
                        <span class="font-mono text-[10px] text-tac-muted flex-1 min-w-0 truncate">Fetch staff members grouped by rank</span>
                        <i data-lucide="chevron-down" class="ep-chevron w-4 h-4 text-tac-muted shrink-0"></i>
                    </div>
                    <div class="ep-body px-6 py-5 bg-black/20 space-y-4">
                        <div>
                            <p class="font-mono text-[9px] text-tac-muted uppercase tracking-widest mb-2">Description</p>
                            <p class="font-sans text-xs text-zinc-400 leading-relaxed">
                                Returns a list of staff members grouped by their rank in the Roblox group. Data is cached for 2 minutes.
                            </p>
                        </div>
                        <div>
                            <p class="font-mono text-[9px] text-tac-muted uppercase tracking-widest mb-2">Response 200</p>
                            <pre class="text-tac-green"><code>{
  "Ownership": [
    {
      "id": 12345,
      "name": "Username",
      "displayName": "Display Name"
    }
  ],
  "Developer": []
}</code></pre>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <script>
        lucide.createIcons();
        function toggle(el) {
            el.classList.toggle('open');
        }
    </script>
</body>
</html>`;
    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
}
