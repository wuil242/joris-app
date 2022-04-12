
class StarNotation {

  /**
   * 
   * @param {HTMLElement} item 
   * @param {string} icon_selector 
   */
  constructor(item, icon_selector) {
    /** @type {HTMLElement} */
    this.item = item
    /**@type {number} */
    this.note = parseFloat(this.item.dataset.note)
    /**@type {string} */
    this.icon_selector = icon_selector

    this.fillStar()
  }

  /**
   * add appropriate class to 
   */
  fillStar() {
    const note_converted = this.note.toPrecision(2)
    const [integer, decimal] = note_converted.split('.').map(v => parseInt(v, 10))

    for (let i = 1; i <= integer; i++) {
      const query = `${this.icon_selector}[data-id="${i}"]`
      const el = this.item.querySelector(query)
      el.classList.replace('far', 'fa')
    }
    
    if(decimal >= 5) {
      const id = integer + 1
      const query = `${this.icon_selector}[data-id="${id}"]`
      const el = this.item.querySelector(query)
      el.classList.replace('far', 'fa')
      el.classList.replace('fa-star', 'fa-star-half-alt')
    }

  }

  /** 
   * @param {string} selector
   * @param {string} icon_selector
   */
  static init(selector, icon_selector) {
    const items = Array.from(document.querySelectorAll(selector))
    return items.map(item => new StarNotation(item, icon_selector))
  }
}


export {StarNotation}