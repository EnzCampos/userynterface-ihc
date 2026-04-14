# Documento de Arquitetura
## Extensão VS Code para Visualização de Repositórios e Ambientes de Deploy

## 1. Objetivo

Construir uma extensão do VS Code para uso interno da empresa com foco em operação e consulta de ambientes, permitindo visualizar localmente:

- um repositório de código
- um repositório de deploy
- os ambientes de deploy mapeados por branch
- os arquivos relevantes de cada ambiente
- o link do Argo encontrado no README
- o link do OpenShift cadastrado manualmente pelo usuário para cada ambiente

A proposta desta primeira versão considera **apenas repositórios Git locais**, já clonados na máquina do usuário. Não haverá, neste momento, integração com GitHub, GitLab, Azure DevOps ou qualquer API remota.

---

## 2. Escopo

### Incluído no escopo

- leitura de dois repositórios locais:
  - repositório de código
  - repositório de deploy
- mapeamento de ambientes por branch do repositório de deploy:
  - desenvolvimento
  - homologacao
  - producao
- leitura local dos arquivos por ambiente, como:
  - `README.md`
  - `values.yaml` ou equivalente
  - `Chart.yaml` ou estrutura de chart
- extração automática do link do Argo a partir do README
- cadastro manual do link de OpenShift por ambiente
- visualização desses dados em uma árvore lateral no VS Code
- comandos para abrir arquivos, abrir links e atualizar a visualização
- persistência local das configurações da extensão

### Fora do escopo nesta fase

- autenticação remota
- integração com APIs de Git providers
- edição assistida de arquivos YAML
- escrita automática no repositório de deploy
- comparação avançada entre ambientes
- validações de compliance
- dashboard em webview

---

## 3. Problema que a extensão resolve

Hoje existe uma convenção operacional em que:

- o código fica em um repositório
- o deploy fica em outro repositório
- o repositório de deploy possui branches que representam ambientes
- cada ambiente possui arquivos importantes, como `values`, `README` e chart
- o README contém um link para o Argo
- o usuário também precisa consultar o OpenShift de cada ambiente

Esse processo normalmente exige navegação manual entre pastas, branches, arquivos e links, o que gera:

- perda de tempo
- risco de consultar o ambiente errado
- dificuldade para visualizar a configuração operacional rapidamente
- dependência de conhecimento tácito da estrutura dos repositórios

A extensão centraliza esse contexto dentro do VS Code.

---

## 4. Visão geral da solução

A extensão apresentará uma **Tree View na sidebar do VS Code** com a estrutura da aplicação e dos ambientes.

### Estrutura conceitual da visualização

- Aplicação
  - Repositório de Código
    - caminho local
    - branch atual
    - ação para abrir pasta
  - Repositório de Deploy
    - Desenvolvimento
      - README
      - values
      - chart
      - image tag
      - variáveis relevantes
      - link do Argo
      - link do OpenShift
    - Homologacao
      - README
      - values
      - chart
      - image tag
      - variáveis relevantes
      - link do Argo
      - link do OpenShift
    - Producao
      - README
      - values
      - chart
      - image tag
      - variáveis relevantes
      - link do Argo
      - link do OpenShift

A extensão deverá funcionar como um painel operacional leve, nativo e orientado à navegação.

---

## 5. Premissas

A arquitetura assume as seguintes premissas:

1. Os dois repositórios já estão clonados localmente.
2. O usuário possui permissão para ler os arquivos desses repositórios.
3. O repositório de deploy possui branches estáveis que representam ambientes.
4. Cada branch contém os arquivos necessários para leitura operacional.
5. O README contém um link identificável do Argo.
6. O link do OpenShift não precisa ser descoberto automaticamente nesta primeira fase.
7. A extensão é usada principalmente para consulta e navegação, não para alteração automatizada.

---

## 6. Requisitos funcionais

### RF-01 — Cadastro da aplicação
A extensão deve permitir configurar uma aplicação informando:

- nome da aplicação
- caminho local do repositório de código
- caminho local do repositório de deploy
- branches correspondentes aos ambientes
- caminhos ou padrões dos arquivos relevantes

### RF-02 — Leitura do repositório de código
A extensão deve exibir informações básicas do repositório de código, como:

- caminho local
- branch atual
- ação para abrir a pasta no workspace/explorer

### RF-03 — Leitura do repositório de deploy por ambiente
A extensão deve consultar localmente as branches mapeadas para cada ambiente e recuperar:

- README
- values
- chart

### RF-04 — Extração do link do Argo
A extensão deve localizar automaticamente o link do Argo a partir do conteúdo do README de cada ambiente.

### RF-05 — Cadastro do link do OpenShift
A extensão deve permitir que o usuário informe manualmente o link do OpenShift de cada ambiente.

### RF-06 — Abertura de arquivos
A extensão deve permitir abrir rapidamente os arquivos relevantes do ambiente.

### RF-07 — Abertura de links
A extensão deve permitir abrir:

- link do Argo
- link do OpenShift

### RF-08 — Atualização manual
A extensão deve disponibilizar um comando de atualização para recarregar as informações dos repositórios.

### RF-09 — Persistência local
As configurações devem ser persistidas localmente no contexto da extensão.

---

## 7. Requisitos não funcionais

### RNF-01 — Simplicidade de uso
A extensão deve ter uma interface simples, baseada em árvore e comandos contextuais.

### RNF-02 — Baixo acoplamento
A camada visual não deve concentrar lógica de Git, parsing ou armazenamento.

### RNF-03 — Manutenibilidade
A arquitetura deve facilitar evolução futura, como múltiplas aplicações, comparação entre ambientes e integrações remotas.

### RNF-04 — Segurança operacional
A primeira versão deve operar apenas em leitura sobre os repositórios.

### RNF-05 — Performance
A leitura dos dados deve ser suficientemente rápida para uso cotidiano, com possibilidade de cache em memória.

---

## 8. Decisão arquitetural principal

A solução será implementada como uma **extensão nativa de VS Code baseada em Tree View**, evitando webview nesta primeira fase.

### Justificativa

Esse projeto precisa principalmente de:

- estrutura hierárquica
- ações por item
- atualização manual
- abertura de arquivos
- abertura de links
- persistência simples de configuração

Tudo isso se encaixa melhor em uma arquitetura nativa da extensão, sem o custo adicional de uma interface web embarcada.

---

## 9. Arquitetura em camadas

A arquitetura será separada em quatro camadas principais.

### 9.1. Camada de apresentação
Responsável pela exibição da árvore, comandos e interação com o usuário.

**Responsabilidades:**
- registrar a view da extensão
- montar os nós visuais da árvore
- reagir a cliques e comandos
- disparar refresh
- abrir arquivos e links

**Componentes sugeridos:**
- `EnvironmentTreeProvider`
- `TreeItemFactory`
- `CommandRegistrar`

### 9.2. Camada de aplicação
Responsável por coordenar os casos de uso da extensão.

**Responsabilidades:**
- carregar configuração
- pedir leitura dos repositórios
- consolidar dados por ambiente
- retornar um modelo pronto para a UI

**Componentes sugeridos:**
- `LoadApplicationOverviewUseCase`
- `RefreshEnvironmentDataUseCase`
- `SetOpenShiftUrlUseCase`

### 9.3. Camada de domínio
Responsável pelos modelos centrais da aplicação.

**Responsabilidades:**
- representar aplicação
- representar ambiente
- representar artefatos de deploy
- representar estado de leitura

**Entidades sugeridas:**
- `ApplicationConfig`
- `EnvironmentConfig`
- `EnvironmentOverview`
- `RepositoryInfo`
- `DeployArtifactInfo`

### 9.4. Camada de infraestrutura
Responsável por acessar Git local, sistema de arquivos, configurações e parser.

**Responsabilidades:**
- ler repositórios locais
- consultar arquivos em branches específicas
- parsear YAML
- parsear README
- persistir configurações

**Componentes sugeridos:**
- `LocalGitService`
- `FileSystemService`
- `YamlParserService`
- `ReadmeLinkExtractor`
- `ExtensionConfigStore`
- `MemoryCacheService`

---

## 10. Modelo de dados

### 10.1. Configuração principal

```ts
interface ApplicationConfig {
  id: string;
  name: string;
  codeRepoPath: string;
  deployRepoPath: string;
  environments: Record<EnvironmentName, EnvironmentConfig>;
}

type EnvironmentName = 'desenvolvimento' | 'homologacao' | 'producao';

interface EnvironmentConfig {
  branch: string;
  readmePath: string;
  valuesPath: string;
  chartPath: string;
  openshiftUrl?: string;
}
```

### 10.2. Modelo agregado para exibição

```ts
interface EnvironmentOverview {
  environment: EnvironmentName;
  branch: string;
  readme?: DeployArtifactInfo;
  values?: DeployArtifactInfo;
  chart?: DeployArtifactInfo;
  argoUrl?: string;
  openshiftUrl?: string;
  imageRepository?: string;
  imageTag?: string;
  variablesSummary: Array<{ key: string; value: string }>;
  errors: string[];
}

interface DeployArtifactInfo {
  path: string;
  exists: boolean;
}

interface RepositoryInfo {
  path: string;
  currentBranch?: string;
  exists: boolean;
  isGitRepository: boolean;
}
```

---

## 11. Estratégia de leitura do Git local

Como a solução será exclusivamente local, o ideal é evitar trocar o checkout da branch atual do usuário sempre que a extensão precisar ler um ambiente.

### Abordagem recomendada

A extensão deve ler arquivos diretamente de uma branch específica usando Git local, sem alterar o estado do diretório de trabalho.

### Benefícios

- não interfere no trabalho do desenvolvedor
- evita risco de mudar branch sem querer
- permite consultar vários ambientes de forma segura
- reduz acoplamento com o workspace atual

### Resultado esperado

Para cada ambiente, a extensão consulta os arquivos do repositório de deploy com base na branch configurada e monta o resumo do ambiente independentemente da branch atualmente checkoutada.

---

## 12. Estratégia de parsing

### 12.1. README
O README será lido como texto simples.

A extração do link do Argo será feita por uma estratégia em duas etapas:

1. regex configurável
2. fallback por busca de URL contendo termos esperados, como `argo` ou `argocd`

### 12.2. Values
O arquivo `values` será parseado como YAML.

A extensão deverá buscar, preferencialmente:

- repositório da imagem
- tag da imagem
- variáveis de ambiente relevantes

Como cada projeto pode organizar o YAML de forma diferente, a primeira versão deve adotar uma leitura tolerante, com heurísticas e possibilidade de futura configuração por chave.

### 12.3. Chart
O chart pode ser tratado inicialmente como artefato navegável. Em uma primeira fase, basta localizar o arquivo e permitir sua abertura.

---

## 13. Persistência de configuração

A extensão precisará persistir:

- lista de aplicações cadastradas
- caminhos dos repositórios
- mapeamento de branch por ambiente
- caminhos dos arquivos relevantes
- links de OpenShift
- regex opcional para descoberta do Argo

### Estratégia recomendada

Persistir em armazenamento próprio da extensão e/ou configuração do workspace, dependendo do nível desejado de compartilhamento.

### Sugestão prática

- configurações estruturais da aplicação: storage/global state da extensão
- links e preferências do usuário: storage da extensão

Nesta fase, não há necessidade de armazenar segredos.

---

## 14. Estrutura sugerida da árvore no VS Code

### Exemplo de visualização

- Minha Aplicação
  - Código
    - Repositório local
    - Branch atual: feature/xpto
    - Abrir pasta
  - Deploy
    - Desenvolvimento
      - Branch: desenvolvimento
      - README
      - Values
      - Chart
      - Image Tag: 1.0.12
      - Argo
      - OpenShift
    - Homologacao
      - Branch: homologacao
      - README
      - Values
      - Chart
      - Image Tag: 1.0.10
      - Argo
      - OpenShift
    - Producao
      - Branch: producao
      - README
      - Values
      - Chart
      - Image Tag: 1.0.8
      - Argo
      - OpenShift

### Ações esperadas por item

- abrir arquivo
- abrir link
- copiar valor
- configurar OpenShift
- atualizar árvore

---

## 15. Casos de uso principais

### Caso de uso 1 — Visualizar ambientes
1. Usuário abre o VS Code.
2. A extensão carrega a configuração da aplicação.
3. A extensão localiza os repositórios locais.
4. A extensão lê os dados de cada ambiente no repositório de deploy.
5. A árvore é exibida com as informações consolidadas.

### Caso de uso 2 — Abrir o Argo de um ambiente
1. Usuário expande o ambiente.
2. Usuário clica no item Argo.
3. A extensão abre o link no navegador padrão.

### Caso de uso 3 — Cadastrar OpenShift
1. Usuário seleciona o ambiente.
2. Usuário executa o comando de definir URL do OpenShift.
3. A extensão solicita a URL.
4. A URL é persistida localmente.
5. O item OpenShift passa a aparecer no ambiente.

### Caso de uso 4 — Abrir values do ambiente
1. Usuário seleciona o item values.
2. A extensão abre o conteúdo correspondente.
3. Se necessário, o conteúdo pode ser materializado temporariamente ou aberto a partir do caminho local quando aplicável.

---

## 16. Tratamento de erros

A extensão deve ser resiliente a falhas comuns.

### Exemplos de erro a tratar

- caminho do repositório não existe
- diretório informado não é um repositório Git
- branch configurada não existe
- arquivo README não encontrado
- arquivo values não encontrado
- link do Argo não encontrado no README
- YAML inválido
- link do OpenShift não cadastrado

### Estratégia

- exibir mensagens amigáveis na árvore ou em notification leve
- não quebrar a visualização inteira por falha de um ambiente
- registrar logs internos para diagnóstico

---

## 17. Cache e atualização

Para evitar leituras excessivas, a extensão pode manter um cache em memória do resumo de cada ambiente.

### Estratégia sugerida

- cache por aplicação e ambiente
- invalidação manual por comando `Refresh`
- invalidação automática ao mudar configuração

Como a primeira versão é local e simples, o cache pode ser conservador.

---

## 18. Estrutura sugerida de pastas do projeto

```text
src/
  extension.ts
  commands/
    refresh.ts
    configureApplication.ts
    setOpenShiftUrl.ts
    openArgo.ts
    openOpenShift.ts
    openArtifact.ts
  presentation/
    tree/
      EnvironmentTreeProvider.ts
      TreeItemFactory.ts
      TreeNodes.ts
  application/
    usecases/
      LoadApplicationOverviewUseCase.ts
      RefreshEnvironmentDataUseCase.ts
      SetOpenShiftUrlUseCase.ts
  domain/
    models/
      ApplicationConfig.ts
      EnvironmentOverview.ts
      RepositoryInfo.ts
  infrastructure/
    git/
      LocalGitService.ts
    fs/
      FileSystemService.ts
    parsing/
      YamlParserService.ts
      ReadmeLinkExtractor.ts
    storage/
      ExtensionConfigStore.ts
    cache/
      MemoryCacheService.ts
  shared/
    types/
    utils/
```

---

## 19. Decisões de implementação importantes

### Decisão 1 — Operar somente com Git local
A primeira versão não dependerá de serviços remotos.

### Decisão 2 — Não alterar checkout do usuário
A leitura das branches do deploy deve ocorrer sem troca explícita da branch ativa do repositório.

### Decisão 3 — Tree View como interface principal
A experiência principal será a árvore lateral nativa do VS Code.

### Decisão 4 — OpenShift manual, Argo automático
O Argo será descoberto a partir do README. O OpenShift será configurado manualmente.

### Decisão 5 — Foco em leitura
A extensão será inicialmente somente leitura, reduzindo risco operacional.

---

## 20. Evoluções futuras possíveis

Após a primeira versão, a arquitetura permite evoluir para:

- múltiplas aplicações
- comparação entre image tags de ambientes
- comparação de variáveis entre ambientes
- detecção de drift entre homologação e produção
- edição guiada de values
- integração com Git remoto
- dashboard mais rico
- atalhos para logs e observabilidade

---

## 21. Conclusão

A proposta é viável, útil e tecnicamente adequada para uma extensão de VS Code.

Ao limitar a primeira fase para uso **exclusivamente local com Git já clonado**, o projeto reduz complexidade e maximiza entrega de valor rápido. A escolha de uma arquitetura em camadas com Tree View nativa permite uma base limpa, extensível e segura para evolução futura.

O resultado esperado é uma extensão que concentra o contexto operacional dos ambientes diretamente no editor, tornando mais rápida e menos sujeita a erro a navegação entre código, deploy e links de operação.

---

## 22. Próximo passo recomendado

O próximo passo ideal é produzir um **documento de especificação funcional e técnica do MVP**, contendo:

- lista exata de comandos da extensão
- contrato de configuração
- estrutura dos nós da árvore
- fluxo de leitura do Git local
- critérios de aceite
- backlog inicial de implementação

