// Importations des classes necessaires de discord.js
require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  Collection,
  MessageFlags,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

// On instancie le client Discord avec ses "Intents" (Permissions d'ecoute)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Permet au bot de savoir qu'il est sur un server
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

client.commands = new Collection(); // Creer une collectio pour stocker en memoire les commandes

// Chargement dynamique des fichiers de commandes
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

const commandsData = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  // Stocke la commande dans la collection avec son nom comme clé
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    commandsData.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] La commande à ${filePath} manque d'une propriété "data" ou "execute".`,
    );
  }
}

// Enregistrements des commandes sur Discord
client.once("ready", async (readyClient) => {
  console.log(`Succès! ${readyClient.user.tag} est en ligne !`);

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log(
      `Début du rafraîchissement des ${commandsData.length} comme Slash globales...`,
    );

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commandsData,
    });

    console.log("Application des commandes Slash réussie !");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement: ", error);
  }
});

// Interaction dynamique
client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    // Recuperation de la commande correspondante
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `Aucune commande correspondante à ${interaction.commandName} n'a été trouvée.`,
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Une erreur est survenue lors de l'execution !",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "Une erreur est survenue lors de l'execution !",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  } else if (interaction.isButton) {
    if (interaction.customId === "ping_replay") {
      const newPing = interaction.client.ws.ping;

      const updatedPingEmbed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle("Re-Ping 🏓")
        .setDescription(`Nouvelle latence: ${newPing}ms.`)
        .setTimestamp()
        .setFooter({ text: "キウイ Labs - Replay" });

      await interaction.update({ embeds: [updatedPingEmbed] });
    }
  }
});

// Connexion du bot grace au Token recupere sur le portail
client.login(TOKEN);
