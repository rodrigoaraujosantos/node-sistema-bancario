let { banco, contas, numero, depositos, saques, transferencias } = require('../db/bancodedados');
const format = require('date-fns/format')

const dadosBanco = (req, res) => {
  return res.status(200).json(banco);
}

const todasContas = (req, res) => {
  return res.status(200).json(contas);
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const novaConta = {
    numero: numero++,
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
    saldo: 0
  };
  contas.push(novaConta);
  return res.status(201).json({"mensagem": "Conta criada com sucesso."})
};

const atualizarUsuario = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const resultado = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  });

  const indice = contas.indexOf(resultado);

  const novosDados = {
    numero: contas[indice].numero,
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
    saldo: contas[indice].saldo
  };

  contas[indice] = novosDados;

  return res.status(200).json({"mensagem": "Usuário atualizado com sucesso."})
};

const excluirConta = (req, res) => {
  const { numeroConta } = req.params;
  const resultado = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  });

  const indice = contas.indexOf(resultado);
  
  contas.splice(indice, 1);

  return res.status(200).json({"mensagem": "Conta excluida."})
};

const depositar = (req, res) => {  
  const { numero_conta, valor } = req.body;

  const resultado = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  resultado.saldo += valor;

  const data = new Date();

  const dataFormatada = format(data, 'yyyy-MM-dd HH:mm:ss');

  const registro = {
    data: dataFormatada,
    numero_conta,
    valor
  };

  depositos.push(registro);

  return res.status(200).json({"mensagem": "Depósito realizado."});
};

const sacar = (req, res) => {
  const { numero_conta, valor } = req.body;

  const resultado = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  resultado.saldo -= valor;

  const data = new Date();

  const dataFormatada = format(data, 'yyyy-MM-dd HH:mm:ss');

  const registro = {
    data: dataFormatada,
    numero_conta,
    valor
  };

  saques.push(registro);

  return res.status(200).json({"mensagem": "Saque realizado."});
};

const transferir = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor } = req.body;

  const contOrigem = contas.find((conta) => {
    return conta.numero === Number(numero_conta_origem);
  });

  const contDestino = contas.find((conta) => {
    return conta.numero === Number(numero_conta_destino);
  });
  
  contOrigem.saldo -= valor;

  contDestino.saldo += valor;

  const data = new Date();

  const dataFormatada = format(data, 'yyyy-MM-dd HH:mm:ss');

  const transferencia = {
    data: dataFormatada,
    numero_conta_origem: numero_conta_origem,
    numero_conta_destino: numero_conta_destino,
    valor
  };

  transferencias.push(transferencia);

  return res.status(200).json({"mensagem": "Transferencia realizada."});
};

const saldo = (req, res) => {
  const { numero_conta } = req.query;

  const resultado = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  return res.status(200).json({"saldo": resultado.saldo});
};

const extrato = (req, res) => {
  const { numero_conta } = req.query;
  
  const saquesEfetuados = saques.filter((saque) => {
    return saque.numero_conta === numero_conta;
  });

  const depositosRecebidos = depositos.filter((deposito) => {
    return deposito.numero_conta === numero_conta;
  });

  const transferenciasEnviadas = transferencias.filter((transf) => {
    return transf.numero_conta_origem === numero_conta;
  });

  const transferenciasRecebidas = transferencias.filter((transf) => {
    return transf.numero_conta_destino === numero_conta;
  });

  return res.status(200).json({
    "depósitos": depositosRecebidos,
    "saques": saquesEfetuados,
    transferenciasEnviadas,
    transferenciasRecebidas
  });

};


module.exports = {
  dadosBanco,
  todasContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  depositar,
  sacar,
  transferir,
  saldo,
  extrato
}