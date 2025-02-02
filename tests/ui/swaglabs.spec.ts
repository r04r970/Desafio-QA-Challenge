import { test, expect, Page } from '@playwright/test';
import escape from 'css.escape'; 

const site = 'https://www.saucedemo.com/';
const senha = 'secret_sauce';
const usuario = 'standard_user';
const qtdAproduto = 3;
let qtdRproduto = 2;
let qtdRemRndProduto = 0;
let qCarrinho = 0;
let qtdEsperada = 0;
let qCarrinhoString;
const pCarrinho: string[] = []; 
let qtdAddRndProduto = 0;
const aProduto: string[] = ['#add-to-cart-sauce-labs-backpack',
                            '#add-to-cart-sauce-labs-bike-light',
                            '#add-to-cart-sauce-labs-bolt-t-shirt',
                            '#add-to-cart-sauce-labs-fleece-jacket',
                            '#add-to-cart-sauce-labs-onesie',
                            //'#add-to-cart-test.allthethings()-t-shirt-(red)'
                            `#add-to-cart-${escape('test.allthethings()-t-shirt-(red)')}`
]
const rProduto: string[] = ['remove-sauce-labs-backpack',
                            'remove-sauce-labs-bike-light',
                            'remove-sauce-labs-bolt-t-shirt',
                            'remove-sauce-labs-fleece-jacket',
                            'remove-sauce-labs-onesie',
                            //'remove-test.allthethings()-t-shirt-(red)'
                            `remove-${escape('test.allthethings()-t-shirt-(red)')}` // Escapando o seletor
]


function geraRandom(qtd: number): number[] {
  const resultado: number[] = [];
  
  while (resultado.length < qtd) {
    const num = Math.floor(Math.random() * qtd); 
    if (!resultado.includes(num)) {
      resultado.push(num);
    }
  }
  
  return resultado;
}

async function realizarLogin(page: Page, digitarLentamente = false) {
  await page.goto(site);
  
  if (digitarLentamente) {
    await page.fill('input[name="user-name"]', '');
    await page.keyboard.type(usuario, { delay: 100 }); 
    await page.fill('input[name="password"]', '');
    await page.keyboard.type(senha, { delay: 100 });
  } else {
    await page.fill('input[name="user-name"]', usuario);
    await page.fill('input[name="password"]', senha);
  }
  
  await page.click('#login-button');
}

async function adicionarProduto(page: Page, qtdAproduto:number) {
  const j = geraRandom(qtdAproduto);
    for (let i = 0; i < qtdAproduto; i++) { 
      await page.click(aProduto[j[i]]);
    }
}

async function itensCarrinho(page: Page, qtdCarrinho:number) {
  for (let i = 0; i < 5; i++) {
    const bProduto = await page.locator(`#${rProduto[i]}`);
    const isVisible = await bProduto.isVisible();
    if (isVisible) {
      pCarrinho.push(`#${rProduto[i]}`);
    }
  }
}

async function removerProduto(page: Page, qtdRproduto: number) {
  const j = geraRandom(qtdRproduto);
  for (let i = 0; i < qtdRproduto; i++) { 
    await page.click(pCarrinho[j[i]]);
  }
}

test('sistema ativo', async ({ page }) => {
  await page.goto(site);
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('acesso ao sistema (digitação lenta)', async ({ page }) => {
  await realizarLogin(page, true);
  await page.close();
});

test('acesso ao sistema (digitação rápida)', async ({ page }) => {
  await realizarLogin(page);
  await page.close();
});

test('Login e página inicial', async ({ page }) => {
  await realizarLogin(page);
  await expect(page.locator('text=Products')).toBeVisible();
});

test('Verificar validação login', async ({ page }) => {
  await page.goto(site);
  //#region validação de login sem nome e senha
  await page.click('#login-button');
  await expect(page.locator('text=Epic sadface: Username is required')).toBeVisible();
  //#endregion
  
  //#region nome/senha errada
  await page.fill('input[name="user-name"]', 'usuario');
  await page.fill('input[name="password"]', senha);
  await page.click('#login-button');
  await expect(page.locator('text=Epic sadface: Username and password do not match any user in this service')).toBeVisible();
  await page.fill('input[name="user-name"]', usuario);
  await page.fill('input[name="password"]', 'senha');
  await page.click('#login-button');
  await expect(page.locator('text=Epic sadface: Username and password do not match any user in this service')).toBeVisible();
  //#endregion
});

test('Adicionar produtos carrinho padrão', async ({ page }) => {
  await realizarLogin(page);
  await adicionarProduto(page, qtdAproduto);  
  await page.locator('[data-test="shopping-cart-link"]').click();
});

test('Remover produtos carrinho padrão', async ({ page }) => {
  await realizarLogin(page);
  await adicionarProduto(page, qtdAproduto);  
  await page.locator('[data-test="shopping-cart-link"]').click();
  qCarrinhoString = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  if(qCarrinhoString != null){
    qCarrinho = parseInt(qCarrinhoString, 10);
    if (qCarrinho === qtdAproduto){
      await itensCarrinho(page, qCarrinho); 
      await removerProduto(page, qtdRproduto);
    }
  }
  
  //#region validação qtd carrinho após excluir
  qCarrinhoString = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  qtdEsperada = qtdAproduto - qtdRproduto;
  if (qCarrinhoString !== null) {
    await expect(parseInt(qCarrinhoString, 10)).toBe(qtdEsperada);
  } else {
    await expect(0).toBe(qtdEsperada);
  }
  //#endregion
});

test('Adicionar produtos carrinho aleatorio', async ({ page }) => {
  await realizarLogin(page);
  qtdAddRndProduto = Math.floor(Math.random() * 6) + 1;
  await adicionarProduto(page, qtdAddRndProduto);
  await page.locator('[data-test="shopping-cart-link"]').click();
});

test('Remover produtos carrinho aleatorio', async ({ page }) => {
  await realizarLogin(page);
  qtdAddRndProduto = Math.floor(Math.random() * 6) + 1;
  await adicionarProduto(page, qtdAddRndProduto);  
  await page.locator('[data-test="shopping-cart-link"]').click();
  qCarrinhoString = await page.locator('[data-test="shopping-cart-badge"]').textContent();
  if (qCarrinhoString !== null){
    qCarrinho = parseInt(qCarrinhoString, 10);
    qtdRemRndProduto = Math.floor(Math.random() * qCarrinho) + 1;
    if (qCarrinho === qtdAddRndProduto){
      await itensCarrinho(page, qCarrinho); 
      await removerProduto(page, qtdRemRndProduto);
    }
  }

  if(qCarrinho != qtdAddRndProduto){//se a quantidade de produtos adicionadas for igual removida não entra no if
    //#region validação qtd carrinho após excluir
    qCarrinhoString = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    qtdEsperada = qtdAddRndProduto - qtdAddRndProduto;
    if (qCarrinhoString !== null) {
      await expect(parseInt(qCarrinhoString, 10)).toBe(qtdEsperada);
    } else {
      await expect(0).toBe(qtdEsperada);
    }
    //#endregion
  }  
});

test('Finalizar compra e validar preenchimento dados obrigatórios', async ({ page }) => {
  //#region validação de campo obrigatorio
  await realizarLogin(page);
  await adicionarProduto(page, qtdAproduto);  
  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.click('#checkout');
  await page.click('#continue');
  await expect(page.locator('text=Error: First Name is required')).toBeVisible();
  //#endregion
  
  //#region preencher os campos para finalizar a compra
  await page.fill('input[name="firstName"]', 'firstName'); //firstName
  await page.click('#continue');
  await expect(page.locator('text=Error: Last Name is required')).toBeVisible();
  await page.fill('input[name="lastName"]', 'lastName'); //lastName
  await page.click('#continue');  
  await expect(page.locator('text=Error: Postal Code is required')).toBeVisible();
  await page.fill('input[name="postalCode"]', 'postalCode'); //postalCode
  await page.click('#continue'); 
  await page.click('#finish');  //finalizar pedido
  await page.click('#back-to-products'); //pedido realizado
  //#endregion
});