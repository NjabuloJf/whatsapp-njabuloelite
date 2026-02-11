
import config from '../config.cjs';

const gcEvent = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'welcome') {
    try {
      const groupMetadata = await Matrix.groupMetadata(m.from);
      const participants = groupMetadata.participants;
      const superUser = config.SUPER_USER.includes(m.sender);
      const isVerifiedAdmin = participants.find(p => p.id === m.sender)?.admin;

      if (!superUser && !isVerifiedAdmin) return m.reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");

      let responseMessage;
      if (text === 'on') {
        config.WELCOME = true;
        responseMessage = "✅ *WELCOME & GOODBYE MESSAGES ENABLED*\nThe bot will now send welcome messages when new members join and goodbye messages when members leave.";
      } else if (text === 'off') {
        config.WELCOME = false;
        responseMessage = "❌ *WELCOME & GOODBYE MESSAGES DISABLED*\nThe bot will no longer send welcome or goodbye messages.";
      } else {
        responseMessage = `📋 *WELCOME COMMAND USAGE*\n*Enable:* ${prefix}welcome on\n*Disable:* ${prefix}welcome off\n*Current Status:* ${config.WELCOME ? '✅ Enabled' : '❌ Disabled'}`;
      }

      await Matrix.sendMessage(m.from, { text: " ", contextInfo: { externalAdReply: { title: `👋hy ${m.pushName}`, body: responseMessage, thumbnailUrl: "", mediaType: 1, renderLargerThumbnail: false, sourceUrl: "https://github.com/NjabuloJf/Njabulo-Jb", } } }, { quoted: m });
    } catch (error) {
      console.error("Error processing welcome command:", error);
      let errorMessage = "❌ *ERROR PROCESSING COMMAND*";
      await Matrix.sendMessage(m.from, { text: " ", contextInfo: { externalAdReply: { title: `👋hy ${m.pushName}`, body: errorMessage, thumbnailUrl: "", mediaType: 1, renderLargerThumbnail: false, sourceUrl: "https://github.com/NjabuloJf/Njabulo-Jb", } } }, { quoted: m });
    }
  }
};

export default gcEvent;

