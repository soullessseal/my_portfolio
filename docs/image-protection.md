# Image Protection Notes

This project uses a practical image-protection approach rather than trying to block downloads completely.

## What is implemented in code

- All migrated CMS images are rendered through `next/image`.
- Sanity image URLs are resized to display-appropriate widths and capped at `1200px`.
- The frontend requests transformed CDN images instead of original uploads.
- CMS alt text is preserved for SEO and accessibility.
- Migrated images are rendered with `draggable={false}` and context-menu suppression in the shared image component.

## Recommended CDN hotlink protection

If this site is proxied through Cloudflare, add a WAF rule or hotlink policy so third-party origins cannot embed your image URLs directly.

Recommended approach:

1. Proxy the site through Cloudflare.
2. Restrict image requests by `Referer` or approved origins.
3. Allow your production domain, preview domain, and local development domain.
4. Log blocked requests before enforcing hard blocks if you need to validate traffic.

If you later move image delivery behind a custom domain, the same policy becomes easier to manage than on raw vendor CDN URLs.

## Watermark guidance

For sensitive portfolio images:

- Add a subtle corner watermark before upload for client work or premium visuals.
- Keep watermark opacity low enough to avoid harming presentation quality.
- Apply watermark only to images that have reuse risk; do not watermark every asset by default.
