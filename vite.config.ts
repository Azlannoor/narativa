import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Pasang header keamanan dasar sesuai Task 3.2
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
            res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
            res.setHeader('X-XSS-Protection', '1; mode=block');

            // 1. Rute statis robots.txt & sitemap.xml
            const currentDir = import.meta.dirname || process.cwd();
            if (req.url === '/robots.txt') {
              try {
                const fs = await import('fs');
                const robotsContent = fs.readFileSync(path.resolve(currentDir, 'public/robots.txt'), 'utf-8');
                res.setHeader('Content-Type', 'text/plain');
                res.end(robotsContent);
                return;
              } catch {
                res.setHeader('Content-Type', 'text/plain');
                res.end("User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /skrip/\nDisallow: /library/\n");
                return;
              }
            }

            if (req.url === '/sitemap.xml') {
              try {
                const fs = await import('fs');
                const sitemapContent = fs.readFileSync(path.resolve(currentDir, 'public/sitemap.xml'), 'utf-8');
                res.setHeader('Content-Type', 'application/xml');
                res.end(sitemapContent);
                return;
              } catch {
                res.statusCode = 404;
                res.end();
                return;
              }
            }

            // 2. Rute API Backend (/api/library, /api/broll, /api/webhooks/clerk)
            if (req.url && (req.url.startsWith('/api/library') || req.url.startsWith('/api/broll') || req.url.startsWith('/api/webhooks/clerk'))) {
              try {
                let routeModulePath = '/app/api/library/route.ts';
                if (req.url.startsWith('/api/broll')) {
                  routeModulePath = '/app/api/broll/route.ts';
                } else if (req.url.startsWith('/api/webhooks/clerk')) {
                  routeModulePath = '/app/api/webhooks/clerk/route.ts';
                }

                const routeModule = await server.ssrLoadModule(routeModulePath);
                const protocol = req.headers['x-forwarded-proto'] || 'http';
                const host = req.headers.host || 'localhost:3000';
                const url = `${protocol}://${host}${req.url}`;

                let bodyData: any = undefined;
                if (req.method === 'POST') {
                  const buffers = [];
                  for await (const chunk of req) {
                    buffers.push(chunk);
                  }
                  bodyData = Buffer.concat(buffers).toString();
                }

                const webReq = new Request(url, {
                  method: req.method,
                  headers: req.headers as any,
                  body: bodyData,
                });

                const handler = req.method === 'POST' ? routeModule.POST : routeModule.GET;
                if (!handler) {
                  res.statusCode = 405;
                  res.end(JSON.stringify({ error: 'Method not allowed' }));
                  return;
                }

                const webRes = await handler(webReq);
                res.statusCode = webRes.status;
                webRes.headers.forEach((val: string, key: string) => {
                  res.setHeader(key, val);
                });
                const body = await webRes.text();
                res.end(body);
                return;
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
                return;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || process.cwd(), '.'),
        'next/image': path.resolve(import.meta.dirname || process.cwd(), './src/components/ui/next-image.tsx'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
