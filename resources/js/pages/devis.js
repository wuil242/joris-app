import '../../css/devis/all.css'
import FormSelect from '../components/FormSelect'
import {removeInputErrorsAfterFocus} from '../helpers'


removeInputErrorsAfterFocus()

try {
  FormSelect.init()
}catch{}

// TODO: creer une carte speciale pour l'affichage du prestataire ou des prestataire
// qui vont recevoir le devis [dans la page d'envoi de devis client /devis/client]