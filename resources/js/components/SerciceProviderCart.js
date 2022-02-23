export default class Chart {
  static ACTIONS = {
    'ADD_TO_CART': 'add',
    'REMOVE_FROM_CART': 'remove'
  }

  /**
  * @param {HTMLElement} el
  * @param {HTMLElement} cards
  * @returns 
  */
  constructor(el, cards) {
    this.ids = 0
    this.items = new Map()
    this.cards = cards
    this.link = new URL(document.URL)
    this.addButton(el)
    this.addPanel(el)

    this.resetLink()
    this.renderButton()
    this.renderPanel()

    this.cards.forEach((card) => {
      const id = +card.dataset.id
      card.innerHTML += `<button id="card-${id}" data-card="${id}">addToChart</button>`
      const btn = card.querySelector('#card-' + id)
      btn.dataset.action = Chart.ACTIONS.ADD_TO_CART
      btn.addEventListener('click', () => {
        if(btn.dataset.action === Chart.ACTIONS.ADD_TO_CART) {
          const added = this.addItem({id, $el: card})
          btn.innerHTML = 'RemoveChart'
          btn.dataset.action = Chart.ACTIONS.REMOVE_FROM_CART
          if(added && this.items.size > 0) {
            cards.forEach(cc => cc.querySelector('a.button').style.setProperty('display', 'none'))
          }
        }
        else if(btn.dataset.action === Chart.ACTIONS.REMOVE_FROM_CART) {
          const removed = this.removeItem({id, $el: card})
          btn.innerHTML = 'addToChart'
          btn.dataset.action = Chart.ACTIONS.ADD_TO_CART
          if(removed && this.items.size <= 0) {
            cards.forEach(cc => cc.querySelector('a.button').style.removeProperty('display'))
          }
        }
      })
    })
  }
  
  resetLink() {
    this.link.search = ''
    this.link.pathname = '/devis/client'
  }

  /**
  * @param {HTMLElement} el
  * @returns 
  */
  addButton(el) {
    this.button = document.createElement('button')
    this.button.classList.add('button', 'chart')
    this.button.style.setProperty('position', 'fixed')
    this.button.style.setProperty('top', '60px')
    this.button.style.setProperty('right', '5px')
    this.button.addEventListener('click', this.openPanel.bind(this))
    el.appendChild(this.button)
    this.renderButton()
  }

  /**
  * @param {HTMLElement} el
  * @returns 
  */
  addPanel(el) {
    this.panel = document.createElement('section')
    this.panel.classList.add('chart-panel')
    this.panel.style.setProperty('display', 'none')
    this.panel.style.setProperty('position', 'fixed')
    this.panel.style.setProperty('top', '0')
    this.panel.style.setProperty('right', '0')
    this.panel.style.setProperty('width', '50vw')
    this.panel.style.setProperty('bottom', '0')
    this.panel.style.setProperty('background', 'var(--color-primary)')
    this.panel.style.setProperty('z-index', 'var(--layer-middle)')

    this.closePanelButton = document.createElement('button')
    this.closePanelButton.classList.add('chart-panel-close')
    this.closePanelButton.innerHTML = 'CLOSE'

    this.listItems = document.createElement('ul')
    this.listItems.classList.add('chart-panel-items')

    this.linkButton = document.createElement('a')

    this.closePanelButton.addEventListener('click', this.closePanel.bind(this))
    this.panel.appendChild(this.linkButton)
    this.panel.appendChild(this.closePanelButton)
    this.panel.appendChild(this.listItems)
    el.appendChild(this.panel)
    this.renderPanel()
  }

  openPanel() {
    if(!this.isActivePanel()) {
      this.panel.style.removeProperty('display')
    }
  }

  closePanel() {
    if(this.isActivePanel()) {
      this.panel.style.setProperty('display', 'none')
    }
  }

  isActivePanel() {
    return this.panel.style.getPropertyValue('display') !== 'none'
  }

  renderPanel() {
    // this.resetLink()
    this.linkButton.setAttribute('href', '#')
    this.linkButton.innerHTML = ''
    this.listItems.innerHTML = ''
    this.items.forEach((item, index) => {
      const li = document.createElement('li')
      li.innerHTML = 'item: ' + item.id
      this.listItems.appendChild(li)
      this.link.searchParams.append('sp[]', item.id)
      if(index === this.items.size) {
        this.linkButton.setAttribute('href', this.link.href)
        this.linkButton.innerHTML = this.link.href
        fetch('/cart/sp' + this.link.search)
          .then(r => r.text())
          .then(data => {
            this.listItems.innerHTML = ''
            this.listItems.appendChild(document.createRange().createContextualFragment(data))
          })
          .then(() => {
            Array.from(document.querySelector(`.service-provider-box-items`).children)
              .forEach(box => {
                box.querySelector('.service-provider-box-close')
                  .addEventListener('click', () => {
                    const id = +box.dataset.id
                    this.removeItem({id})
                    const btn = document.querySelector('#card-' + id)
                    btn.innerHTML = 'addToChart'
                    btn.dataset.action = Chart.ACTIONS.ADD_TO_CART
                  })
              })
          })
      }
    })
  }

  renderButton() {  
    this.button.innerHTML = `<i class="fa fa-shopping-cart"></i> Cart (<span id="chart-nbre">${this.items.size}</span>)`
  }

  /**
   * 
   * @param {{id:number, $el:HTMLElement}} item 
   */
  addItem(item) {
    for (const it of this.items.values()) {
      if(it.id === item.id) {
        return false
      }
    }

    this.items.set(++this.ids, item)
    this.renderButton()
    this.renderPanel()
    return true
  }
  /**
   * 
   * @param {{id:number, $el:HTMLElement}} item 
   */
  removeItem(item) {
    let id = undefined
    for (const it of this.items.entries()) {
      if(it[1].id === item.id) {
        this.items.delete(it[0])
        id = it[0]
      }
    }

    if(!id) {
      return false
    }
    
    this.renderButton()
    this.renderPanel()
    return true
  }

  /**
   * @param {HTMLElement} el
   * @param {HTMLElement} cards
   * @returns 
   */
  static create(el, cards) {
    return new Chart(el, cards)
  }
}
