function cotacao(form){
  //limpa página
  document.getElementById('USDData').innerHTML = '';
  document.getElementById('EURData').innerHTML = '';
  document.getElementById('GBPData').innerHTML = '';

  let urlBase = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?$top=10000&$skip=0&$format=json&$select=cotacaoVenda,dataHoraCotacao";

  let inicio = form.elements['inicio'].value;
  inicio = inicio.split('-');
  inicio = inicio[1]+'-'+inicio[2]+'-'+inicio[0];

  let fim = form.elements['fim'].value;
  fim = fim.split('-');
  fim = fim[1]+'-'+fim[2]+'-'+fim[0];

  urlBase = urlBase + "&@dataInicial='"+inicio+"'&@dataFinalCotacao='"+fim+"'&";

  let moedas = form.elements['moeda[]'];

  for (let i = 0; i < moedas.length; i++){
    if (moedas[i].checked){
      url = urlBase + "@moeda='"+moedas[i].value+"'&";
      requestData(moedas[i].value, url, form.elements['retorno'].value);

    }
  }

}

function requestData(moeda, url, formato){
  let saida = [[ 'Data', moeda ]];
  let objeto = document.getElementById(moeda+"Data");
  let request = new XMLHttpRequest();
  request.open('GET',url);
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    let dadosJson = request.response;
    for (let j=0;j<dadosJson['value'].length;j++){
      saida.push([dadosJson['value'][j]['dataHoraCotacao'],dadosJson['value'][j]['cotacaoVenda']]);
    }
    if (formato=='T'){
      montaTabela(saida,objeto);
    }
    else if (formato=='G'){
      montaGrafico(saida,objeto);
    }
  }
}

function montaTabela(saida,objeto){
  tabela = document.createElement('table');
  tabela.cellSpacing = 0;
  tabela.cellPadding = 0;
  header = document.createElement('tr');
  dataHeader = document.createElement('th');
  dataHeader.innerHTML = saida[0][0];
  moedaHeader = document.createElement('th');
  moedaHeader.innerHTML = saida[0][1];

  header.appendChild(dataHeader);
  header.appendChild(moedaHeader);
  tabela.appendChild(header);

  for (let i=1;i<saida.length;i++){

    linha = document.createElement('tr');
    colData = document.createElement('td');
    colData.innerHTML = saida[i][0];
    colMoeda = document.createElement('td');
    colMoeda.innerHTML = saida[i][1];

    linha.appendChild(colData);
    linha.appendChild(colMoeda);
    tabela.appendChild(linha)

  }
  objeto.appendChild(tabela)

}

function montaGrafico(saida,objeto){
  let chart = new google.visualization.LineChart(objeto);
  options = {
          title: 'Cotação',
          curveType: 'function',
          legend: { position: 'bottom' }
        };
  chart.draw(google.visualization.arrayToDataTable(saida), options);
}
