import '../css/app.css'
import HeaderMenu from './components/HeaderMenu';
import HeaderMenuButton from './components/HeaderMenuButton';

HeaderMenu.create({
  openBtnSelector: '.js-open-menu',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden'
})

HeaderMenuButton.create({
  buttonSelector: '#menu-button'
})