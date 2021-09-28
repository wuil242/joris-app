import '../../css/home/all.css'

import HeaderMenu from "../components/HeaderMenu"
import Sticky from '../components/Sticky'
import Carroussel from '../components/Carroussel'

HeaderMenu.create({
  openBtnSelector: '.js-open-menu',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden',
})

Sticky.define({
  element: '.top-button',
  scrollValue: 350,
})


Carroussel.define({
  auto: true,
  time: 3
})
