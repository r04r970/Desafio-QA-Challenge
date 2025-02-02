import { test, expect, Page } from '@playwright/test';

const site = 'https://reqres.in';

test('sistema ativo', async ({ page }) => {
  await page.goto(site);
  await expect(page).toHaveTitle(/Reqres - A hosted REST-API ready to respond to your AJAX requests/);
});

test('listar usuários e validar dados', async ({ page }) => {
  const response = await page.request.get(`${site}/api/users?page=2`);
  
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(data).toHaveProperty('data');
  expect(Array.isArray(data.data)).toBe(true);
  
  for (const user of data.data) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('email');
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    expect(user.email).toMatch(emailRegex);
  }
});

test('criar e atualizar usuário', async ({ page }) => {
  // Criação do usuário
  const newUser = {
    nome: 'João da Silva',
    sobreNome: 'Ferreira',
    profissao: 'Pedreiro',
    email: 'joao.ferreira@brjengenharia.com',
  };

  const startPostTime = Date.now();
  const postResponse = await page.request.post(`${site}/api/users`, {
    data: newUser,
  });
  const endPostTime = Date.now();
  const postResponseTime = endPostTime - startPostTime;

  expect(postResponse.status()).toBe(201);
  expect(postResponseTime).toBeLessThan(1000);

  const postData = await postResponse.json();
  expect(postData.nome).toBe(newUser.nome);
  expect(postData.sobreNome).toBe(newUser.sobreNome);
  expect(postData.profissao).toBe(newUser.profissao);
  expect(postData.email).toBe(newUser.email);

  // Atualização do usuário
  const updatedUser = {
    nome: 'João da Silva - atualizado',
    profissao: 'Encarregado obra',
  };

  const startPutTime = Date.now();
  const putResponse = await page.request.put(`${site}/api/users/2`, {
    data: updatedUser,
  });
  const endPutTime = Date.now();
  const putResponseTime = endPutTime - startPutTime;

  expect(putResponse.status()).toBe(200);

  const putData = await putResponse.json();
  expect(putData.nome).toBe(updatedUser.nome);
  expect(putData.profissao).toBe(updatedUser.profissao);
  expect(putResponseTime).toBeLessThan(1000);
});

// Teste de falha de rede ou timeout
test('falha de rede ou timeout', async ({ page }) => {
    const timeout = 500; // 500 ms de timeout
  
    try {
      const response = await page.request.get(`${site}/api/users`, {
        timeout,
      });
      expect(response.status()).toBe(200); // Caso o timeout não aconteça
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toContain('Timeout'); // Verifica se ocorreu timeout
      } else {
        throw new Error('Erro desconhecido');
      }
    }
  });

// Teste de falha DELETE (usuário não encontrado - 404)
test('excluir usuário inexistente', async ({ page }) => {
  const deleteResponse = await page.request.delete(`${site}/api/users/999`);
  
  expect(deleteResponse.status()).toBe(204); // Espera 204, porque o usuário 999 não existe
});
