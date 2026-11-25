const instagramOrigin = 'https://www.instagram.com'

function instagramPath(value: string) {
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    if (url.hostname !== 'www.instagram.com' && url.hostname !== 'instagram.com') return null
    return url.pathname
  } catch {
    return null
  }
}

export function instagramProfile(value: string) {
  const input = value.trim()
  const handle = input.startsWith('@') ? input.slice(1) :
    instagramPath(input)?.match(/^\/([a-z\d._]{1,30})\/?$/i)?.[1]
  if (!handle || !/^[a-z\d._]{1,30}$/i.test(handle) ||
      /^(accounts|developer|direct|explore|p|reel|reels|stories|tv)$/i.test(handle)) return null
  return {handle, url: instagramOrigin + '/' + handle + '/'}
}

export function instagramPosts(values: string[]) {
  const posts = values.flatMap(value => {
    const match = instagramPath(value)?.match(/^\/(p|reel)\/([a-z\d_-]+)\/?$/i)
    return match ? [instagramOrigin + '/' + match[1].toLowerCase() + '/' + match[2] + '/'] : []
  })
  return [...new Set(posts)].slice(0, 3)
}
