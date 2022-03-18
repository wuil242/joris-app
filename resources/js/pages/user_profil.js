import '../../css/user_profil/all.css'

const el_update_image_btn = document.getElementById('image-profil-btn')
const el_file_input = document.getElementById('profil-image-input')
// const el_send_btn = document.getElementById('send-file-btn')

el_update_image_btn.addEventListener('click', e => {
  e.preventDefault()
  el_file_input.click()
})

el_file_input.addEventListener('change', () => {
  el_file_input.parentElement.submit()
})

