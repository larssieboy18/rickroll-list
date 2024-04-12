/* 
This example was created using Autocode, which has shutdown in April 2024. It will therefore not necessarily work in every application that you copy paste it in to.
However, it might help you when developing your own use-case for this repo.
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// set variables
let {id, guild_id, channel_id, content, author} = context.params.event;
let {username} = author;

// get the latest data (rickroll links and responses) from github
let rickroll = (
  await lib.http.request['@1.1.6'].get({
    url: `https://raw.githubusercontent.com/larssieboy18/rickroll-list/main/rickrolls.json`,
  })
).data.rickrolls;
let response = (
  await lib.http.request['@1.1.6'].get({
    url: `https://raw.githubusercontent.com/larssieboy18/rickroll-list/main/responses.json`,
  })
).data.discord;

// run the following code for every url that is listed
for (let i = 0; i < rickroll.length; i++) {
  let rickrollLink = rickroll[i];
  // because URL's contain special characters, we need to filter those
  let specialCharacters = rickroll[i].match(/\W/gi);
  for (let z = 0; z < specialCharacters.length; z++) {
    rickrollLink = rickrollLink.replace(/(?<!\\)(\/|\.|\?|\=|\%|\:|\#|\$|\+)/i,`\\${specialCharacters[z]}`);
  }

  // URL's sometimes contain http://, https:// and/or www. This allows them to also be caught (although it would work without it)
  rickrollLink = new RegExp(`(http(s)?\:\/\/)?(www)?${rickrollLink}`, `gi`);
  // if the contain contains a rickroll link, execute the rest of the code. Feel free to edit this part
  if (content.match(rickrollLink)) {
    // create a reaction to the message contain the rickroll
    await lib.discord.channels['@0.3.0'].messages.reactions.create({
      emoji: `🔄`,
      message_id: id,
      channel_id: channel_id,
    });

    // send a new message (replying to the message containing the rickroll) calling them out
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: '',
      tts: false,
      message_reference: {
        message_id: id,
        channel_id: channel_id,
        guild_id: guild_id,
        fail_if_not_exists: true,
      },
      embeds: [
        {
          type: 'rich',
          title: `${response[Math.floor(Math.random() * response.length)]}`,
          description: ``,
          color: 0x2f3136,
          image: {
            url: `https://file.coffee/u/wI_H_Ux_1FXjtV.png`,
            height: 0,
            width: 0,
          },
        },
      ],
    });
    return console.log(`RICKROLL SPOTTED!`);
  }
}
return console.log(`The message did not contain a rickroll. \nIf you believe this message did contain a rickroll, please submit it at: \nhttps://github.com/larssieboy18/rickroll-list`);
