const {redisManagerSetup} = require('./redisManager');

const initRateLimiter = async() => {

const redisManager = await redisManagerSetup();

const  isOverLimit = async (botSlug,chatID,{maxBotMessage,maxChatMessage,waitTime}) => {

    return new Promise(async (resolve, reject) => {

        const botData = await redisManager.getBotData(botSlug);

        if (!botData) {

            await redisManager.setBotData(botSlug, { timestamp: Date.now(), count: maxBotMessage -1 },waitTime);
            await redisManager.setChatData(botSlug,chatID, { timestamp: Date.now(), count: maxChatMessage -1 },waitTime);
            return resolve();
        }

        const botDiff = timestampDif(botData.timestamp, Date.now());

        if (botDiff >= waitTime) {

            await redisManager.setBotData(botSlug, { timestamp: Date.now(), count: maxBotMessage -1 },waitTime);
            await redisManager.setChatData(botSlug,chatID, { timestamp: Date.now(), count: maxChatMessage -1 },waitTime);
            return resolve();
        }

        if (botData.count <= 0) {
            return reject("Limit reached botData.count");
        }

        const chatData = await redisManager.getChatData(botSlug,chatID);

        if (!chatData) {

            await redisManager.setBotData(botSlug, { timestamp: botData.timestamp, count: botData.count - 1 },waitTime);
            await redisManager.setChatData(botSlug,chatID, { timestamp: Date.now(), count: maxChatMessage -1 },waitTime);
            return resolve();
        }

        const chatDiff = timestampDif(chatData.timestamp, Date.now());

        if (chatDiff >= waitTime) {
        
            await redisManager.setBotData(botSlug, { timestamp: botData.timestamp, count: botData.count - 1 },waitTime);
            await redisManager.setChatData(botSlug,chatID, { timestamp: Date.now(), count: maxChatMessage -1  },waitTime);
            return resolve();
        }

        if (chatData.count <= 0) {
            return reject("Limit reached chatData.count");
        }

        await redisManager.setBotData(botSlug, { timestamp: botData.timestamp, count: botData.count - 1 },waitTime);
        await redisManager.setChatData(botSlug,chatID,{ timestamp: chatData.timestamp, count: chatData.count - 1 },waitTime);

        return resolve();

     });

}

const timestampDif = (t1,t2) =>  {

    const _diff = t2 - t1;

    return _diff;
}

return {

    isOverLimit

}

}

module.exports = {initRateLimiter};