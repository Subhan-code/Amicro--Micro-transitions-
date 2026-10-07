import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const rawUrl = req.url || '';
        if (!rawUrl.startsWith('/api/')) {
          return next();
        }

        try {
          const urlObj = new URL(rawUrl, `http://${req.headers.host || 'localhost:3000'}`);
          const pathname = urlObj.pathname;

          let apiFile = '';
          if (pathname === '/api/checkout' || pathname === '/api/checkout/') {
            apiFile = './api/checkout.ts';
          } else if (pathname === '/api/checkout-status' || pathname === '/api/checkout-status/') {
            apiFile = './api/checkout-status.ts';
          } else if (pathname === '/api/sponsors' || pathname === '/api/sponsors/') {
            apiFile = './api/sponsors.ts';
          } else if (pathname === '/api/webhooks/polar' || pathname === '/api/webhooks/polar/') {
            apiFile = './api/webhooks/polar.ts';
          } else if (pathname === '/api/polar/verify' || pathname === '/api/polar/verify/' || pathname === '/api/sponsor/verify' || pathname === '/api/sponsor/verify/') {
            apiFile = './api/sponsor/verify.ts';
          } else if (pathname === '/api/polar/claim' || pathname === '/api/polar/claim/' || pathname === '/api/sponsor/submit' || pathname === '/api/sponsor/submit/') {
            apiFile = './api/sponsor/submit.ts';
          } else if (pathname === '/api/admin/sponsors' || pathname === '/api/admin/sponsors/') {
            apiFile = './api/admin/sponsors.ts';
          } else if (pathname === '/api/webhooks/dodo' || pathname === '/api/webhooks/dodo/') {
            apiFile = './api/webhooks/dodo.ts';
          } else {
            return next();
          }

          const query: Record<string, string> = {};
          urlObj.searchParams.forEach((v, k) => {
            query[k] = v;
          });

          let body: any = null;
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const rawBody = Buffer.concat(chunks).toString('utf-8');
            try {
              body = JSON.parse(rawBody);
            } catch {
              body = rawBody;
            }
            req.rawBody = rawBody;
          }

          const vercelReq = Object.assign(req, {
            query,
            body,
            cookies: {},
          });

          const vercelRes = Object.assign(res, {
            status(code: number) {
              res.statusCode = code;
              return vercelRes;
            },
            json(data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return vercelRes;
            },
            send(data: any) {
              res.end(data);
              return vercelRes;
            },
          });

          const mod = await server.ssrLoadModule(apiFile);
          const handler = mod.default || mod;
          await handler(vercelReq, vercelRes);
        } catch (err) {
          console.error('[API Dev Server] Handler error:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal API server error', details: String(err) }));
          }
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin()],
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('motion')) {
                return 'vendor-framework';
              }
              if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
