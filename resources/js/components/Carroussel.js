import '../../css/components/carroussel.css'

//TODO: ajout du defilement par toucher
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

    

    //Methods
    this.addStyle = this.addStyle.bind(this)
    this.addButtons = this.addButtons.bind(this)
    this.prevItem = this.prevItem.bind(this)
    this.nextItem = this.nextItem.bind(this)
    this.goTo = this.goTo.bind(this)
    this.changeItem = this.changeItem.bind(this)
    this.changeItemWithButton = this.changeItemWithButton.bind(this)
    this.lunchTimer = this.lunchTimer.bind(this)
    
   
    //Property
    this.buttons = null
    this.direction = Carroussel.DIR.LEFT
    this.timer = null

    this.init()
  }

  /**
   * change d'item apres un click sur le boutton du carrussel vers un item donner
   * 
   * @param {HTMLElement} e 
   */
  changeItemWithButton(e) {
    const item = e.target.dataset.item

    this.index = Number.parseInt(item, 10)

    window.clearInterval(this.timer)
    this.timer = null
    
    // changement de direction automatique
    // this.direction = Carroussel.DIR.RIGHT

    this.goTo(this.index)

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
    this.buttons.style.setProperty('transform', `translateX(${left}px)`)
    
    
    this.el.scroll({
      behavior: 'smooth',
      left
    })


    for (const btn of this.buttons.children) {
      btn.classList.remove('active')
    }

    this.buttons.children[index].classList.add('active')

    if(!this.timer) {
      this.lunchTimer()
    }
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

  /**
   * ajout des bouttons de selection d'item suivant le nbre de celui ci
   * 
   */
  addGetItemButtons() {
    this.buttons = document.createElement('div')
    this.buttons.classList.add('carroussel-buttons')

    for (let i = 0; i < this.items.length; i++) {
      const btn = document.createElement('button')
      btn.classList.add('carroussel-button')
      btn.dataset.item = i
      btn.addEventListener('click', this.changeItemWithButton)
      if(i === 0) btn.classList.add('active')
      this.buttons.appendChild(btn)
    }

    this.el.appendChild(this.buttons)
  }

  addPrevButton() {
    const text = 'Prev'
    const className = 'carroussel-next_button'

    this.addButtons(text, className, this.prevItem)
  }


  addNextButton() {
    const text = 'Next'
    const className = 'carroussel-next_button'

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
    this.el.classList.add('carroussel')
    for (const child of this.el.children) {
      child.classList.add('carroussel-element')
    }

  }

  /**
   * demarre un timer 
   */
  lunchTimer() {
    this.timer = window.setInterval(this.changeItem, this.options.time * 1000)
  }

  init() {

    if(this.options.time < 1) {
      this.options.time = 1
    }

    this.addGetItemButtons()
    this.addStyle()

    //lancement du defilement automatique
    if(this.items.length >= 2) {
      this.lunchTimer()
    }
  }

   /**
   * 
   * @param {{
   * selector:string?
   * auto:boolean?,
   * time:number?
   * }?} options option pour le carroussel
   * 
   * @returns {Carroussel[]}
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