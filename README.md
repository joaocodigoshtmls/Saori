# Banco de Questões

Projeto em Next.js com Tailwind para importar questões por PDF, organizar por tópico, responder, corrigir e salvar histórico no navegador.

## Como rodar

```bash
pnpm install
pnpm dev
```

Depois abra `http://localhost:3000`.

Se preferir npm:

```bash
npm install
npm run dev
```

## Formato do PDF

Separe cada questão com `---`.

### Questão objetiva

```text
TOPICO: Biologia
CODIGO: BIO-001
TIPO: objetiva
ENUNCIADO: Qual organela produz a maior parte do ATP?
A) Ribossomo
B) Mitocôndria
C) Lisossomo
D) Complexo golgiense
CORRETA: B
EXPLICACAO: A mitocôndria realiza a respiração celular e produz ATP.
---
```

### Questão discursiva

```text
TOPICO: História
CODIGO: HIS-001
TIPO: discursiva
ENUNCIADO: Explique por que a Constituição de 1988 é chamada de Constituição Cidadã.
RESPOSTA ESPERADA: Ela ampliou direitos sociais, políticos e civis após o período autoritário.
PONTOS: ampliou direitos sociais; redemocratização; participação popular
EXPLICACAO: A resposta deve relacionar a Constituição de 1988 à redemocratização e à ampliação de direitos.
---
```
