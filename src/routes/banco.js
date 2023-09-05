const { Router } = require('express');
const { dadosBanco, todasContas, criarConta, atualizarUsuario, excluirConta, depositar, sacar, transferir, saldo, extrato} = require('../controllers/banco');
const { validaSenha, validaCriarConta, validaAtualizacao, validaExcluirConta, validaDeposito, validaSaque, validaTransferencia, validaSaldo, validaExtrato} = require('../middlewares/banco');



const route = Router();

route.get('/', dadosBanco);
route.get('/contas', validaSenha, todasContas);
route.post('/contas', validaCriarConta, criarConta);
route.put('/contas/:numeroConta/usuario', validaAtualizacao, atualizarUsuario);
route.delete('/contas/:numeroConta', validaExcluirConta, excluirConta);
route.post('/transacoes/depositar', validaDeposito, depositar);
route.post('/transacoes/sacar', validaSaque, sacar);
route.post('/transacoes/transferir', validaTransferencia, transferir);
route.get('/contas/saldo', validaSaldo, saldo);
route.get('/contas/extrato', validaExtrato, extrato);


module.exports = route;

