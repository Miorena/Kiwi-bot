const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Répond avec Pong! intercatif 🏓"),

  async execute(interaction) {
    const pingEmbed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle("Ping 🏓")
      .setDescription(`Latence: ${interaction.client.ws.ping}ms.`)
      .setTimestamp()
      .setFooter({ text: "キウイ Interactive Labs" });

    const replyButton = new ButtonBuilder()
      .setCustomId("ping_replay")
      .setLabel("Rejouer 🏓")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(replyButton);

    await interaction.reply({ embeds: [pingEmbed], components: [row] });
  },
};
