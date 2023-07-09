# Gen Prose Landing page
- This is GenProse's landing page for marketing and the face of the application.
- We will redirect users to app.genprose.com to use the product.

# SEO issues
- This website is deployed on cloudflare pages which adds a trailing "/" after the url causing SEO issues which does not index the page.
- To fix this create a new file in public dir '_redirects' and add the follow:
/*/ /:splat 301