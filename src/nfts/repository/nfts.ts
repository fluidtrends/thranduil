import {INft} from '../models/nfts';
import {IFindOneNft} from '../payload/nfts';
import {IRepository} from '../repository';
import {MongoClient} from 'mongodb';

export class Nfts implements IRepository {
    mc: MongoClient;

    constructor(mc: MongoClient) {
        this.mc = mc;
    }

    insertNft = async (nft: INft): Promise<boolean> => {
        try {
            const database = this.mc.db('opes');
            const nfts = database.collection<INft>('nfts');
            await nfts.insertOne(nft);
            return true;
        } catch (e) {
            throw e;
        }
    }

    findOneNft = async (nft: IFindOneNft): Promise<INft> => {
        const database = this.mc.db('opes');
        const movies = database.collection<INft>('nfts');
        return movies.findOne<INft>(nft);
    }

}
