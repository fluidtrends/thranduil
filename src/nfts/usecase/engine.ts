import blockhash from 'blockhash-core';
import {imageFromBuffer, getImageData} from '@canvas/image';
import {INft} from '../models/nfts';
import {IUseCase} from '../usecase';
import {IRepository} from '../repository';
import {newHash} from '../utils/crypto';
import axios from 'axios';

interface IHexBin {
    [key: string]: string;
}

export class Engine implements IUseCase {
    rp: IRepository;

    constructor(rp: IRepository) {
        this.rp = rp;
    }

    hash = async (imgUrl: string): Promise<string> => {
        try {
            const response = await axios.get(imgUrl, {responseType: 'arraybuffer'});
            if (!response.headers['content-type'].startsWith('image/')) return null;
            const file = Buffer.from(response.data);
            const data = await imageFromBuffer(file);
            const hash = blockhash.bmvbhash(getImageData(data)!, 8);
            return this.hexToBin(hash);
        } catch (e) {
            throw e;
        }
    }

    hexToBin = (hex: string): string => {
        const hexBinLookup: IHexBin = {
            0: '0000', 1: '0001', 2: '0010', 3: '0011', 4: '0100', 5: '0101', 6: '0110', 7: '0111', 8: '1000',
            9: '1001', a: '1010', b: '1011', c: '1100', d: '1101', e: '1110', f: '1111', A: '1010', B: '1011',
            C: '1100', D: '1101', E: '1110', F: '1111',
        };
        let result = '';
        for (let i = 0; i < hex.length; i++) result += hexBinLookup[hex[i]];
        return result;
    }

    calculateSimilarity = (firstHash: string, secondHash: string): number => {
        let similarity = 0;
        firstHash.split('').forEach((bit: string, idx: number) => secondHash[idx] === bit ? similarity++ : null);
        return (similarity / firstHash.length) * 100;
    }

    compareImages = async (parentUrl: string, childUrl: string): Promise<INft> => {
        const parentHash = newHash(parentUrl);
        const childHash = newHash(childUrl);
        const nft = await this.rp.findOneNft({parentUrl: parentHash, childUrl: childHash});
        if (nft) return nft;
        const firstHash = await this.hash(parentUrl);
        const secondHash = await this.hash(childUrl);
        if (!firstHash && !secondHash) return null;
        const similarity = this.calculateSimilarity(firstHash, secondHash);
        const ok = this.rp.insertNft({parentUrl: parentHash, childUrl: childHash, similarityPercentage: similarity});
        if (!ok) throw new Error('Could not insert nft in database');
        return this.rp.findOneNft({parentUrl: parentHash, childUrl: childHash});
    }

}
