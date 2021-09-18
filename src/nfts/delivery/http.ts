import express, {Express, Request, Response} from 'express';
import {IDelivery} from '../delivery';
import {IUseCase} from '../usecase';
import {INft} from '../models/nfts';
import {validURL} from '../utils/sanitizer';

export class Http implements IDelivery {
    uc: IUseCase;
    app: Express;

    constructor(uc: IUseCase, app: Express) {
        this.uc = uc;
        this.app = app;
        this.routes();
    }

    routes = () => {
        this.app.use(express.json());
        this.app.post('/compare', (req: any, res: any) => this.getSimilarity(req, res));
    }

    validateInput = (request: Request, response: Response, key: string) => {
        if (!validURL(request.body[key])) {
            response.status(400);
            response.send({message: `Invalid ${key}, should be a valid url address.`});
            return;
        }
    }

    getSimilarity = async (request: Request, response: Response): Promise<INft> => {
        try {
            if (!request.body?.parent_url && !request.body?.child_url) {
                response.status(400);
                response.send({message: 'Please provide parent_url and child_url'});
            }
            this.validateInput(request, response, 'parent_url');
            this.validateInput(request, response, 'child_url');
            const similarity = await this.uc.compareImages(request.body.parent_url, request.body.child_url);
            if (!similarity) {
                response.status(400);
                response.send({message: 'Invalid parent or child url. The data should be image'});
            }
            response.status(200);
            response.send(similarity);
            return;
        } catch (e) {
            throw e;
        }
    }

}
