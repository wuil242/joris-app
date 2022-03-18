import '../../css/user_profil/all.css'

const el_update_image_btn = document.getElementById('image-change-btn')
const el_remove_image_btn = document.getElementById('image-remove-btn')
const el_file_input = document.getElementById('profil-image-input')
// const el_send_btn = document.getElementById('send-file-btn')

el_update_image_btn.addEventListener('click', e => {
  e.preventDefault()
  e.stopImmediatePropagation()
  e.stopPropagation()
  el_file_input.click()
})

el_file_input.addEventListener('input', () => {
  el_file_input.parentElement.submit()
})

el_remove_image_btn.addEventListener('click', () => {
  el_file_input.value = null
  el_file_input.parentElement.submit()
})

