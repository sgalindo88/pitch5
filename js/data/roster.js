// Preset roster: ids 1-10; onPitch[0] is the GK. `pos` is the player's preferred position (GK, DEF, MID, FW).
export const PRESET_ROSTER = {
  onPitch: [1, 2, 3, 4, 5],
  bench: [6, 7, 8, 9, 10],
  byId: {
    1: { name: 'Daniel', pos: 'GK' },    2: { name: 'Oscar', pos: 'DEF' },
    3: { name: 'Sebastian', pos: 'DEF' }, 4: { name: 'Danilo', pos: 'MID' },
    5: { name: 'Juanes', pos: 'FW' },     6: { name: 'Edward', pos: 'DEF' },
    7: { name: 'Juan C', pos: 'MID' },    8: { name: 'Paul', pos: 'MID' },
    9: { name: 'Angel', pos: 'MID' },     10: { name: 'David', pos: 'FW' }
  }
};
