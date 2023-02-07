

## Telegram Rate Limiter

Telegram bot rate limiter that supports multiple bots at the same time.

Can be used to limit the number of messages sent by a user using the Token Bucket algorithm



## Example

```js
const rateLimiter = require('./rateLimiter')

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot("TELEGRAM_BOT_TOKEN", {polling: true})


const main = async()=> {
    const {isOverLimit} = await rateLimiter.initRateLimiter()

    const limitOptions = {
        //A bot can send 1 message per user and 30 messages in total in 1000 milliseconds

        maxBotMessage:30,//total messages per bot

        maxChatMessage:1, // total messages per chatID

        waitTime:1000 // wait time in milliseconds

        }

    const botSlug = "TEST";

    bot.on("message", async (msg) => {
     
            const chatID = msg.chat.id;

            isOverLimit(botSlug,chatID,limitOptions).then(()=>{
                bot.sendMessage(chatId, "Hello World!");
            }).catch(e=>{
            // catch rate limit errors
        })


    });

}

main();

```


### Redis

Don't forget to set the connection settings in redisManager.js


```js
    
    const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';

    const REDIS_PORT_NUMBER= process.env.REDIS_PORT_NUMBER || 6379;

    const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';


    
    const client = await createClient({
        socket: {
            host: REDIS_HOST,
            port: REDIS_PORT_NUMBER
        },
        password: REDIS_PASSWORD
    });

```