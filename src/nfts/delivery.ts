import {INft} from './models/nfts';
import {Request, Response} from 'express';

export interface IDelivery {
    getSimilarity(request: Request, response: Response): Promise<INft>;
}
