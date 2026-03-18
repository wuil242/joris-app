
export default class Sticky {
  static defaultSelector = 'active'

  /**
   * 
   * @param {{
   * element:string|HTMLElement,
   * scrollValue:number,
   * activeClass?:string
   * }} options options du sticy
   */
  constructor(options) {
    if(typeof options.element === 'string') {
      this.el = document.querySelector(options.element)
    }
    else {
      this.el = options.element
    }
    
    this.scrollValue = options.scrollValue
    this.activeClass = options.activeClass || Sticky.defaultSelector

    if(!this.el) throw new Error('element a rendre sticky non defini')
    if(!this.scrollValue) throw new Error('la valeur du scroll n\' est pas defini')

    this.scrolling = this.scrolling.bind(this)

    this.init()
  }

  init() {
    this.scrolling()

    window.addEventListener('scroll', this.scrolling)
  }

  scrolling () {
    if(window.scrollY > this.scrollValue) {
      this.el.classList.add(this.activeClass)
    }
    else if (window.scrollY < this.scrollValue) {
      this.el.classList.remove(this.activeClass)
    }
  }

  /**
   * 
   * @param {{
   * element:string,
   * scrollValue:number,
   * activeClass:string
   * }} options options du sticy
   */
  static define(options) {
    return new Sticky(options)
  }

}