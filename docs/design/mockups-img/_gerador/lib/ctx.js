const defs = new Map();

module.exports = {
  addDef(id, xml) {
    defs.set(id, xml);
  },
  takeDefs() {
    const out = [...defs.values()].join('');
    defs.clear();
    return out;
  },
};
