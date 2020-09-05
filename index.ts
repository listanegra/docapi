import * as dotenv from 'dotenv'
dotenv.config();

import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import express, { Request } from 'express'
import { MongoClient } from 'mongodb'

import UserController, { Service } from './controller/user-controller'

if (!process.env['MONGODB_URL']) {
    throw new Error('Informe a URL da instância MongoDB no arquivo ".env" ou nas váriaveis de ambiente de seu sistema');
}

// Usado apenas para demonstração da API
const SECRET = '5a8b1e38e2485653a944e2fa13e720340b1eaf5c';

const api = express();
api.use(express.json());

api.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send();
    }

    const client = (global as any).client as MongoClient;
    const query = client.db('docapi')
        .collection('users').find({ username });

    if (await query.hasNext()) {
        const user = await query.next();
        const hash = crypto.createHash('sha512')
            .update(password).digest('hex');

        if (!user['active']) {
            return res.status(401).send({
                mensagem: 'Usuário inativo'
            });
        }

        if (user['hash'] === hash) {
            const token = jwt.sign({ id: user['_id'] }, SECRET, {
                expiresIn: 3600
            });
            return res.status(200).send({ token });
        }

        return res.status(401).send({
            mensagem: 'Senha inválida'
        });
    }

    res.status(400).send({
        mensagem: 'Usuário inexistente'
    });
});

api.post('/user', async (req, res) => {
    const { username, password, email, nome } = req.body;
    if (!username || !password || !email || !nome) {
        return res.status(400).send();
    }

    const client = (global as any).client as MongoClient;
    const query = client.db('docapi')
        .collection('users').find({ username });

    if (await query.hasNext()) {
        return res.status(400).send({
            mensagem: 'Usuário já cadastrado'
        });
    }

    const hash = crypto.createHash('sha512')
        .update(password).digest('hex');
    const result = await client.db('docapi').collection('users')
        .insertOne({ username, hash, active: true });

    await Service.createUser(result.insertedId, email, nome);
    const token = jwt.sign({ id: result.insertedId },
        SECRET, { expiresIn: 3600 });
    return res.status(200).send({ token });
});

api.use((req, res, next) => {
    const token = (req.headers['authorization'] || '')
        .split(/\s/g, 2)[1];
    if (token === undefined) {
        return res.status(401).send();
    }

    jwt.verify(token, SECRET, (error, decoded: any) => {
        if (error) {
            return res.status(403).send();
        }

        Object.assign(req, {
            user: decoded['id']
        });
        next();
    });
});

api.get('/me', (req, res) => {
    const request = req as UserRequest;
    Service.getUser(request.user).then(user => {
        res.status(200).send(user);
    }).catch((error: Error) => {
        res.status(400).send({ mensagem: error.message });
    });
});

api.use('/user', UserController);

const MONGO_URL = process.env['MONGODB_URL'] as string;
MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
    .then(client => {
        Object.assign(global, { client });
        api.listen(process.env['PORT'] || 3000);
    });

declare interface UserRequest extends Request {

    readonly user: string;

}