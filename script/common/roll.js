export async function rollAttribute(attribute, diceCount) {
    let diceTarget = attribute.value;
    rollDice(attribute.name, diceCount, diceTarget, 0, 20);
}


export async function rollSkill(skill, attribute, diceCount) {
    let diceTarget = attribute.value + skill.expertise;
    rollDice(skill.name, diceCount, diceTarget, skill.focus, 20);
}

async function rollDice(name, diceCount, diceTarget, focusThreshold, complicationThreshold) {
    let attributeRoll = new Roll("(@diceCount)d20cs<@diceTarget", {diceCount: diceCount, diceTarget: diceTarget});
    attributeRoll.roll();
    if (game.dice3d != null) {
        await game.dice3d.showForRoll(attributeRoll);
    }
    let results = attributeRoll.terms[0].results.map(e => e.result);
    let rollData = {
        name: `${name} (${diceCount}d20 with TN ${diceTarget})`,
        diceResult: results.join(', '),
        successCount: results.filter(e => e <= diceTarget).map(e => e <= focusThreshold ? 2 : 1).reduce((a, b) => a + b, 0),
        complicationCount: results.filter(e => e >= complicationThreshold).length
    };
    const html = await renderTemplate("systems/conan2d20/template/chat/roll.html", rollData);
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