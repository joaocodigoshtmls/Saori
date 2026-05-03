# Banco de Questões

Projeto em Next.js com Tailwind para importar questões por PDF, organizar por tópico, responder, corrigir e salvar histórico no navegador.

## Como rodar

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000`.

## Estrutura

```text
app/
  games/page.jsx
  history/page.jsx
  page.jsx
  performance/page.jsx
components/
  GameCard.jsx
  HistoryPanel.jsx
  ImportPdf.jsx
  QuestionCard.jsx
  QuestionList.jsx
  StatsPanel.jsx
  ThemeToggle.jsx
  TopicList.jsx
lib/
  export/
  grading/
  pdf/
  performance/
  questions/
  storage/
  utils/
```

## Páginas

- `/`: página inicial do Saori.
- `/questions`: banco de questões, tópicos e importação de PDF.
- `/performance`: painel de desempenho.
- `/history`: histórico de respostas.
- `/games`: área reservada para mini-games.

## Mini-games

O modo `Contra o Tempo` já está funcional em `/games`:

- escolhe tópico;
- escolhe duração de 1, 3 ou 5 minutos;
- sorteia questões salvas;
- corrige objetivas e discursivas;
- pontua com `+10` por acerto, `+5` por parcial e `-3` por erro;
- mostra o resultado final da rodada.

## Desempenho

O painel "Meu desempenho" usa o histórico de respostas para mostrar total respondido, acertos, respostas parciais, sequência de dias, desempenho por tópico, desempenho por tipo de questão e questões mais erradas.

O histórico é armazenado completo; a tela mostra apenas os registros mais recentes. A sequência de dias usa o fuso `America/Sao_Paulo`.

## Importação

Ao importar um PDF, o Saori separa questões válidas de blocos com problema. Se algum bloco não tiver campos obrigatórios, a tela mostra uma lista com o número do bloco e o motivo do erro. Cada questão precisa ter `TOPICO`, `CODIGO`, `TIPO` e `ENUNCIADO`.

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
