# Follow Rivers – Aplicativo de Monitoramento de Enchentes

## Integrantes
- Oscar Arias Neto – RM: _informar_
- Nicolas Souza dos Santos – RM: _informar_
- Julia Martis Rebelles – RM: _informar_

## Escopo do Aplicativo
Follow Rivers é um aplicativo móvel desenvolvido em React Native com Expo para monitoramento colaborativo de áreas com risco de inundação. Os usuários podem:
- Cadastrar-se e gerenciar o próprio perfil armazenado na API Follow Rivers.
- Registrar pontos de rio sob monitoramento, informando se oferecem risco de alagamento.
- Criar, editar e excluir alertas de inundação vinculados a pessoas e pontos de rio já cadastrados.
- Visualizar listagens paginadas de alertas e pontos com navegação baseada em HATEOAS, seguindo os `links` fornecidos pela API ASP.NET Core 8.

## Arquitetura e Organização
```
src/
  components/      -> Componentes reutilizáveis (FormField, Card, PaginationControls, etc.)
  contexts/        -> Provedores globais (AuthContext para autenticação baseada na API)
  navigation/      -> Navegação principal (pilha + tabs) com rotas autenticadas
  screens/         -> Telas organizadas por domínio (auth, alerts, rivers, profile, splash)
  services/        -> Módulos HTTP e serviços de entidade integrados à API Follow Rivers
  theme/           -> Tema global com cores, tipografia e espaçamentos padronizados
  utils/           -> Funções utilitárias (formatação de datas)
```
A arquitetura garante código modular e fácil de manter, com camadas separadas para UI, estado e integração.

## Configuração da API
A base URL da API pode ser configurada de duas formas:
1. Definindo a variável de ambiente `EXPO_PUBLIC_API_BASE_URL` antes de iniciar o app.
2. Ajustando o valor padrão em `app.json` (`expo.extra.apiBaseUrl`).

Exemplo (Linux/macOS):
```bash
export EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5000
npm run start
```

O cliente HTTP (`src/services/http.ts`) adiciona automaticamente cabeçalhos `Content-Type: application/json`, trata códigos de status (200, 201, 204, 400, 404, 500) e aproveita os `links` HATEOAS para paginação, atualização e exclusão.

## Requisitos Atendidos
- ✅ Implementação completa das telas planejadas com validações, feedback visual e indicadores de carregamento.
- ✅ Integração total com a API REST Follow Rivers (pessoas, pontos de rio, alertas) com paginação HATEOAS.
- ✅ Estilização consistente com tema global (cores, tipografia, espaçamentos e cards).
- ✅ Estrutura de código organizada por componentes, serviços, contextos e telas.
- ✅ Persistência combinada via API + AsyncStorage para dados de autenticação.

## Execução do Projeto
```bash
npm install  # instalar dependências (já presentes no repositório)
npm run start
```
Selecione a plataforma desejada (Expo Go, web, Android ou iOS) após iniciar o Metro bundler.

### Scripts Disponíveis
- `npm run start` – inicia o Expo em modo desenvolvimento.
- `npm run web` – executa o projeto no navegador.
- `npm run android` / `npm run ios` – compila para as plataformas nativas.

## Publicação e Protótipo
- Protótipo Figma: _adicione aqui o link atualizado do protótipo da Sprint 3._
- Publicação Expo: _adicione aqui o link público gerado via `expo publish` ou Expo Go._

Certifique-se de atualizar os links acima após publicar a aplicação.

## Recursos Extras
- Aula de referência: **15/05/2025 – Publicação de Aplicativos React Native com Expo**.
- Backend Follow Rivers (ASP.NET Core 8) com endpoints documentados no enunciado do desafio.
