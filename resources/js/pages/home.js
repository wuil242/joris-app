import '../../css/home/all.css'

import Sticky from '../components/Sticky'
import Carroussel from '../components/Carroussel'


Sticky.define({
  element: '.home-top-button',
  scrollValue: 350,
})


Carroussel.define({
  auto: true,
  time: 5
})
