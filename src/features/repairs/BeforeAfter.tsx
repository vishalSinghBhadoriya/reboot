import {assetUrl} from '../../utils/assets'
import {useState, type CSSProperties} from 'react'
import {ArrowLeftRight} from 'lucide-react'
import {Action} from '../../components/ui'

const source = 'https://commons.wikimedia.org/wiki/File:IPhonedriod.Repairservice%E2%80%99s_02.jpg'
const license = 'https://creativecommons.org/licenses/by-sa/4.0/'

export default function BeforeAfter() {
  const [split, setSplit] = useState(50)
  const divider = {'--split': split + '%'} as CSSProperties

  return (
    <section className="section restore" aria-labelledby="repair-comparison">
      <div className="section-kicker"><span>02 / REPAIR COMPARISON</span><span>WORKBENCH PHOTOGRAPHY</span></div>
      <div className="section-title">
        <h2 id="repair-comparison">See the repair.</h2>
        <p>Compare a shattered display with the phone running on its replacement screen.</p>
      </div>
      <div className="restore-grid">
        <figure className="repair-figure">
          <div className="before-after repair-compare" style={divider}>
            <img src={assetUrl('/images/screen-installed.webp')} width="1100" height="720" alt="Lower section of a phone powered on with its replacement screen installed" loading="lazy"/>
            <img className="repair-before" src={assetUrl('/images/screen-removed.webp')} width="1100" height="720" alt="Original display after removal, showing impact cracks near the home button" loading="lazy"/>
            <span className="before-tag" aria-hidden="true">Before</span>
            <span className="after-tag" aria-hidden="true">After</span>
            <span className="split-line" aria-hidden="true"><b><ArrowLeftRight size={19}/></b></span>
            <input type="range" min="0" max="100" value={split} aria-label="Compare before and after screen replacement"
              aria-valuetext={split + '% original screen, ' + (100 - split) + '% replacement screen'}
              onChange={event => setSplit(Number(event.target.value))}/>
          </div>
          <figcaption className="repair-credit">
            <a href={source}>Source photo by Phonerepair1</a> · <a href={license}>CC BY-SA 4.0</a> · Cropped and resized
          </figcaption>
        </figure>
        <div className="repair-notes">
          <span className="technical">SCREEN REPLACEMENT</span>
          <h3>From shattered glass to a working display.</h3>
          <p>The two views are cropped from one workbench photo showing the removed screen beside the phone with its replacement display on.</p>
          <p>Drag the divider or use the arrow keys to compare.</p>
          <Action to="/repair-estimator?issue=screen">Estimate a screen repair</Action>
        </div>
      </div>
    </section>
  )
}
