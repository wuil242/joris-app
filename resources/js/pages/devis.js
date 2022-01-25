import '../../css/devis/all.css'
import Alert from '../components/Alert'
import FormSelect from '../components/FormSelect'
import {removeInputErrorsAfterFocus} from '../helpers'

Alert.init()

removeInputErrorsAfterFocus()

try {
  FormSelect.init()
}catch{}

// TODO: creer une carte speciale pour l'affichage du prestataire ou des prestataire
// qui vont recevoir le devis [dans la page d'envoi de devis client /devis/client]