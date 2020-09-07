import express, { Request } from 'express'
import UserService, { User } from '../service/user-service';

const route = express.Router();
export const Service = new UserService();

export declare interface UserRequest extends Request {

    readonly user: string;

}

route.get('/users', (req, res) => {
    const { limit, offset } = req.query;
    if (!limit || !offset) {
        return res.status(400).send({
            mensagem: 'Parâmetros de consulta não informados'
        });
    }

    Service.getUsers(Number(limit), Number(offset)).then(users => {
        res.status(200).send(users);
    }).catch(() => {
        res.status(400).send({
            mensagem: 'Não foi possível localizar os usuários'
        });
    });
});

route.get('/users/filter', (req, res) => {

});

route.get('/:user_id', (req, res) => {
    Service.getUser(req.params['user_id']).then(user => {
        res.status(200).send(user);
    }).catch((error: Error) => {
        res.status(400).send({ mensagem: error.message });
    });
});

route.patch('/:user_id', (req, res) => {
    const request = req as UserRequest;
    const { email, nome } = req.body;

    if (!email && !nome) {
        return res.status(400).send();
    }

    if (request.user !== req.params['user_id']) {
        return res.status(400).send({
            mensagem: 'Permissão insuficiente'
        });
    }

    const data = { email, nome } as User;
    Service.editUser(request.user, data).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send({
            mensagem: 'Erro ao editar usuário'
        });
    });
});

route.delete('/:user_id', (req, res) => {
    const request = req as UserRequest;
    if (request.user !== req.params['user_id']) {
        return res.status(400).send({
            mensagem: 'Permissão insuficiente'
        });
    }

    Service.deleteUser(request.user).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send({
            mensagem: 'Erro ao deletar usuário'
        });
    });
});

export default route;