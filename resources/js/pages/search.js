import '../../css/search/all.css'

const form = document.forms[0]

form.addEventListener('change', () => {
  form.submit()
})