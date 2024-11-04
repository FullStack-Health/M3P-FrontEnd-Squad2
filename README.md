# LABMedical
## Equipe Qcode

LABMedical é um sistema de gestão para instituições de saúde. Foi projetado para simplificar o processo de registro de pacientes e a gestão de exames e consultas em um ambiente hospitalar. Suas principais pessoas usuárias incluem profissionais de saúde, como pessoas da medicina, enfermagem e administração médica, além de pacientes, que terão acesso às suas informações médicas.

Este projeto foi desenvolvido como parte do programa fullstack Floripa Mais Tec, pelo LAB365/SENAI (Florianópolis, Brasil).

### Equipe:

- [Felipe Quérette](https://www.linkedin.com/in/felipe-querette/) PO
- [Pedro Xavier](https://www.linkedin.com/in/xavierpedroo/)
- [Plínio Victor Vianna](https://devplenio.com.br/)
- [Rosa Cristina Freitas](https://www.linkedin.com/in/cristina-freitas-fln/)

## Funcionalidades

- **Registro fácil**: Na tela de login, profissionais de saúde podem se registrar usando um formulário simples.
- **Mudança de senha**: Também é possível solicitar alteração da senha de pessoa usuária na tela de login.
- **Registro de pacientes**: Profissionais de saúde podem registrar pacientes usando um formulário que captura todas as informações necessárias. Os campos do formulário fazem validações para verificar sua adequação.
- **Gestão de exames e consultas**: Profissionais de saúde podem facilmente criar, visualizar e atualizar registros de consultas ou exames para cada paciente.
- **Funcionalidades de pesquisa**: Os registros podem ser pesquisados usando o ID da pessoa paciente ou nome como parâmetros. Os resultados da pesquisa estão em ordem alfabética.
- **Visualização de registros**: Os registros de pacientes reúnem exames e consultas, exibindo-os em ordem cronológica.
- **Informações do sistema**: Na tela inicial, o usuário pode ver as estatísticas atuais do sistema, com o número total de pacientes, exames e consultas registrados.
- **Acesso de pacientes**: Pacientes também podem logar no sistema e encontrar suas informações médicas pessoais.
- **Acesso administrativo**: Pessoas administradoras podem buscar, visualizar e alterar registros de pessoas usuárias do sistema.

## Tecnologias

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 17.3.3. Portanto, é baseado em:

- **HTML**
- **SCSS**
- **Typescript**

## Bibliotecas extras 

As seguintes bibliotecas foram instaladas e recrutadas no desenvolvimento do LABMedical:

- **FontAwesome**  
@fortawesome/angular-fontawesome@0.14.1  
@fortawesome/free-solid-svg-icons@6.5.2

- **NG Bootstrap**  
@ng-bootstrap/ng-bootstrap@16.0.0

- **NGX Mask**  
ngx-mask@17.0.7

- **NGX Toastr**  
ngx-toastr@18.0.0

- **JSON Server**  
json-server@1.0.0-alpha.23

## Processo de Desenvolvimento

Este projeto foi desenvolvido usando um board Kanban no Trello para gestão de tarefas e o GitHub para versionamento de código.

[Trello do projeto](https://trello.com/b/czCf0Lak/m3p-frontend-squad-2)

## Conexão com API

O presente projeto funciona em conexão com a API LABMedical, desenvolvida em Java também por esta equipe, através do Spring Boot.