import * as dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import { MongoClient } from 'mongodb'

if (!process.env['MONGODB_URL']) {
    throw new Error('Informe a URL da instância MongoDB no arquivo ".env" ou nas váriaveis de ambiente de seu sistema');
}

const api = express();
api.use(express.json());

api.post('/login', (req, res) => {

});

api.use((req, res, next) => {

});

api.get('/me', (req, res) => {

});

const MONGO_URL = process.env['MONGODB_URL'] as string;
MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
    .then(client => {
        Object.assign(global, { client });
        api.listen(process.env['PORT'] || 3000);
    });