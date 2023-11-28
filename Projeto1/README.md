# csm40-projeto1
Projeto 1 para aula de HTML

# Obtenção de Dados de Câmbio

Elaborar uma aplicação Front End, utilizando somente JS, HTML, CSS e opcionalmente JQuery, para realizar o acesso aos dados públicos do BACEN (json). Para os gráficos pode ser utilizada o Google Charts.

A partir da seleção da(s) moeda(s), e do período em que deva ser feita a consulta, devem ser apresentada uma tabela, e um gráfico de linhas, mostrando a variação da cotação destas moedas em relação ao Real, durante o período escolhido.

- https://dadosabertos.bcb.gov.br/dataset/taxas-de-cambio-todos-os-boletins-diarios

- Deve ser desenvolvida uma identidade visual, utilizando um logo e nome escolhidos pela equipe

- Montar um menu de opções contendo ao menos as seguintes funcionalidades:

--- Seleção do período inicial e final da pesquisa

--- Seleção das moedas, dentre Dólar Americano, Euro e Libra Esterlina. Podem ser selecionadas uma, duas ou as três moedas.

--- Formato de saída dos dados, na forma de tabela ou gráfico de linhas

--- Sobre : Mostrar informações sobre a empresa e a aplicação (que vocês desenvolveram)

---  Ajuda : Como usar a aplicação

O menu deve sempre estar sendo mostrado, e as opções apresentadas devem ser apresentadas em um DIV na página, ou algo similar.

Mais Detalhes:

https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/documentacao#CotacaoMoedaPeriodo

Simulador:

https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/aplicacao#!/recursos/CotacaoMoedaDia

Exemplo: 

A URL a seguir retorna a cotacao do EURO em um periodo determinado:

https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='EUR'&@dataInicial='04-07-2021'&@dataFinalCotacao='07-20-2021'&$top=10000&$skip=0&$format=json&$select=cotacaoVenda,dataHoraCotacao

Retorno:

{"@odata.context":"https://was-p.bcnet.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata$metadata#_CotacaoMoedaPeriodo(cotacaoVenda,dataHoraCotacao)","value":[

{"cotacaoVenda":6.65240,"dataHoraCotacao":"2021-04-07 10:02:20.596"},

{"cotacaoVenda":6.62930,"dataHoraCotacao":"2021-04-07 11:10:19.796"},

{"cotacaoVenda":6.63030,"dataHoraCotacao":"2021-04-07 12:09:17.498"},

{"cotacaoVenda":6.66350,"dataHoraCotacao":"2021-04-07 13:09:02.756"},
. . . . . . . . . 
. . . . . . . . .

Observações:
- página sobre e help pode ser lorem ipsum
- dólar americano, libra esterlina e euro
- https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/aplicacao#!/recursos/CotacaoMoedaPeriodo#eyJmb3JtdWxhcmlvIjp7IiRmb3JtYXQiOiJqc29uIiwiJHRvcCI6MTAwfX0=
