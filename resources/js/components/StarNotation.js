
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
   * 
   * @param {string} starSelector 
   * @param {string} inputSelector 
   */
  static initInput(starSelector, inputSelector) {
    const items = Array.from(document.querySelectorAll(starSelector))
    const el_note_input = document.querySelector(inputSelector)

    items.forEach(el => {

      el.addEventListener('pointerenter', () => {
        const value = +el.dataset.value
    
        items.forEach(elem => elem.classList.replace('fa', 'far'))
        
        el_note_input.value = value
    
        for (let i = 0; i < value; i++) {
          const index = i
    
          items[index].classList.replace('far', 'fa')
        }
    
      })
    
    })

  }

  /**
   * @param {
   * {containerSelector: string, iconSelector: string, starSelector: string, inputSelector: string}
   * } selectors
   */
  static init({containerSelector, iconSelector, starSelector, inputSelector}) {
    let items = Array.from(document.querySelectorAll(containerSelector))
    items = items.map(item => new StarNotation(item, iconSelector))
    this.initInput(starSelector, inputSelector)
    return items
  }

}


export {StarNotation}