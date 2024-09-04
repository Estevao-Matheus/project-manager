[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/9hYCjdXT)
# Documento de Requisitos do Sistema de Gerenciamento de Projetos

Esta documentação tem como objetivo detalhar os requisitos para o desenvolvimento de um <strong>Sistema de Gerenciamento de Projetos (SGP).</strong> O sistema será uma aplicação web completa, com backend e frontend integrados, projetada para facilitar a gestão de projetos e usuários/colaboradores. 

## Objetivo

O objetivo principal do Sistema de Gerenciamento de Projetos é fornecer uma plataforma intuitiva e robusta para a administração de projetos. Através do SGP, os usuários poderão criar, editar, visualizar e remover projetos, além de gerenciar usuários vinculados a esses projetos, categorizando-os por seus papéis específicos.


## Tecnologias obrigatórias
- **Node JS (API REST)**
- **React JS**
- **Typescript**
- **MySQL**
- **JWT**
- **GIT**
  

## Estrutura do Projeto 

```
- 📂gerenciamento-projetos
  - 📂backend
    - Container(Caso utilize)
  - 📂frontend
    - Container(Caso utilize)
```

- 📂**gerenciamento-projetos**: Pasta raiz do projeto.
- 📂**backend**: Contém o código relacionado ao servidor (API RESTful).
- 📂**frontend**: Contém o código da interface do usuário.

## Banco de dados 

Abaixo está a estrutura da base de dados do projeto:

Projetos:
```
id: integer
nome: varchar
descricao: text
data_inicio: date
data_fim: date
status: varchar (ex: 'Em andamento', 'Concluído', 'Pendente')
```

Usuários:
```
id: integer
nome: varchar
email: varchar
senha: varchar
papel: varchar (ex: 'Gerente', 'Desenvolvedor', 'Designer')
```

Projetos_Usuários:
```
usuario_id: integer (referência ao usuário)
projeto_id: integer (referência ao projeto)
```

# **Backend** 

O backend será responsável por fornecer uma API RESTful que permitirá a interação com os dados do sistema. A API terá endpoints para realizar operações CRUD (Create, Read, Update, Delete) em projetos e usuários além da autenticação do login e registro de usuários usando JWT.

# **Estrutura do Backend**

- Diretório backend: Contém o código do servidor.
- Container (opcional): Para facilitar a execução e o isolamento do ambiente.

## Observação

Solicitamos que façam o uso do Node JS em uma versão 18 ou superior

## Endpoints da API 

Esperamos os seguintes endpoints da API para este primeiro projeto: 

### **Projetos**

- **Listar projetos (GET):** `/api/projetos`

  - **Resposta de Sucesso (200):** Retorna um array com os projetos.

  ```json
  [
    {
      "id": 1,
      "nome": "Nome do Projeto",
      "descricao": "Descrição do Projeto",
      "data_inicio": "2024-01-01",
      "data_fim": "2024-12-31",
      "status": "Em andamento"
    },
  ]
  ```

  - **Resposta de Erro (404):** Retorna uma mensagem indicando que nenhum projeto foi encontrado.
 
    

- **Cadastrar Projeto (POST):** `/api/projetos`

  - **Corpo da Requisição:**

  ```json
  {
    "nome": "Nome do Projeto",
    "descricao": "Descrição do Projeto",
    "data_inicio": "2024-12-31",
    "status": "Em andamento"
  }
  ```

  - **Resposta de Sucesso (200):** Retorna o novo projeto criado.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando que o corpo da requisição está incorreto.
 
    

- **Editar Projeto (PUT):** `/api/projetos/:id`

  - **Corpo da Requisição:**

  ```json
  {
    "nome": "Novo Nome do Projeto",
    "descricao": "Nova Descrição do Projeto",
    "data_inicio": "2024-01-01",
    "data_fim": "2024-12-31",
    "status": "Concluído"
  }
  ```

  - **Resposta de Sucesso (200):** Retorna o projeto atualizado.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando que o corpo da requisição está incorreto.
    

- **Remover Projeto (DELETE):** `/api/projetos/:id`
  - **Resposta de Sucesso (204):** Confirma que o projeto foi removido com sucesso.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando problemas na remoção.
    


### **Usuários em Projetos**

- **Listar usuários em um projeto (GET):** `/api/projetos/{projetoId}/usuarios`

  - **Resposta de Sucesso (200):** Retorna a lista de usuários vinculados ao projeto.

  ```json
  [
    {
      "id": 1,
      "nome": "Nome do Usuário",
      "email": "email@exemplo.com",
      "papel": "Desenvolvedor"
    },
  ]
  ```

  - **Resposta de Erro (404):** Retorna uma mensagem indicando que nenhum usuário foi encontrado para o projeto especificado..
 
    

- **Cadastrar Usuário em Projeto (POST):** `/api/projetos/{projetoId}/usuarios`

  - **Corpo da Requisição:**

  ```json
  {
    "usuario_id": 1
  }
  ```

  - **Resposta de Sucesso (201):** Retorna o usuário adicionado ao projeto.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando que o corpo da requisição está incorreto.

    
    
- **Remover Usuário em Projeto (DELETE):** `/api/projetos/{projetoId}/usuarios/{usuarioId}`
  - **Resposta de Sucesso (204):** Confirma que o usuário foi removido do projeto com sucesso.
  - **Resposta de Erro (400):** Retorna uma mensagem indicando problemas na remoção.


### **Autenticação**

- **Registrar novo usuário (POST):** `/api/auth/register`

  - **Corpo da Requisição:**

  ```json
  {
    "nome": "Nome do Usuário",
    "email": "email@exemplo.com",
    "senha": "senha123",
    "papel": "Desenvolvedor"
  }
  ```

  - **Resposta de Sucesso (201):** Usuário criado com sucesso:
    
  ```json
  {
    "id": 1, 
    "nome": "Nome do Usuário", 
    "email": "email@exemplo.com", 
    "papel": "Desenvolvedor", 
    "token": "jwt_token" 
  }
  ```

  - **Resposta de Erro (400):** Dados inválidos ou usuário já existente.

- **Realizar login de usuário (POST): ** `/api/auth/login`

  - **Resposta de Sucesso (201):** Retorna um token JWT válido:
  - **Resposta de Erro (400):** Credenciais inválidas.

- **Retornar dados do usuário autenticado (GET):** `/api/auth/me`

  - **Resposta de Sucesso (201):** Retorna os dados do usuário autenticado:
  - **Resposta de Erro (400):** Token inválido ou não fornecido.


# **Frontend** 

O frontend será uma SPA (Single Page Application) que interage com a API criada para fornecer uma interface de usuário intuitiva. A interface permitirá logar/cadastrar no sistema, visualizar, adicionar, editar e remover projetos e visualizar, adicionar, editar e remover usuários em projetos. 

# **Estrutura do Frontend**

- Diretório Frontend: Contém o código da interface do usuário.
- Container (opcional): Para isolar o ambiente de desenvolvimento do frontend.


## **Páginas:**

  - **Cadastro**:
      - Registro de novos usuários no sistema.
   
  - **Login**:
      - Permitirá a autenticação de usuários.

  - **Gestão de Projetos**:
    - Listagem: Tabela com os projetos cadastrados, com opções de adicionar, editar e remover.
    - Cadastro/Edição: Formulário para cadastro ou edição de projetos, pode ser uma modal ou uma página separada.
    - Exclusão: Confirmação antes de excluir um projeto.
   
  - **Gestão de Usuários em Projetos**:
    - Listagem de Usuários em Projetos: Tabela com os usuários vinculados ao projeto, com opções de adicionar, editar e remover.
    - Cadastro: Formulário para associação de um usuário ao projeto.
    - Exclusão: Confirmação antes de excluir um usuário de um projeto.


## O que será avaliado? 

No geral, tudo será avaliado. Porém nosso foco é descobrir como você aplica os conceitos da programação nos seus projetos, como você soluciona problemas e como irá gerar valor ao produto desenvolvido.

- Estrutura do Código: Organização e clareza do código.
- Cumprimento de Requisitos: Atendimento aos requisitos especificados.
- Lógica de Programação: Soluções implementadas e sua eficiência.
- Metodologia Aplicada: Abordagem para resolver problemas e entregar valor.
- Criatividade: Criatividade na solução dos requisitos propostos.

## Entrega

Faça o projeto calmamente e organizadamente! E após finaliza-lo envie-nos e aguarde a correção.

- **OBS**: Faça commits claros e descritivos, estaremos atentos a cada detalhe do seu desenvolvimento.

## Checklist 📝

Abaixo estão as implementações que terão de ser feitas no seu projeto. Quanto mais itens você entregar, melhor será sua avaliação. Utilize este checklist como um guia e faça os itens que conseguir.

Os itens estão separados por níveis, e o nível 1 é o mínimo que esperamos que vocês entreguem. Considerem diferenciais para este primeiro projeto itens do nível 2 em diante.


---

**Legenda:**

- B -> Backend
- F -> Frontend

---

### Nível 1

|     | Descrição                  | Local |
| --- | -------------------------- | ----- |
| [ ] | Listar projetos            |  F B  |
| [ ] | Cadastrar um projeto       |  F B  |
| [ ] | Editar um projeto          |  F B  |
| [ ] | Remover um projeto         |  F B  |
| [ ] | Listar usuários em projetos             |  F B  |
| [ ] | Cadastrar usuários em projetos       |  F B  |
| [ ] | Remover usuários em projetos         |  F B  |
| [ ] | Tipagem de dados           |  F B  |
| [ ] | Registro de usuários no sistema     |  F B  |
| [ ] | Autenticação via login         |  F B  |
| [ ] | Validações de campos     |  F B  |


### Nível 2

|     | Descrição	                                            | Local |
| --- | ------------------------------------------------      | ----- |
| [ ] |	Tratamento de exceções / Retornos erros concisos	    |  F B  |
| [ ] | Mensagens de sucesso e/ou erros	                      |  F   |
| [ ] | Impedir remoção de projetos não concluídos            |   B   |
| [ ] | Paginação na listagem de projetos	                    |  F B  |
| [ ] | Paginação na listagem de usuários	                    |  F B  |
| [ ] | Confirmação para exclusão de itens	                  |  F   |


### Nível 3

|     | Descrição                              | Local |
| --- | -------------------------------------- | ----- |
| [ ] | Testes de integração                   |    B  |
| [ ] | Organização e estrutura de pastas      |  F B  |
| [ ] | Clean Code                             |  F B  |

### Nível 4

|     | Descrição                                                               | Local |
| --- | ----------------------------------------------------------------------- | ----- |
| [ ] | Disponibilização do backend via Containers                              |    B  |
| [ ] | Disponibilização do frontend via Containers                             |  F    |
| [ ] | Disponibilização dos containers (backend + frontend)                    |  F B  |



