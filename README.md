Relatório Detalhado do Projeto - API de Saúde Mental
Este documento fornece um relatório detalhado sobre o projeto de API de Saúde Mental, descrevendo sua finalidade, arquitetura, funcionalidades e, em particular, o papel da API de localização.

Para acessar os endpoints do nosso projeto, basta seguir o link da documentação do Postman, logo abaixo:

https://documenter.getpostman.com/view/50180668/2sB3dPTWCu

1. Visão Geral do Projeto
O projeto é uma API RESTful desenvolvida em TypeScript, utilizando o framework Express, projetada para gerenciar serviços relacionados à saúde mental. Uma API permite a criação, leitura, atualização e exclusão (CRUD) de informações sobre serviços, funcionários, usuários e avaliações. Sua arquitetura é organizada em camadas para promover a modularidade, manutenibilidade e escalabilidade.

nomes:
TypeScript : Linguagem de programação que adiciona tipagem estática ao JavaScript, melhorando a robustez e a legibilidade do código.
Express.js : Framework web para Node.js, utilizado para construir rotas e lidar com requisições HTTP.
Axios : Cliente HTTP baseado em Promessas para fazer requisições a APIs externas.
Jest : Framework de teste para JavaScript.
2. Arquitetura do Projeto
O projeto segue uma arquitetura em camadas, comum em aplicações de backend, que separa as responsabilidades e facilita o desenvolvimento e a manutenção:

src/app.ts: Ponto de entrada da aplicação, onde o servidor Express está configurado e as rotas são inicializadas.
src/routes/: Contém os arquivos de definição de rotas para cada entidade (Auth, Avaliacao, Funcionario, Servicos, Usuario).
src/controller/: Camada responsável por receber as requisições HTTP, validar os dados de entrada e chamar a lógica do negócio detalhado.
src/business/: Camada de lógica de negócio, onde as regras de negócio são inovadoras. Ela interage com a camada de dados e, em alguns casos, com serviços externos.
src/data/: Camada de acesso a dados, responsável pela interação com o banco de dados (CRUD).
src/services/: Contém serviços externos ou importados que não se encaixam diretamente nas camadas de negócio ou dados, como a API de localização.
src/dto/: Data Transfer Objects (DTOs) para definir a estrutura dos dados que são transferidos entre as camadas.
src/types/: Definições de tipos TypeScript para as entidades do projeto.
src/utils/: Utilitários e classes de erro personalizadas.
src/middlewares/: Middlewares para autenticação e autorização.
src/migrations/: Scripts de migração para o banco de dados.
tests/: Contém os testes unitários e de integração da aplicação.
3. Funcionalidades Principais
A API oferece as seguintes funcionalidades:

Autenticação e Autorização : Gerenciamento de usuários, login e controle de acesso a recursos protegidos.
Gerenciamento de usuários : CRUD para informações de usuários.
Gerenciamento de funcionários : CRUD para informações de funcionários.
Gerenciamento de Serviços : CRUD para serviços de saúde mental, incluindo a capacidade de associação geográfica geográfica aos serviços.
Gerenciamento de avaliações : CRUD para avaliações de serviços ou funcionários.
Filtragem e Paginação : Capacidade de filtrar e paginar resultados em algumas listas.
4. Detalhamento da API de Localização ( src/services/APIlocalizacao.ts)
A APIlocalizacao.tsé um serviço crucial que permite ao projeto integrar funcionalidades de geolocalização.

Propósito:
O principal objetivo GeoServiceé converter um endereço textual (por exemplo, "Rua Exemplo, 123, Cidade") em coordenadas geográficas precisas (latitude e longitude). Essas coordenadas são essenciais para funcionalidades que dependem da localização física dos serviços, como busca por proximidade, exibição em mapas, etc.

Como Funciona:
Dependência Externa : GeoServiceUtiliza uma biblioteca axiospara fazer requisições HTTP a uma API externa.
API do Google Maps Geocoding : O serviço se comunica com a API de Geocoding do Google Maps ( https://maps.googleapis.com/maps/api/geocode/json). Esta API é um serviço web que converte endereços em regiões geográficas e vice-versa.
MétodogetCoordenadas :
Recebe um address(endereço completo) e uma apiKey(chave da API do Google Maps) como parâmetros.
Faz uma requisição GET para o GEOCODING_URLendereço e a chave da API.
Processa a resposta da API do Google Maps. Se a API retornar resultados válidos, ele extrai a latitude e longitude do primeiro resultado.
Em caso de endereço inválido ou não encontrado, ou falha na comunicação com a API do Google Maps, ele lança erros personalizados ( ValidationErrorou GoogleMapsAPIError).
Estrutura de Dados : Defina uma interface coordenadaspara garantir que a latitude e longitude sejam retornadas de forma consistente.
Integração com o Projeto:
A GeoServiceé integrada principalmente na camada de negócio, especificamente no ServicosBusiness( src/business/ServicosBusiness.ts).

Criação de Serviços : Quando um novo serviço é criado através do método createServiconão ServicosBusiness:
Verifique ServicosBusinessse GOOGLE_MAPS_API_KEYas variáveis ​​de ambiente estão configuradas.
Ele concatena o endereço e a cidade fornecida no DTO do serviço para formar um endereço completo.
Em seguida, ele chama o método getCoordenadasda GeoService, passando o endereço completo e a chave da API.
As coordenadas (latitude e longitude) retornadas pela GeoServicesão então adicionadas aos dados do serviço antes de serem persistidas no banco de dados pela camada ServicosData.
Erros relacionados à API do Google Maps ou validação de endereços são tratados e relacionados para as camadas superiores.
Benefícios da Integração:
Geolocalização de Serviços : Permite que cada serviço cadastrado tenha uma localização geográfica precisa.
Potencial para Novas Funcionalidades : Abre portas para futuras funcionalidades como:
Busca de serviços por proximidade.
Exibição de serviços em um mapa.
Cálculo de distância entre o usuário e o serviço.
Separação de Responsabilidades : Uma lógica de geocodificação é encapsulada em um serviço dedicado, mantendo o ServicosBusinessfoco nas regras de negócio dos serviços.
5. Conclusão
O projeto da API de Saúde Mental é uma aplicação robusta e bem estruturada, projetada para gerenciar informações de forma eficiente. A inclusão da APIlocalizacao.tsdemonstração de uma preocupação com a expansão das funcionalidades, permitindo que os serviços sejam não apenas listados, mas também localizados geograficamente, o que é um diferencial importante para aplicações modernas.
