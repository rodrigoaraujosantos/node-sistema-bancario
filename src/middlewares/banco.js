const { contas } = require('../db/bancodedados');

const validaSenha = (req, res, next) => {
  const { senha_banco } = req.query;
  
  if(!senha_banco){
    return res.status(400).json({"mensagem": "Informe a senha de acesso."});
  };

  if(senha_banco !== 'Cubos123Banck'){
    return res.status(401).json({"mensagem": "Senha incorreta, usuário não está autenticado."});
  };

  next();
};


const validaCriarConta = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  
  if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
    return res.status(400).json({"mensagem": "Dados incompletos."});
  };
  
  if(validaCpf(cpf)){
    return res.status(400).json({
      "mensagem": "Já existe uma conta com o cpf informado."
    });
  };

  if(validaEmail(email)){
    return res.status(400).json({
      "mensagem": "Já existe uma conta com o email informado."
    });
  };

  next();
};

const validaAtualizacao = (req, res, next) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
    return res.status(400).json({"mensagem": "Dados incompletos."});
  };

  if(!contaValida(numeroConta)){
    return res.status(400).json({"mensagem": "Conta inexistente."});
  };

  const resultado = contas.filter((conta) => {
    return conta.numero !== numeroConta;
  });

  const cpfExistente = resultado.find((conta) => {
    return conta.cpf === cpf;
  });

  if(cpfExistente){
    return res.status(400).json({
      "mensagem": "O CPF informado já existe cadastrado."
    });
  };

  const emailExistente = resultado.find((conta) => {
    return conta.email === email;
  });

  if(emailExistente){
    return res.status(400).json({
      "mensagem": "O email informado já existe cadastrado."
    });
  };
  
  next();
};

const validaExcluirConta = (req, res, next) => {
  const { numeroConta } = req.params;

  if(!contaValida(numeroConta)){
    return res.status(404).json({"mensagem": "Conta inexistente."});
  };

  const indice = contas.indexOf(contaValida(numeroConta));

  const saldo = contas[indice].saldo;

  if(saldo !== 0){
    return res.status(400).json({
      "mensagem": "A conta só pode ser removida se o saldo for zero."
    });
  };

  next();
};

const validaDeposito = (req, res, next) => {
  const { numero_conta, valor } = req.body;

  if(!numero_conta){
    return res.status(400).json({
      "mensagem": "O número da conta é obrigatório."
    });
  };

  if(!valor){
    return res.status(400).json({"mensagem": "Informe o valor para depósito."});
  };
 
  if(!contaValida(numero_conta)){
    return res.status(404).json({"mensagem": "Conta inexistente."});
  };

  next();
};

const validaSaque = (req, res, next) => {
  const { numero_conta, valor, senha} = req.body;
  
  if(!numero_conta || !valor || !senha){
    return res.status(400).json({"mensagem": "Informe o número da conta, a senha e o valor do saque."});
  };

  if(!contaValida(numero_conta)){
    return res.status(404).json({"mensagem": "Conta inexistente."});
  };

  if(!validaSenhaUsuario(numero_conta, senha)){
    return res.status(400).json({"mensagem": "Senha inválida."})
  };

  const resultado = contaValida(numero_conta);

  if(valor > resultado.saldo){
    return res.status(400).json({
      "mensagem": "Saldo insuficiente."
    });
  };

  next();
};

const validaTransferencia = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if(!numero_conta_origem || !numero_conta_destino || !valor || !senha){
    return res.status(400).json({"mensagem": "Dados incompletos."});
  };

  if(numero_conta_origem === numero_conta_destino){
    return res.status(400).json({"mensagem": "Número da conta de origem é igual ao número da conta de destino."})
  }

  if(!contaValida(numero_conta_origem)){
    return res.status(404).json({"mensagem": "Conta de origem inexistente."});
  };

  if(!contaValida(numero_conta_destino)){
    return res.status(404).json({"mensagem": "Conta de destino inexistente."});
  };

  if(!validaSenhaUsuario(numero_conta_origem, senha)){
    return res.status(400).json({"mensagem": "Senha incorreta."});
  };

  const resultado = contaValida(numero_conta_origem);

  if(valor > resultado.saldo){
    return res.status(400).json({
      "mensagem": "Saldo insuficiente."
    });
  };

  next();
};

const validaSaldo = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  if(!numero_conta || !senha){
    return res.status(400).json({"mensagem": "Informe a conta e a senha para obter o saldo."});
  };

  if(!contaValida(numero_conta)){
    return res.status(404).json({"mensagem": "Conta bancária não encontada."});
  };

  if(!validaSenhaUsuario(numero_conta, senha)){
    return res.status(400).json({"mensagem": "Senha incorreta."});
  };

  next();
};


const validaExtrato = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  if(!numero_conta || !senha){
    return res.status(400).json({"mensagem": "Informe o número da conta e a senha."});
  };

  if(!contaValida(numero_conta)){
    return res.status(404).json({"mensagem": "Conta inexistente."});
  };

  if(!validaSenhaUsuario(numero_conta, senha)){
    return res.status(400).json({"mensagem": "Senha incorreta."});
  };

  next();
};


const contaValida = (numeroConta) => {
  const resultado = contas.find((conta) => {
    return conta.numero === Number(numeroConta);
  });
  
  return resultado;
};


const validaCpf = (cpf) => {
  const resultado = contas.find((conta) => {
    return conta.cpf === cpf;
  });

  return resultado;
};

const validaEmail = (email) => {
  const resultado = contas.find((conta) => {
    return conta.email === email;
  });

  return resultado;
};

const validaSenhaUsuario = (numero_conta, senha) => {
  const resultado = contas.find((conta) => {
    return conta.numero === Number(numero_conta);
  });

  if(resultado.senha === senha){
    return true;
  }
};



module.exports = {
  validaSenha,
  validaCriarConta,
  validaAtualizacao,
  validaExcluirConta,
  validaDeposito,
  validaSaque,
  validaTransferencia,
  validaSaldo,
  validaExtrato
};