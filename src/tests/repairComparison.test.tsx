import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {afterEach, expect, it} from 'vitest'
import BeforeAfter from '../features/repairs/BeforeAfter'

afterEach(cleanup)

it('reveals both photographed repair states and retains the source credit', () => {
  render(<MemoryRouter><BeforeAfter/></MemoryRouter>)
  const slider = screen.getByRole('slider', {name: 'Compare before and after screen replacement'})
  const original = screen.getByAltText(/Original display after removal/)
  const replacement = screen.getByAltText(/replacement screen installed/)
  expect(original.getAttribute('src')).toBe('/images/screen-removed.webp')
  expect(replacement.getAttribute('src')).toBe('/images/screen-installed.webp')
  fireEvent.change(slider, {target: {value: '27'}})
  expect(slider.getAttribute('aria-valuetext')).toBe('27% original screen, 73% replacement screen')
  expect(original.parentElement?.style.getPropertyValue('--split')).toBe('27%')
  expect(screen.getByRole('link', {name: /Source photo by Phonerepair1/}).getAttribute('href')).toContain('commons.wikimedia.org')
  expect(screen.getByRole('link', {name: 'Estimate a screen repair'}).getAttribute('href')).toBe('/repair-estimator?issue=screen')
})
