#!/usr/bin/env sh

set -e

which vercel >/dev/null || {
  pnpm i -g vercel@latest
  rm -rf out/ .source/ .next/ .vercel/output/
}
[ -d .vercel ] || {
  vercel pull --yes --environment=production
}
vercel build --prod
vercel deploy --prebuilt --prod --archive=tgz
