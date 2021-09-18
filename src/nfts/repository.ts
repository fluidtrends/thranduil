import {INft} from './models/nfts';
import {IFindOneNft} from './payload/nfts';

export interface IRepository {
    insertNft(nft: INft): Promise<boolean>;

    findOneNft(nft: IFindOneNft): Promise<INft>;
}
