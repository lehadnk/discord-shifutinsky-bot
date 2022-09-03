# Invitation url
https://discordapp.com/oauth2/authorize?&client_id=1015611373645987861&scope=bot&permissions=2048

# How to compile
```
npm run compile
```

# How to run
```
cd build
echo 'DISCORD_BOT_TOKEN=<YourToken>' >> .env
pm2 start run.js --name="discord-shifutinsky-bot"
```

# How to ask for a song
DM bot with `/пригласить <channel_id>` to add channel to a list of bot permitted channels.

Tag bot with "Спойте, Михаил!" text in the desired channel:
```
@Михаил Шуфутинский Спойте, Михаил!
```
