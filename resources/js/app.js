import '../css/app.css'
import HeaderMenuButton from './components/HeaderMenuButton'
import {addLoaderToButton} from './helpers'

HeaderMenuButton.create({
  openButtonSelector: '.header-menu-button',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden',
})

// branchement d'un evement de chargement pour tout les bouttons de soumission de formulaire
document.querySelectorAll('.form-submit')
  ?.forEach($submit_button => {
    $submit_button.addEventListener('click', () => {
      addLoaderToButton($submit_button)
      $submit_button.parentElement.submit()
    })
  })
