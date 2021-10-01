import '../css/app.css'

import HeaderMenu from "./components/HeaderMenu"

HeaderMenu.create({
  openBtnSelector: '.js-open-menu',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden',
})