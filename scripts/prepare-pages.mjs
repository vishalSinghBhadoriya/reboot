import {copyFile, mkdir, writeFile} from 'node:fs/promises'
import {products} from '../src/data/products.ts'

const build = new URL('../dist/', import.meta.url)
const origin = new URL(process.argv[2])
const routes = [
  'repairs', 'repair-estimator', 'book-repair', 'shop', 'shop/smartphones', 'shop/audio',
  'shop/accessories', 'shop/refurbished', 'compare', 'cart', 'checkout', 'wishlist',
  'about', 'contact', ...products.map(product => 'product/' + product.slug),
]
const index = new URL('index.html', build)

await Promise.all(routes.map(async route => {
  const directory = new URL(route + '/', build)
  await mkdir(directory, {recursive:true})
  await copyFile(index, new URL('index.html', directory))
}))
await copyFile(index, new URL('404.html', build))

const publicRoutes = ['', ...routes.filter(route => !['cart','checkout','wishlist'].includes(route))]
const entries = publicRoutes.map(route => '  <url><loc>' + new URL(route, origin).href + '</loc></url>')
await writeFile(new URL('sitemap.xml', build),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + entries.join('\n') + '\n</urlset>\n')
await writeFile(new URL('robots.txt', build),
  'User-agent: *\n' + ['cart','checkout','wishlist'].map(route => 'Disallow: ' + new URL(route, origin).pathname).join('\n')
  + '\nSitemap: ' + new URL('sitemap.xml', origin).href + '\n')
