import {INft} from './models/nfts';

export interface IUseCase {
    hash(imgUrl: string): Promise<string>;

    hexToBin(hex: string): string;

    calculateSimilarity(firstHash: string, secondHash: string): number;

    compareImages(parentUrl: string, childUrl: string): Promise<INft>;
}
