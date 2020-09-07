import express, { Request } from 'express'
import UserService from '../service/user-service';

const route = express.Router();
export const Service = new UserService();

export declare interface UserRequest extends Request {

    readonly user: string;

}

route.get('/:user_id', (req, res) => {
    Service.getUser(req.params['user_id']).then(user => {
        res.status(200).send(user);
    }).catch((error: Error) => {
        res.status(400).send({ mensagem: error.message });
    });
});

route.patch('/:user_id', (req, res) => {

});

route.delete('/:user_id', (req, res) => {
    Service.deleteUser(req.params['user_id']).then(() => {
        res.status(200).send();
    }).catch(() => {
        res.status(400).send({
            mensagem: 'Erro ao deletar usuário'
        });
    });
});

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

export default route;