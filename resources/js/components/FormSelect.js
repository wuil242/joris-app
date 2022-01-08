import '../../css/form/form-select.css'

/**
 * 
 */
export default class FormSelect {

  /**
   * 
   * @param {HTMLElement} el 
   */
  constructor($root) {
    this.$root = $root
    this.$select = this.$root.querySelector('.js-select-content')
    this.$input = this.$root.querySelector('.js-form-select-input')
    this.$options = this.$root.querySelector('.js-slelect-options')
    this.$lis = Array.from(this.$options.querySelectorAll('.js-slelect-option'))
    this.$button = this.$root.querySelector('.js-select-button')
    this.$select_hidden = this.$root.querySelector('select')
    this.disabled = false

    this.defineSelect()
  }

  defineSelect() {
    this.$lis.forEach(this.addClickEvent.bind(this))

    this.$root.addEventListener('disable', () => this.disabled = true)
    this.$root.addEventListener('enable', () => this.disabled = false)

    this.$button.addEventListener('click', (e) => {
      if(this.disabled) return

      e.stopPropagation()
      e.stopImmediatePropagation()

      this.$select.classList.toggle('active')
      e.stopPropagation()
      this.$input.value = ''
      this.showAllOption(this.$lis)

      window.addEventListener('click', () => {
        this.$select.classList.remove('active')
      }, {once: true})
    })

    this.$input.addEventListener('click', e => {
      e.stopPropagation()
      e.stopImmediatePropagation()
    })

    this.$input.addEventListener('input', e => {
      const value = e.target.value.toUpperCase()
      this.$lis.forEach(li => this.filterSelect(li, value))
    })
  }

  addClickEvent(li) {
    li.addEventListener('click', this.emitSelection.bind(this))
  }

  /**
    * @param {HTMLElement[]} this.$options
    */
   showAllOption($options) {
    $options.forEach($li => {
      $li.style.removeProperty('display')
    })
  }

  /**
   * 
   * @param {HTMLElement} li 
   * @param {string} value 
   */
  filterSelect(li, value) {
    const liValue = li.innerText.trim().toUpperCase()
    if(liValue.indexOf(value) === -1) {
      li.style.setProperty('display', 'none')
    }
    else {
      li.style.removeProperty('display')
    }
  }

  /**
   * 
   * @param {InputEvent} e 
   */
  emitSelection(e) {
    this.$select_hidden.value = e.target.dataset.value
    this.$button.firstElementChild.innerText = e.target.innerText
    this.$select.classList.remove('active')

    this.$root.dispatchEvent(new Event('form-select'))
    
    this.$input.value = ''
    this.showAllOption(this.$lis)
    
    // this.$select_hidden.dispatchEvent(new CustomEvent('form-select', {detail: e.target}))
    // this.$root.dispatchEvent(new CustomEvent('form-select', {detail: e.target}))
  }

  /**
   * 
   * @param {($roots:HTMLElement[]) => void | null} cb
   */
  static init(cb = null) {
    const tab = []
    const $roots = document.querySelectorAll('.js-select')

    if(!$roots || $roots.length <= 0) {
      throw '.js-select not found'
    }

    $roots.forEach(($root, index) => {
      tab.push(new FormSelect($root))
      if(cb) {
        if(index === $roots.length - 1) {
          cb(tab)
        }
      }
    })
  }

}