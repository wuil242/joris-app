import '../../css/search/all.css'
import FormSelect from '../components/FormSelect'
import { debounce, scrollToElement, addLoaderToElement, addLoaderToButton, getFullUrl, throttle } from '../helpers'
import Sticky from '../components/Sticky'
import FetchApi from '../class/FetchApi'

// TODO: ajout d'un panier permettant d'accumuler les prestataire

let FETCH_STATUS = {
  IDLE: 0,
  WORKING: 1,
  DONE: 2
}

let FETCH_STATE = FETCH_STATUS.IDLE

FormSelect.init()

Sticky.define({
  element: '.top-button',
  scrollValue: 150,
})

