import { COUNTRY_CODE } from "App/Configs/constants";
import {DateTime} from 'luxon'

export function formatNumberPhone(tel: string):string {
  return tel.includes(COUNTRY_CODE) ? tel : COUNTRY_CODE + tel
}

export function getFormatedDateTime() {
  return DateTime.now().toFormat("dd LLLL yyyy 'à' HH:mm", {locale: 'fr-FR'})
}