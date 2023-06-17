import { getAllBlogSlugUrls } from "../api/blogs"

const lastPostUpdateDate = new Date().toISOString()

const baseUrl = "https://genprose.com"

export async function get({ request }) {

  const blogs = await getAllBlogSlugUrls()
  const blogUrls = blogs.data.map((d) => `<url>
  <loc>${baseUrl}/blogs/${d.slug}</loc>
  <lastmod>${lastPostUpdateDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
  </url>`)

  const staticPages = `<url>
  <loc>${baseUrl}</loc>
  <lastmod>${lastPostUpdateDate}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
  </url>`

  const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages}
    ${blogUrls}
  </urlset>`

  return { body: xmlString }
}