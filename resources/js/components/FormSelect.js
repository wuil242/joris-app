import '../../css/form/form-select.css'

/**
 * emet des custom event contenu dans EVENT
 * 
 */
export default class FormSelect {
  static ID = 0
  static EVENT = {
    SELECTED: 'form-select'
  }

  static SELECTOR = {
    SEARCH_INPUT: '.js-form-select-input',
    SELECT_INPUT: 'select'
  }

  /**
   * 
   * @param {HTMLElement} el 
   */
  constructor($root) {
    this.$root = $root
    this.$select = this.$root.querySelector('.js-select-content')
    this.$input = this.$root.querySelector(FormSelect.SELECTOR.SEARCH_INPUT)
    this.$options = this.$root.querySelector('.js-slelect-options')
    this.$lis = Array.from(this.$options.querySelectorAll('.js-slelect-option'))
    this.$button = this.$root.querySelector('.js-select-button')
    this.$icon = this.$root.querySelector('.js-form-select-search-icon')
    this.$select_hidden = this.$root.querySelector(FormSelect.SELECTOR.SELECT_INPUT)
    this.disabled = false


    this.defineSelect()
  }

  defineSelect() {
    this.$select.dataset.id = 'form-slelect-' + FormSelect.ID++
    this.$root.addEventListener('disable', () => this.disabled = true)
    this.$root.addEventListener('enable', () => this.disabled = false)

    this.$button.addEventListener('click', (e) => {
      this.openOrClose(e)

      document.querySelectorAll('.js-select-content')
        ?.forEach($box => {
          if($box.dataset.id !== this.$select.dataset.id) {
            $box.classList.remove('active')
          }
        })

      window.addEventListener('click', () => {
        this.$select.classList.remove('active')
      }, {once: true})
    })

    this.$lis.forEach(this.addClickEvent.bind(this))
    this.$lis.forEach(this.addLinkClickEvent.bind(this))

    this.$input.addEventListener('click', this.stopPropagation)
    this.$input.addEventListener('input', e => {
      const value = e.target.value.toUpperCase()
      this.$lis.forEach(li => this.filterSelect(li, value))
    })

    this.$input.addEventListener('focus', () => this.$input.parentElement.classList.add('is-focus'))
    this.$input.addEventListener('blur', () => this.$input.parentElement.classList.remove('is-focus'))

    this.$icon.addEventListener('click', e => {
      this.stopPropagation(e)
      this.$input.focus()
    })
  }

  /**
   * 
   * @param {Event} e 
   * @returns 
   */
  openOrClose(e) {
    if(this.disabled) return

    e.stopPropagation()
    e.stopImmediatePropagation()

    this.$select.classList.toggle('active')
    this.$input.value = ''
    this.showAllOption(this.$lis)
  }

  /**
   * @param {Event} e
   */
  stopPropagation(e) {
    e.stopPropagation()
    e.stopImmediatePropagation()
  }

  addClickEvent(li) {
    li.addEventListener('click', this.emitSelection.bind(this))
  }

  addLinkClickEvent(li) {
    li.parentElement.addEventListener('click', e => {
      if(e.pointerId === -1) {
        this.emitSelection({target: li})
      }
    })
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
   * @param {PointerEvent} e 
   */
  emitSelection(e) {
    const field = this.$select_hidden.name
    const text = e.target.innerText
    const value =  e.target.dataset.value

    this.$select_hidden.value = value
    this.$button.firstElementChild.innerText = text
    this.$select.classList.remove('active')

    const detail = {field, text, value}
    this.$root.dispatchEvent(new CustomEvent(FormSelect.EVENT.SELECTED, {detail}))
    
    this.$input.value = ''
    this.showAllOption(this.$lis)
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
