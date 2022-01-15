import '../../css/components/alert.css'

export default class Alert {
  /**
   * 
   * @param {HTMLElement|null} $el 
   * @param {number} time 
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

  static init() {
    const alerts = Array.from(document.querySelectorAll('.js-alert'))
    return alerts.map($alert => new Alert($alert))
  }
} 