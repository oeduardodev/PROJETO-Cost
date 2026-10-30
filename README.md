# Costs

Aplicação web para organizar projetos, controlar orçamentos e acompanhar custos de serviços. O Costs funciona no navegador e salva os dados localmente, sem precisar de uma API ou de um servidor de banco de dados.

## Recursos

- Painel com totais de orçamento, custos e saldo.
- Cadastro, edição, busca, filtro, ordenação e exclusão de projetos.
- Categorias para organizar projetos.
- Cadastro e remoção de serviços em cada projeto.
- Indicadores de utilização e alertas visuais para orçamentos próximos do limite ou excedidos.
- Tema claro, escuro ou conforme o sistema.
- Layout adaptável para telas menores.

## Requisitos

- Node.js 16 ou superior.
- npm (incluído com Node.js).
- TypeScript é instalado pelo npm junto com as dependências de desenvolvimento.

## Instalação e execução

No terminal, na pasta do projeto:

```bash
npm install
npm start
```

O servidor de desenvolvimento abre a aplicação em [http://localhost:3000](http://localhost:3000). Para encerrar, use `Ctrl+C` no terminal.

## Build de produção

```bash
npm run build
```

Os arquivos prontos para publicação são gerados na pasta `build/`. Como os dados ficam no armazenamento do navegador, publicar a interface em outro endereço não transfere os dados salvos em `localhost`.

## Dados e persistência

Projetos, orçamentos, serviços, custos e categorias ficam no `localStorage` do navegador, na chave `costs-data-v1`. O tema é salvo separadamente na chave `costs-theme`. Os dados continuam disponíveis depois de fechar e reabrir o navegador, desde que o armazenamento do site não seja apagado.

Cada navegador e origem têm seu próprio armazenamento. Portanto, dados de `localhost:3000` não são compartilhados automaticamente com outro navegador, perfil ou endereço do site. O armazenamento local também não substitui um backup: limpar os dados do navegador pode removê-los. Para preservar ou migrar informações, copie o valor JSON de `costs-data-v1` nas ferramentas de desenvolvimento antes de limpar o armazenamento.

O primeiro acesso inicializa uma lista vazia de projetos e as categorias disponíveis (Infra, Desenvolvimento, Design e Planejamento). Nenhum projeto de demonstração é criado. Projetos e serviços novos são gravados localmente no momento em que são adicionados ou alterados.

Para apagar os dados da aplicação neste navegador, abra as ferramentas de desenvolvimento do navegador, vá até **Application/Armazenamento > Local Storage > http://localhost:3000** e remova `costs-data-v1` e, se desejado, `costs-theme`. Na próxima abertura, as categorias serão inicializadas novamente e a lista de projetos ficará vazia.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor local de desenvolvimento. |
| `npm run build` | Gera a versão de produção em `build/`. |
| `npm run typecheck` | Verifica os tipos TypeScript sem gerar arquivos. |
| `npm test` | Inicia o executor de testes do Create React App. |
| `npm run eject` | Expõe as configurações internas do Create React App (operação irreversível). |

## Estrutura do projeto

```text
public/                  HTML base, ícones e manifesto
src/
  components/
    feedback/            Notificações
    layout/              Estrutura da aplicação e navegação
    pages/               Páginas do painel, projetos, contato e sobre
    projects/            Formulários e cartões de projeto
    services/            Cadastro e listagem de serviços
    ui/                  Componentes reutilizáveis
  hooks/                 Hooks de projetos e tema
  services/api.ts        Operações locais e persistência no localStorage
  types.ts               Modelos de projeto, categoria, serviço e métricas
  styles/                Tokens, layout e estilos globais
  utils/                 Formatação e cálculos de projetos
tsconfig.json            Configuração do TypeScript
```

## Tecnologias

- React 17, TypeScript em modo estrito e Create React App.
- React Router para navegação.
- React Icons para ícones.
- `localStorage` para persistência no navegador.

## Observações

- Os dados são locais a este navegador; não existe sincronização entre usuários ou dispositivos.
- A aplicação não envia os projetos para um servidor.
- Se o navegador estiver em modo privado ou bloquear armazenamento local, a persistência poderá não estar disponível.
