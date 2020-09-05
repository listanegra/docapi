import express from 'express'
import UserService from '../service/user-service';

const route = express.Router();
const service = new UserService();

route.post('/', (req, res) => {

});

route.get('/:user_id', (req, res) => {

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