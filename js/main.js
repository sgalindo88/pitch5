// App entry point: wire modules together and boot.
import { state } from './state.js';
import { loadRoster } from './storage.js';
import { buildStatic, buildTokens } from './pitch.js';
import { setSyncHandler, resetPositions } from './animation.js';
import { initRoster } from './roster.js';
import { initPanels, selectTab } from './panels.js';
import { initControls, applyLang, syncUI } from './controls.js';
import { initInput } from './input.js';
import { initBadgeSpace } from './badge.js';

state.roster = loadRoster();
setSyncHandler(syncUI);
buildStatic();
buildTokens();
initRoster();
initPanels();
initControls();
initInput();
selectTab('formation');
resetPositions();
applyLang();
initBadgeSpace();
