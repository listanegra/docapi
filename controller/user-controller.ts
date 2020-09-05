import express from 'express'
import UserService from '../service/user-service';

const route = express.Router();
export const Service = new UserService();

route.post('/', (req, res) => {

});

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

});

route.get('/users', (req, res) => {

});

route.get('/users/filter', (req, res) => {

});

export default route;