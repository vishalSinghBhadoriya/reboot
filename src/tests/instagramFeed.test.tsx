import {cleanup, render, screen} from '@testing-library/react'
import {afterEach, expect, it} from 'vitest'
import BusinessInstagramFeed, {InstagramFeed} from '../components/InstagramFeed'
import {instagramPosts, instagramProfile} from '../utils/instagram'

afterEach(cleanup)

it('shows three labeled samples before REBOOT connects its account', () => {
  render(<InstagramFeed profileUrl="" postUrls={[]} preview/>)
  expect(screen.getByText('Instagram preview')).toBeTruthy()
  expect(screen.getAllByRole('img')).toHaveLength(3)
  expect(screen.queryByTitle(/^Instagram/)).toBeNull()
})

it('replaces the sample cards with the configured business profile', () => {
  render(<BusinessInstagramFeed/>)
  const url = 'https://www.instagram.com/noveltymobilesolutionbadnawar/'
  expect(screen.getByTitle('Instagram profile @noveltymobilesolutionbadnawar').getAttribute('src')).toBe(url + 'embed/')
  expect(screen.getByRole('link', {name:'@noveltymobilesolutionbadnawar'}).getAttribute('href')).toBe(url)
  expect(screen.queryByText('Instagram preview')).toBeNull()
})

it('normalizes public Instagram links and rejects unrelated destinations', () => {
  expect(instagramProfile('@example.repair')?.url).toBe('https://www.instagram.com/example.repair/')
  expect(instagramProfile('https://instagram.com/reel/')).toBeNull()
  expect(instagramPosts(['https://instagram.com/reel/Example_1/?igsh=sample',
    'https://www.instagram.com/reel/Example_1/', 'https://instagram.com.example.org/p/Example_2/']))
    .toEqual(['https://www.instagram.com/reel/Example_1/'])
})

it('hides an unconfigured feed and lazy-loads configured embeds', () => {
  const {rerender} = render(<InstagramFeed profileUrl="" postUrls={[]}/>)
  expect(screen.queryByRole('region')).toBeNull()
  rerender(<InstagramFeed profileUrl="@example.repair" postUrls={['https://www.instagram.com/p/Example_1/']}/>)
  const embed = screen.getByTitle('Instagram post 1')
  expect(embed.getAttribute('src')).toBe('https://www.instagram.com/p/Example_1/embed/')
  expect(embed.getAttribute('loading')).toBe('lazy')
  expect(screen.getByRole('link', {name:'Open Instagram post 1'}).getAttribute('href')).toBe('https://www.instagram.com/p/Example_1/')
})
