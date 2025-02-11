import { moduleID, toxicityKey, mounstrousTraits } from "./utils.mjs";
import { resourcesTemplate, uiTemplate } from "../templates/partials.mjs";



/* ------------------------ Functions ------------------------ */
/* --- Handle Chat --- */
function damageMessage(actor, item, current, threshold) {
  if ((item + current) > threshold && item > 0) {
    let degree = ((item + current - threshold) === 3) ? 3 : ((item + current - threshold) === 2) ? 2 : 1;
    
    ChatMessage.create({ 
      speaker: {
        alias: actor.getActiveTokens()[0].name,
        scene: actor.getActiveTokens()[0].scene._id,
        token: actor.getActiveTokens()[0].id
      },
      content: `<span class="toxicity-banner">Toxicity levels surge as you suffer an overdose</span><div class="toxicity-effect">Suffer the @UUID[Compendium.pf2e-witcher.witcher-class.Item.jzNuNUeiY08EMhIa]{Overdose ${degree}} condition.<p>This effect may not be removed by any means except those which reduce the toxicity value within your system (e.g: @UUID[Compendium.pf2e-witcher.witcher-class.Item.iELdgiWPDnH7TS9s]{White Honey}).</p></div>`})
  }
}

function useMessage(app, changes){
  if(!app.content.includes("Uses")) return
  app.update({"content":`Uses @UUID[${app.flags.pf2e.origin.sourceId}]`})
}



/* --- Handle Actor Sheet --- */
const injectResources = (html, template) => html[0].querySelector("[data-group='actions-tabs'] header")?.insertAdjacentHTML("beforebegin", template);

function updateActor(app, html, data) {
  if (data.actor.type != "character" || !data.actor.flags?.[moduleID]?.active) return;
  
  /* variables */
  let adrenaline = Math.min(5, data.actor?.flags[moduleID]?.adrenaline) || 0;
  let resistance = data.actor?.flags[moduleID]?.toxicityThreshold || 0;
  let toxicity = Math.min(resistance + 3, data.actor?.flags[moduleID]?.toxicity) || 0;

  function modulate(event) {
    event.preventDefault();
    let clickValue = (event.button === 0 ? 1 : -1);

    if (event.target.dataset.field === "toxicity") damageMessage(app.actor, clickValue, Number(event.target.dataset.value), resistance);

    data.document.setFlag(moduleID, event.target.dataset.field, Math.max(0, clickValue + Number(event.target.dataset.value)));
  }

  /* inject meters */
  injectResources(html, resourcesTemplate(adrenaline, toxicity, resistance));

  /* handle user inputs */
  html[0]?.querySelector("[data-field='toxicity']")?.addEventListener('mouseup', modulate);
  html[0]?.querySelector("[data-field='adrenaline']")?.addEventListener('mouseup', modulate);
  
  /* update crafting ui */
  document.querySelector("[data-ability='witcher-alchemy'] .item-name.reagent-resource h3").innerHTML = "Witcher Alchemy Level:"
  
  /* update ui buttons */
  document.querySelector("#adrenaline-icon .orient-value").innerHTML = adrenaline
  document.querySelector("#toxicity-icon .orient-value").innerHTML = toxicity
}



/* --- Handle UI Buttons --- */
function canvasUI(token, boolean) {
  let flags = token.actor.flags?.[moduleID]
  if (!flags?.active || canvas.tokens.controlled.length > 1) return      //add if mulitple tokens selected return

  document.querySelector("#ui-middle").insertAdjacentHTML("beforeend", uiTemplate(flags.adrenaline, flags.toxicity))

  document.querySelector("#adrenaline-icon").addEventListener("mouseup", adrenalineIcon)
  document.querySelector("#toxicity-icon").addEventListener("mouseup", toxicityIcon)

  if (!boolean) document.querySelectorAll("#resource-icons").forEach((element) => element.remove())
}

/* handle ui button input */
async function modifyValue(event, flagKey) {
  let value = event.button === 0 ? 1 : -1;
  let newValue = value + (_token.actor?.getFlag(moduleID, flagKey) || 0);
  await _token.actor.setFlag(moduleID, flagKey, newValue);
  document.querySelector(`#${flagKey}-icon .orient-value`).innerHTML = newValue
}

function adrenalineIcon(event) {
  modifyValue(event, 'adrenaline');
}

function toxicityIcon(event) {
  modifyValue(event, 'toxicity');
}



/* --- Handle Item Toxicity Use --- */
async function handleToxicity(message) {
  let traits = message.item?.system?.traits.value
  let index = traits?.findIndex((i) => i.includes("toxicity"))
  if (index === -1) return;

  let actor = game.actors.get(message?.speaker?.actor);

  /* toxicity object */
  let toxicity = {
    item: Number(traits?.[index]?.slice(-1)) || 0,
    current: actor?.flags[moduleID]?.toxicity || 0,
    threshold: actor?.flags[moduleID]?.toxicityThreshold || 0
  };

  /* update actor | send damage to chat */
  damageMessage(actor, toxicity.item, toxicity.current, toxicity.threshold);
  await actor?.update({ [`flags.${moduleID}.toxicity`]: toxicity.item + toxicity.current });
}



/* --- Handle Polearms and Spear Hand Requirments --- */
async function handleHands(weapon){
  if (weapon.flags[moduleID]?.handsManagement) {
      return await weapon.update({"hands":"2", "system.usage.hands":2, "system.usage.value":"held-in-two-hands", [`flags.${moduleID}.handsManagement`]:false})
  }
  
  if (weapon.parent?.items.some(feat => feat.name === "Bracing Spearhand") && (weapon.group != "polearm" || weapon.group != "spear") && weapon.hands != "2") return
  
  await weapon.update({"hands":"1", "system.usage.hands":1, "system.usage.value":"held-in-one-hand", [`flags.${moduleID}.handsManagement`]:true})
}


/* ------------------------ Hooks ------------------------ */
function registerHooks() {
  Hooks.on('controlToken', canvasUI)                  /* Handle UI Buttons */
  
  Hooks.on('createChatMessage', useMessage);          /* Handle Consumable Use */

  Hooks.on('preCreateChatMessage', handleToxicity);   /* Handle Item Toxicity Use */

  Hooks.on("renderActorSheet", updateActor);          /* Handle Actor Sheet */
  
  Hooks.on("createItem", handleHands)                 /* Handle Manticore Feat */
}



/* ------------------------ Init ------------------------ */
Hooks.once('init', () => console.log("Initializing | PF2E Witcher"));
Hooks.once("ready", () => registerHooks());



/* ------------------------ Notifications ------------------------ */
Array("renderItemSheet", "renderActorSheet").forEach((update) => Hooks.once(update, (() => console.log("Inserting Witcher Class Details"))));