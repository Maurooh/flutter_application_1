// app.js
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
<<<<<<< HEAD
  user: 'fazendatech',
  password: 'Fazenda123',
  server: 'fazendatech.database.windows.net', // ou o IP do seu servidor
  database: 'Fazendatech',
  options: {
    encrypt: true, // Habilita a criptografia
=======
  user: process.env.DB_USER,        
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,      
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
>>>>>>> 46a0fcc3103a8cc3a357ebfe65347b1f1665f750
    enableArithAbort: true,
  }
};

app.use(cors({
  origin: 'https://flutter-application-1.onrender.com' // Substitua pela sua URL local
}));

sql.connect(dbConfig, err => {  // Altere para dbConfig aqui
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }
    console.log('Conectado ao banco de dados!');
  });


// Rota para cadastrar usuário
app.post('/register', async (req, res) => {
    const { nome, cpf, email, senha, endereco } = req.body;

    // Validações simples
    if (!nome || !cpf || !email || !senha || !endereco) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Conectando ao banco de dados
        await sql.connect(dbConfig);  // Alterado para dbConfig

        // Verificando se o CPF ou e-mail já existem
        const result = await sql.query`SELECT * FROM Cliente WHERE cpf = ${cpf} OR email = ${email}`;
        if (result.recordset.length > 0) {
            return res.status(409).json({ message: 'CPF ou e-mail já cadastrados.' });
        }

        // Inserindo um novo usuário
        await sql.query`INSERT INTO Cliente (nome_cliente, cpf, email, senha, endereco) VALUES (${nome}, ${cpf}, ${email}, ${senha}, ${endereco})`;

        return res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        console.error(error); // Exibir erro no console
        return res.status(500).json({ message: 'Erro ao cadastrar o usuário.', error });
    } finally {
        await sql.close(); // Fecha a conexão com o banco de dados
    }
});

// Rota para login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        await sql.connect(dbConfig);  // Alterado para dbConfig
        const result = await sql.query`SELECT * FROM Cliente WHERE email = ${email} AND senha = ${password}`;
        if (result.recordset.length > 0) {
            res.status(200).send(result.recordset[0]);
        } else {
            res.status(401).send('Credenciais inválidas');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao fazer login');
    }
});

let poolPromise; // Declaramos a variável aqui

// Função para criar a conexão
const createPool = async () => {
  try {
    poolPromise = await new sql.ConnectionPool(dbConfig).connect();  // Alterado para dbConfig
    console.log('Conectado ao banco de dados!');
    return poolPromise;
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
};

createPool();

app.get('/search', (req, res) => {
  const query = req.query.query || '';
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const sql = `SELECT nome, descricao, qtd_disponivel, imagem FROM produtos WHERE nome LIKE ? LIMIT ? OFFSET ?`;

  db.query(sql, [`%${query}%`, limit, offset], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
    res.json(results);
  });
});


app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
