import {ArrowUpRight, Instagram} from 'lucide-react'
import {business} from '../config/business'
import {instagramPosts, instagramProfile} from '../utils/instagram'
import {assetUrl} from '../utils/assets'
import './instagram.css'

const previewItems = [
  {image:'/images/hero.webp', alt:'Exploded illustration of a smartphone and its internal components', title:'Inside a smartphone'},
  {image:'/images/axis-pro.webp', alt:'Concept artwork showing a smartphone from the front and back', title:'A closer look at the tech'},
  {image:'/images/headphones.webp', alt:'Graphite over-ear headphones', title:'Gear for the everyday'},
]

export function InstagramFeed({profileUrl, postUrls}: {profileUrl: string; postUrls: string[]}) {
  const profile = instagramProfile(profileUrl)
  const posts = instagramPosts(postUrls)
  const items = posts.length ? posts : profile ? [profile.url] : []

  if (!items.length) return null

  return (
    <section className="section instagram-feed" aria-labelledby="instagram-title">
      <div className="section-title">
        <div>
          <span className="eyebrow"><Instagram size={16} aria-hidden="true"/> Instagram</span>
          <h2 id="instagram-title">From the feed.</h2>
        </div>
        {profile && <a className="action secondary" href={profile.url} target="_blank" rel="noreferrer">
          @{profile.handle} <ArrowUpRight size={17} aria-hidden="true"/>
        </a>}
      </div>
      <div className="instagram-grid">
        {items.map((url, index) => {
          const label = posts.length ? 'Instagram ' + (url.includes('/reel/') ? 'Reel ' : 'post ') + (index + 1) : 'Instagram profile @' + profile?.handle
          return <article key={url}>
            <iframe src={url + 'embed/'} title={label} loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              allow="encrypted-media; fullscreen" referrerPolicy="strict-origin-when-cross-origin"/>
            <a href={url} target="_blank" rel="noreferrer">Open {label} <ArrowUpRight size={15} aria-hidden="true"/></a>
          </article>
        })}
      </div>
    </section>
  )
}

export default function BusinessInstagramFeed() {
  const {profile, posts, preview} = business.instagram
  if (instagramProfile(profile) || instagramPosts(posts).length) {
    return <InstagramFeed profileUrl={profile} postUrls={posts}/>
  }
  if (!preview) return null

  return (
    <section className="section instagram-feed" aria-labelledby="instagram-preview-title">
      <div className="section-title">
        <div>
          <span className="eyebrow"><Instagram size={16} aria-hidden="true"/> Instagram preview</span>
          <h2 id="instagram-preview-title">From the feed.</h2>
        </div>
        <p>Sample posts for the upcoming REBOOT account.</p>
      </div>
      <div className="instagram-grid instagram-preview-grid">
        {previewItems.map(item => (
          <article key={item.image}>
            <img src={assetUrl(item.image)} alt={item.alt} loading="lazy"/>
            <h3>{item.title}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}
