import {genSVGPoints} from "../scripts/utils.mjs"

export const resourcesTemplate = (adrenaline, toxicity, resistance) => `
  <div id="m" class="knots container">
    <div class="knots adrenaline">
      <span class="knots label">ADRENALINE</span>
      <div class="knots display" data-field="adrenaline" data-value="${adrenaline}">
        <div class="overlay adrenaline"></div>
        <svg class="adrenaline-svg" width="76.5" height="8.5">
          <defs>
            <linearGradient id="adrenalineGradient">
              <stop style="stop-color: #ff6a00; stop-opacity: 1" offset="0.0" />
              <stop style="stop-color: #ffb700; stop-opacity: 1" offset="${adrenaline/5}" />
              <stop style="stop-color: #000000; stop-opacity: 1" offset="${Math.min(1,(adrenaline+0.1)/5)}" />
            </linearGradient>
            <linearGradient xlink:href="#adrenalineGradient" id="adrenalineGradientLink" gradientUnits="userSpaceOnUse" />
          </defs>
          <!-- Group 1  -->
          <g id="adrenaline-points" style="fill: url(#adrenalineGradientLink)">
            <circle r="3.25" cx="4.2500" cy="4.25" />
            <circle r="3.25" cx="21.250" cy="4.25" />
            <circle r="3.25" cx="38.250" cy="4.25" />
            <circle r="3.25" cx="55.250" cy="4.25" />
            <circle r="3.25" cx="72.250" cy="4.25" />
          </g>
        </svg>
      </div>
    </div>
    <div class="vertical-line"></div>
    <div class="knots toxicity">
      <span class="knots label">TOXICITY</span>
      <div class="knots display" data-field="toxicity" data-value="${toxicity}">
        <svg class="toxicity-svg" width="${Math.max(8.5, 8.5+(resistance-1)*17)}" height="8.5">
          <defs>
            <linearGradient id="gradientToxicity">
              <stop style="stop-color: #7eb000; stop-opacity: 1" offset="0.0" />
              <stop style="stop-color: #b7ff00; stop-opacity: 1" offset="${toxicity/resistance}" />
              <stop style="stop-color: #000000; stop-opacity: 1" offset="${Math.min(1,(toxicity+0.1)/resistance)}" />
            </linearGradient>
            <linearGradient xlink:href="#gradientToxicity" id="gradientToxicityLink" gradientUnits="userSpaceOnUse" />
          </defs>
          <!-- Group 1  -->
          <g id="toxicity-points" style="fill: url(#gradientToxicityLink)">
            ${genSVGPoints(resistance)}
          </g>
        </svg>
        <div class="horizontal-line" style="width:${Math.max(8.5, 8.5+(resistance-1)*17)}px; left:16px"></div>
        <div class="vertical-line" style="height:12px; position: relative; top: -11px;"></div>
        <svg class="toxicity-svg" width="42.5" height="8.5">
          <defs>
            <linearGradient id="gradientOverdose">
              <stop style="stop-color: #a80000; stop-opacity: 1" offset="0.0" />
              <stop style="stop-color: #b80000; stop-opacity: 1" offset="${Math.max(0,(toxicity-resistance)/(3))}" />
              <stop style="stop-color: #000000; stop-opacity: 1" offset="${Math.min(1,Math.max(0,(toxicity-resistance+0.01)/(3)))}" />
            </linearGradient>
            <linearGradient xlink:href="#gradientOverdose" id="gradientOverdoseLink" gradientUnits="userSpaceOnUse" />
          </defs>
          <!-- Group 1  -->
          <g id="overdose-points" style="fill: url(#gradientOverdoseLink)">
            ${genSVGPoints(3)}
          </g>
        </svg>
      </div>
    </div>
    <div class="vertical-line"></div>
    <div class="knots" style="flex-grow:1; pointer-events:none">
      <span class="knots label" style="opacity:0">Cool Eh?</span>
      <div class="knots display"></div>
    </div>
  </div>`
  
export const uiTemplate = (adrenaline, toxicity) => `
  <div id="resource-icons">
    <button id="adrenaline-icon" data-tooltip-direction="UP" data-tooltip="Adrenaline Points" type="button"><span class="orient-value">${adrenaline}</spans></button>
    <button id="toxicity-icon" data-tooltip-direction="UP" data-tooltip="Toxicity Points" type="button"><span class="orient-value">${toxicity}</spans></button>
  </div>`