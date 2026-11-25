import {writeFileSync} from 'node:fs'
import {products} from '../src/data/products.ts'
const origin = new URL(process.argv[2])
if (origin.protocol !== 'https:' || origin.origin !== origin.href.slice(0,-1)) throw new Error('Use the verified HTTPS origin')
const pages = ['/','/repairs','/repair-estimator','/book-repair','/shop','/shop/smartphones','/shop/accessories','/shop/audio','/shop/refurbished','/compare','/about','/contact',...products.map(p=>'/product/'+p.slug)]
writeFileSync(new URL('../public/sitemap.xml',import.meta.url),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(path=>'  <url><loc>'+new URL(path,origin).href+'</loc></url>').join('\n')+'\n</urlset>\n')
