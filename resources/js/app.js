import '../css/app.css'

import HeaderMenu from "./components/HeaderMenu"
import HeaderMenuButton from './components/HeaderMenuButton'
import Sticky from './components/Sticky'


HeaderMenuButton.create({
  openButtonSelector: '.header-menu-button',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden',
})
