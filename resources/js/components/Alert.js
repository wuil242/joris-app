import '../../css/components/alert.css'

/**
 * 
 * @property {HTMLElement|null} $el element representant l'alert
 * @property {number} time temps que met l'alert a ce detruire apres la fermeture
 * @property {HTMLElement} $closeButton boutton permettant la fermeture de l'alert
 * 
 */
export default class Alert {
  /**
   * 
   * @param {HTMLElement} $el element representant l'alert
   * @param {number} time temps que met l'alert a ce detruire apres la fermeture
   */
  constructor($el, time = 600) {
    this.$el = $el
    this.time = time

    if(!this.$el) {
      console.error('l\'element attribuer pour l\'alert non trouver')
      return
    }

    this.$closeButton = this.$el.querySelector('.alert-close-button')

    if(!this.$closeButton) {
      console.error('l\'element attribuer pour la fermture de l\'alert ayant la classe "alert-close-button" non trouver')
      return
    }

    this.$closeButton.addEventListener('click', () => {
      this.$el.classList.toggle('alert-close', 'alert-appear')
      setTimeout(() => {
        this.$el.remove()
        this.$el = null
      }, this.time)
    })
  }

  /**
   * initialise tout les element alert de la page ayant avec un selector specifique
   * 
   * @returns {Alert[]}
   */
  static init(selector = '.js-alert') {
    const alerts = Array.from(document.querySelectorAll(selector))
    return alerts.map($alert => new Alert($alert))
  }
} 