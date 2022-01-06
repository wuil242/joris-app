import '../css/app.css'
import HeaderMenuButton from './components/HeaderMenuButton'

HeaderMenuButton.create({
  openButtonSelector: '.header-menu-button',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden',
})
