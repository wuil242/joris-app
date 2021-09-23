
export default class Carroussel {
  static selector = '.js-carroussel'
  static DIR = {LEFT: 0, RIGHT: 1}

  /**
   * 
   * @param {HTMLElement} el element a transformer en carrousel 
   * @param {{
   * auto:boolean,
   * time:number
   * }} options option pour le carroussel
   */
  constructor(el, options) {
    this.el= el
    this.options = options

    if(!this.el) throw new Error('accun element trouver')

    this.index = 0
    this.items = Array.from(this.el.children)
    this.currentItem = this.items[this.index]

    
    this.addStyle = this.addStyle.bind(this)
    this.addButtons = this.addButtons.bind(this)
    this.prevItem = this.prevItem.bind(this)
    this.nextItem = this.nextItem.bind(this)
    this.goTo = this.goTo.bind(this)
    
    if(this.options.auto) {
      if(this.options.time < 1) {
        this.options.time = 1
      }

      this.changeItem = this.changeItem.bind(this)

      this.direction = Carroussel.DIR.LEFT
      this.timer = window.setInterval(this.changeItem, this.options.time * 1000)
    }else {      
      this.prev = this.addPrevButton()
      this.nextButton = this.addNextButton()
    }

    this.init()
  }

  changeItem() {
    if(this.index === this.items.length - 1) {
      this.direction = Carroussel.DIR.LEFT
    }
    else if(this.index === 0) {
      this.direction = Carroussel.DIR.RIGHT
    }

    if(this.direction === Carroussel.DIR.LEFT) {
      this.prevItem()
    }
    else {
      this.nextItem()
    }
  }

  goTo(index) {
    const left = index * this.items[index].scrollWidth
    this.el.scroll({
      behavior: 'smooth',
      left
    })
  }

  prevItem() {
    this.index--
    if(this.index < 0) {
      this.index = this.items.length - 1
    }

    this.goTo(this.index)

  }

  nextItem() {
    this.index++
    if(this.index >= this.items.length) {
      this.index = 0
    }

    this.goTo(this.index)
  }

  addPrevButton() {
    const text = 'Prev'
    const className = 'js-carroussel-next_button'

    this.addButtons(text, className, this.prevItem)
  }


  addNextButton() {
    const text = 'Next'
    const className = 'js-carroussel-next_button'

    this.addButtons(text, className, this.nextItem)
  }

  /**
   * ajout un boutton au carroussel
   * 
   * @param {string} text texte contentu dans le boutton
   * @param {string} className class du boutton
   * @param {Function} eventName fonction appeler lorsque le boutton est cliquer
   */
  addButtons(text, className, eventName) {
    
    this.items.forEach(el => {
      const button = document.createElement('button')
      button.innerText = text
  
      button.classList.add(className)
  
      button.addEventListener('click', eventName)
      el.appendChild(button)
    })
  }

  addStyle() {
    this.el.classList.add('js-carroussel')
    for (const child of this.el.children) {
      child.classList.add('js-carroussel-element')
    }
  }

  init() {
    this.addStyle()
  }

   /**
   * 
   * @param {{
   * selector:string?
   * auto:boolean?,
   * time:number?
   * }?} options option pour le carroussel
   */
  static define(options = {auto: false, time: 1}) {
    const carrouselList = []
    const elems = document.querySelectorAll(options.selector || Carroussel.selector)
    if(!elems || elems.length <= 0) {
      throw new Error('aucun element trouver avec la classe ' + selector || Carroussel.selector.replace('.', ''))
    }

    for (const el of elems) {
      carrouselList.push(new Carroussel(el, options))
    }

    return carrouselList
  }
}