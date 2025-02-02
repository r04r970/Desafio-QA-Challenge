# Desafio QA Challenge

## Introdução

Este repositório contém dois testes práticos para a vaga de **QA Engineer**. 

## Requisitos Técnicos

- **Node.js** 
- **TypeScript** 
- **Playwright** 

### Passos para instalação:

1. Clone este repositório:

   ```bash
   git clone https://github.com/r04r970/qa-challenge.git
   cd qa-challenge
   ```

2. Instale as dependências:

   ```bash
   npm install playwright  
   npm install css.escape
   npm install --save-dev @playwright/test
   npm install --save-dev @types/node
   npm install
   ```

3. Para rodar os testes de UI:

   ```bash 
   npm run test:ui
   ```

4. Para rodar os testes de API:

   ```bash
   npm run test:api
   ```

### Estrutura do Projeto

```plaintext
.
├── tests/
│   ├── api/
│   │   └── reqres.spec.ts       # Testes de API
│   ├── ui/
│   │   └── swaglabs.spec.ts      # Testes de UI
├── playwright.config.ts          # Configuração do Playwright
├── package.json
├── README.md
├── tsconfig.json                 # Configuração do TypeScript
├── global.d.ts                   # Declaração do módulo `css.escape`
└── ...
```

## Estrutura do Projeto

- `global.d.ts`: Declaração do módulo `css.escape` para uso no projeto.
- `package-lock.json`: Arquivo que contém a árvore de dependências do projeto com versões travadas.
- `package.json`: Arquivo de configuração do projeto, com dependências e scripts definidos.
- `playwright.config.ts`: Configuração do Playwright para rodar os testes em diferentes navegadores.
- `tsconfig.json`: Arquivo de configuração TypeScript.
- `tests/`: Diretório que contém os testes, divididos em `api` e `ui`.
  - `api/reqres.spec.ts`: Testes para a API `ReqRes`.
  - `ui/swaglabs.spec.ts`: Testes para a interface web do site Sauce Labs.
