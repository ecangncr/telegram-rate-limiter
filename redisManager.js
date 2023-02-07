
const { createClient } = require('redis');

const createRedisClient = async () =>{

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
    

    client.on('error', (err) => console.log('Redis Client Error', err));

    client.on('connect', () => console.log('Redis Client Connect'));

    await client.connect();
    
    return client;

}

const redisManager = async () =>{

    const redisClient = await createRedisClient();

    const setBotData = async (botSlug,payload,PX_MilliSeconds) => {

        const REDIS_FOLDER = "BOT_MESSAGE_COUNT";

        const TXT = REDIS_FOLDER + ":" + botSlug;

        const result = await redisClient.set(TXT,JSON.stringify(payload),    {
            PX: PX_MilliSeconds,
        });
    
        return result;
        
    }

    const getBotData = async (botSlug)=>{
        const REDIS_FOLDER = "BOT_MESSAGE_COUNT";

        const TXT = REDIS_FOLDER + ":" + botSlug;
    
        const result = await redisClient.get(TXT);

        if(result==null){

            return null;
        }
        else{
            return JSON.parse(result);
        }
        
    }

    const getChatData = async (botSlug,chatID)=>{
        const REDIS_FOLDER = "CHAT_MESSAGE_COUNT";

        const TXT = REDIS_FOLDER + ":" + botSlug+"-"+chatID;
    
        const result = await redisClient.get(TXT);

        if(result==null){

            return null;
        }
        else{
            return JSON.parse(result);
        }
        
    }

    const setChatData = async (botSlug,chatID,payload,PX_MilliSeconds) => {
        const REDIS_FOLDER = "CHAT_MESSAGE_COUNT";

        const TXT = REDIS_FOLDER + ":" + botSlug+"-"+chatID;

        const result = await redisClient.set(TXT,JSON.stringify(payload),
            {
                PX: PX_MilliSeconds,
            }
        );

        return result;
        
    }
    
    return {

        redisClient,
        getBotData,
        setBotData,
        getChatData,
        setChatData
    }

}

module.exports.redisManagerSetup = redisManager;