import { setup } from './services/BootGameService'

import './styles/reset.css'
import './styles/main.css'
import './styles/loader.css'

// even though Rollup is bundling all your files together, errors and
// logs will still point to your original source modules
console.log('if you have sourcemaps enabled in your devtools, click on main.js:5 -->')

setup()
  .then((game) => {
    document.querySelector('.loader-container').remove()
    console.log('%cgame init done!!', 'color:green; font-size:30px;')
    console.log(game)
  })
  .catch((exc) => console.error('game init failed', exc.message))
