import '../css/app.css'
import HeaderMenuButton from './components/HeaderMenuButton';

HeaderMenuButton.create({
  openBtnSelector: '.js-open-menu',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden'
})
