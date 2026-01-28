# StudyFlow

> Seu gerenciador acadêmico inteligente. Organize matérias, tarefas, notas e horários em um só lugar.

## Sobre o Projeto

O **StudyFlow** é uma aplicação Full Stack desenvolvida para resolver o caos da vida universitária. Diferente de planilhas complexas, ele oferece uma interface moderna e intuitiva para acompanhar o desempenho acadêmico em tempo real.

O projeto utiliza uma arquitetura **Monorepo**, separando o Frontend (Cliente) do Backend (API), garantindo escalabilidade e organização.

## Tech Stack

**Frontend:**
* **Framework:** Next.js 15 (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS + Shadcn/UI
* **Ícones:** Lucide React

**Backend:**
* **Framework:** NestJS
* **ORM:** Prisma
* **Banco de Dados:** PostgreSQL
* **Arquitetura:** REST API com DTOs e Validations

**DevOps & Ferramentas:**
* Docker & Docker Compose
* Git & GitHub

## Funcionalidades

* **Dashboard Inteligente:** Visualização rápida de médias e tarefas pendentes.
* **Gestão de Matérias:** Cadastro completo com nome, professor e contatos.
* **Controle de Tarefas:** Checklist com prazos e alertas de atraso.
* **Calculadora de Notas:** Cálculo automático de médias baseado nas notas lançadas vs. valor máximo.
* **Quadro de Horários (Novo):** Grade semanal organizada automaticamente (Relacional 1:N).
* **Interface Moderna:** Design responsivo.

## Instalação e Execução

### Pré-requisitos
* Node.js (v18+)
* Docker (para o banco de dados)

### 1. Clone o repositório

```bash
git clone [https://github.com/SEU_USUARIO/studyflow.git](https://github.com/SEU_USUARIO/studyflow.git)
cd studyflow
```

### 2. Subindo o Banco de Dados

Na raiz do projeto, inicie o container do PostgreSQL.
```bash
docker compose up -d
```

### 3. Configurando o Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure o Prisma e crie as tabelas
npx prisma migrate dev

# Inicie o servidor (Rodando na porta 3333)
npm run start:dev
```

### 4. Configurando o Frontend

Abra um novo terminal na raiz e acesse a pasta frontend:
```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor (Rodando na porta 3000)
npm run dev
```
Acesse a aplicação em: http://localhost:3000

