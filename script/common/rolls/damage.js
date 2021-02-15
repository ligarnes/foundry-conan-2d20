function _getRangeAttackName(attack) {
  return `${attack.name} (R) - ${attack.data.data.range}`;
}

function _getMeleeAttackName(attack) {
  const reach = attack.data.data.range.slice(6);
  return `${attack.name} (M) - ${reach}`;
}

function _getAttackName(attack) {
  return attack.data.data.type === 'melee' ? _getMeleeAttackName(attack) : _getRangeAttackName(attack);
}

export async function rollDamage(characterName, attack) {
  const name = _getAttackName(attack);
  const image = attack.data.img;
  const diceCount = attack.data.data.damage;
  const effects = attack.data.data.qualities;
  await rollDiceDamage(characterName, name, effects, diceCount, image);
}

async function rollDiceDamage(characterName, testName, qualities, diceCount, imagePath) {
  let attributeRoll = new Roll("(@diceCount)d6", {diceCount: diceCount});
  attributeRoll.roll();
  if (game.dice3d != null) {
    await game.dice3d.showForRoll(attributeRoll);
  }
  let results = attributeRoll.terms[0].results.map(e => e.result);
  let rollData = {
    name: `${characterName}`,
    title: `${testName}`,
    image: imagePath,
    diceResult: results.join(', '),
    effectCount: results.map(e => (e === 5 || e === 6) ? 1 : 0).reduce((a, b) => a + b, 0),
    damageCount: results.filter(e => e !== 3 && e !== 4).map(e => (e === 5 || e === 6) ? 1 : e).reduce((a, b) => a + b, 0),
    reroll: `[[/roll 1d6]]`,
    effects: `${qualities}`
  };
  const html = await renderTemplate("systems/conan2d20/template/chat/roll-damage.html", rollData);
  let chatData = {
    user: game.user._id,
    rollMode: game.settings.get("core", "rollMode"),
    content: html,
  };
  if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
    chatData.whisper = ChatMessage.getWhisperRecipients("GM");
  } else if (chatData.rollMode === "selfroll") {
    chatData.whisper = [game.user];
  }
  ChatMessage.create(chatData);
}