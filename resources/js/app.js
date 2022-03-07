import '../css/app.css'
import HeaderMenuButton from './components/HeaderMenuButton'
import {addLoaderToButton} from './helpers'

HeaderMenuButton.create({
  openButtonSelector: '.header-menu-button',
  menuSelector: '.js-close-menu',
  closeElementSelector: '.js-menu-hidden',
})

// ajout chargement pour tout les bouttons de soumission de formulaire
document.querySelectorAll('.form-submit')
?.forEach($submit_button => {
  $submit_button.addEventListener('click', () => {
      addLoaderToButton($submit_button)
      $submit_button.parentElement.submit()
    })
  })

//ajout de la possibilter de voir ou masquer les mot de passe
document.querySelectorAll('.js-password-field')
  ?.forEach($password_field => {
    const icon = document.querySelector(`[data-name=${$password_field.getAttribute('name')}]`)
    icon.addEventListener('click', () => {
      const isShowPassword = icon.classList.toggle('fa-eye-slash')
      isShowPassword ? $password_field.setAttribute('type', 'text') : $password_field.setAttribute('type', 'password')
    })
  })