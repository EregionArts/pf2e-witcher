/* ------------ variables ------------ */
export const moduleID = 'pf2e-witcher';
export const toxicityKey = {
  heal: ["healing", "vitality"],
  harm: ["poison", "morph", "mutagen", "necromancy", "void"]
}
export const mounstrousTraits = ["abberation", "astral", "beast", "celestial", "construct", "dragon", "elemental", "ethereal", "fey", "fiend", "fungus", "giant", "holy",
                                 "kami", "monitor", "ooze", "petitioner", "shadow", "spirit", "undead", "unholy", "werecreature"]

/* ------------ functions ------------ */
export function genSVGPoints(length){
	let array = [];
	for(let index = 0; index < length; index++){
  	array.push(`<circle r="3.75" cx="${4.2500 + index * 17}" cy="4.25" stroke="black" stroke-width="1"/>`)
  }
  return array
}