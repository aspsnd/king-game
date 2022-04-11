import { VitaAttribute } from "./Attribute"

export interface SavedVita {
  index: number
  attr: VitaAttribute
  skills: number[]
  talents: number[]
  talentStars: number
}