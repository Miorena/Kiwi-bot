const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plop")
    .setDescription("Répète le texte que tu lui donne !")
    .addStringOption((option) =>
      option
        .setName("texte")
        .setDescription("Le message que キウイ doit répèter")
        .setRequired(true),
    ),

  async execute(interaction) {
    const inputText = interaction.options.getString("texte");
    await interaction.reply(`Plop! ${inputText}`);
  },
};
