import {MongoClient} from 'mongodb';

export const mongoInit = async (): Promise<MongoClient> => {
    if (!process.env.MONGO_URI) throw new Error('Please provide mongo uri');
    const client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    return client;
};
