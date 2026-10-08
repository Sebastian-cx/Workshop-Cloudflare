import React, { useState } from 'react';
import { Terminal, Copy, Check, Cloud, Database, Shield, Cpu, Code2 } from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Install Dependencies & Local Test',
      description: 'Run standard npm scripts to start the Vite client in development mode.',
      code: `npm install\nnpm run dev`,
    },
    {
      title: '2. Login to Cloudflare Wrangler',
      description: 'Authenticate your local environment with your Cloudflare account.',
      code: `npx wrangler login`,
    },
    {
      title: '3. Create Cloudflare D1 Database',
      description: 'Create a new serverless SQLite D1 database instance on Cloudflare.',
      code: `npx wrangler d1 create osint-workshop-db`,
    },
    {
      title: '4. Apply Database Migrations',
      description: 'Initialize tables for workshop settings, field configs, and registrations.',
      code: `# Local Development Migration:\nnpm run d1:migrate:local\n\n# Production D1 Migration:\nnpm run d1:migrate:prod`,
    },
    {
      title: '5. Deploy Application to Cloudflare Workers / Pages',
      description: 'Build the Vite client and deploy the Worker API backend.',
      code: `npm run deploy`,
    },
    {
      title: '6. Configure Admin Password Secret (Optional)',
      description: 'Set a custom secret password for the admin dashboard in production.',
      code: `npx wrangler secret put ADMIN_PASSWORD`,
    },
    {
      title: '7. Monitor Production Logs & Diagnostics',
      description: 'Stream live real-time Worker logs from Cloudflare.',
      code: `npx wrangler tail`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
          <Cloud className="w-4 h-4" />
          <span>CLOUDFLARE DEPLOYMENT CENTER</span>
        </div>
        <h3 className="text-xl font-bold text-slate-100 font-sans">
          Cloudflare Workers & D1 Integration Guide
        </h3>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Complete CLI command suite for initializing D1 database, configuring Wrangler bindings, and deploying to Cloudflare Pages/Workers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Architecture Specs */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-slate-100 font-bold text-sm font-sans">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Deployment Stack & Bindings</span>
          </div>
          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Frontend Hosting:</span>
              <span className="text-cyan-400 font-bold">Cloudflare Pages / Workers Assets</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">API Worker:</span>
              <span className="text-cyan-400 font-bold">Cloudflare Workers (ES Modules)</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Database Binding:</span>
              <span className="text-cyan-400 font-bold">DB (Cloudflare D1 SQLite)</span>
            </li>
            <li className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Bot Protection:</span>
              <span className="text-cyan-400 font-bold">Cloudflare Turnstile (Optional)</span>
            </li>
          </ul>
        </div>

        {/* Local Mock Mode Note */}
        <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm font-sans">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Dual-Mode Local & Production Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            The platform includes an automatic fallback system. In local development (<code className="text-cyan-300 font-mono">npm run dev</code>), if the live Cloudflare Worker API is not reachable, the system uses a reactive LocalStorage mock so you can test all admin toggles, registrations, and CSV exports locally out of the box!
          </p>
        </div>

      </div>

      {/* Step by step command list */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100 font-sans">{step.title}</h4>
              <button
                onClick={() => copyToClipboard(step.code, idx)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition font-mono text-xs"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 font-sans">{step.description}</p>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto">
              <code>{step.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
