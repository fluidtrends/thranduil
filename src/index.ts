import {mongoInit} from './connections/database';
import {MongoClient} from 'mongodb';
import {IRepository} from './nfts/repository';
import {IUseCase} from './nfts/usecase';
import {Nfts} from './nfts/repository/nfts';
import {Engine} from './nfts/usecase/engine';
import {Http} from './nfts/delivery/http';
import express, {Express} from 'express';

const repoInit = (mc: MongoClient): IRepository => new Nfts(mc);
const useCaseInit = (rp: IRepository): IUseCase => new Engine(rp);
const deliveryInit = (uc: IUseCase, app: Express) => new Http(uc, app);

const main = async () => {
    const app = express();
    const mongoClient = await mongoInit();
    deliveryInit(useCaseInit(repoInit(mongoClient)), app);
    app.listen(8080, () => console.log(`Running on port ${8080}`));
};

main().then();
