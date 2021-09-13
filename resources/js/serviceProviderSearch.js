/**
 *
 *
 * @param {string[]} picks derniers choix de l'utlisateur
 */
function lastPick(...picks) {
  picks.forEach((pick) => {
    console.log(pick)
  })
}

/**
 * intialise toute les fonctions
 *
 * @param {string} id l'id du formulaire de recherche
 */
function init() {
  const $form = document.getElementById('js-search')
  const $jobs = $form.querySelector('#js-jobs')
  const $city = $form.querySelector('#js-city')
  const $arrondissememnt = $form.querySelector('#js-arrondissememnt')
  const $quater = $form.querySelector('#js-quater')

  const lastJobPick = sessionStorage.getItem('last_job_pick')
  const lastCityPick = sessionStorage.getItem('last_city_pick')
  const lastArrondissementPick = sessionStorage.getItem('last_arrondissement_pick')
  const lastQuaterPick = sessionStorage.getItem('last_quater_pick')

  lastPick(lastJobPick, lastCityPick, lastArrondissementPick, lastQuaterPick)

  if ($jobs) {
    $jobs.addEventListener('change', (e) => {
      const value = e.target.value
      console.log(value)
    })
  }
}

export default { init }
