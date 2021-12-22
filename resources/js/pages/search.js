import '../../css/search/all.css'
import FetchApi from '../class/FetchApi'

const $form = document.forms[0]
const fields = Array.from($form.querySelectorAll('.search-field > select'))
const LAST_QUERY = {}

console.log(fields)

$form.addEventListener('change', handleFormChange)

/**
 * 
 * @param {SubmitEvent} e 
 */
function handleFormChange(e) {
  e.preventDefault()
  const id = e.target.id 
  if( id === 'job' || id === 'quater' ) {
    LAST_QUERY[id] = e.target.value
    console.log('find sp')
    return
  }
  const query = getFieldValue(fields, e.target)
  console.log(query)
  FetchApi.getForm(query).then(data => {
    $form.innerHTML = data
  })
}

/**
 * 
 * @returns {{
   *  job:number, 
 *  arrondissement:number, 
 *  quater:number
 * }}
 */
function getFieldValue($fields, $curentFiled) {
  for (const field of $fields) {
    if(field.id === $curentFiled.id) {
      LAST_QUERY[$curentFiled.id] = $curentFiled.value
    }
  }
  
  return LAST_QUERY
}