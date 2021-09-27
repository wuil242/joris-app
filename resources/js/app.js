import '../css/app.css'
import Carroussel from './components/Carroussel'
import HeaderMenu from './components/HeaderMenu'
import HeaderMenuButton from './components/HeaderMenuButton'
import Sticky from './components/Sticky'


HeaderMenu.create({
  openBtnSelector: '.js-open-menu',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden',
})

/*
HeaderMenuButton.create({
  buttonSelector: '#menu-button',
})

Sticky.define({
  element: '.top-button',
  scrollValue: 350,
})

*/

// Carroussel.define({
//   auto: true,
//   time: 3
// })

