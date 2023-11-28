var showCat = 0;
var orderDict = {};
var prodDict = {}
var key = 'EIOQV1czL3f';

function getCategories(){
  let request = new XMLHttpRequest();
  request.open('GET','http://loja.buiar.com/?key='+key+'&c=categoria&t=listar&f=json');
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    categoriasList = document.getElementById('categoriasList');
    categoriasSelect = document.getElementById('formProdutos').elements['categoria'];
    categoriasEditSelect = document.getElementById('formEditProdutos').elements['categoria'];
    categoriasSelect.innerHTML = "";
    categoriasEditSelect.innerHTML = "";
    categoriasList.innerHTML = "";
    let dadosJson = request.response;

    for (let i = 0; i<dadosJson['dados'].length; i++){
      catLi = document.createElement('li');
      catLi.id = "cat"+dadosJson['dados'][i]['id']+'menu';
      catLink = document.createElement('a');
      catLink.href = "#";
      catLink.setAttribute("onclick","showProducts("+dadosJson['dados'][i]['id']+")");
      catLink.innerHTML=dadosJson['dados'][i]['nome'];
      catLi.appendChild(catLink);

      editCatLink = document.createElement('a');
      editCatLink.href = "#";
      editCatLink.setAttribute("onclick","editCatPag("+dadosJson['dados'][i]['id']+",'"+dadosJson['dados'][i]['nome']+"')");
      editCatLink.innerHTML="Editar"
      catLi.appendChild(editCatLink);

      categoriasList.appendChild(catLi);

      catSel = document.createElement('option');
      catSel.innerHTML = dadosJson['dados'][i]['nome'];
      catSel.value = dadosJson['dados'][i]['id'];
      categoriasSelect.appendChild(catSel);

      catSel = document.createElement('option');
      catSel.innerHTML = dadosJson['dados'][i]['nome'];
      catSel.value = dadosJson['dados'][i]['id'];
      categoriasEditSelect.appendChild(catSel);

      getProducts(dadosJson['dados'][i]['id']);
    }
  }
}

function getProducts(categoria){
  let request = new XMLHttpRequest();
  request.open('GET','http://loja.buiar.com/?key='+key+'&c=produto&t=listar&f=json&categoria='+categoria);
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    let dadosJson = request.response;
    prodDict[categoria] = dadosJson['dados'];
    if(dadosJson['dados'].length == 0){
      let catMenu = document.getElementById('cat'+categoria+'menu');
      let deleteCat = document.createElement('a');
      deleteCat.href = "#";
      deleteCat.setAttribute("onclick","deleteCat("+categoria+")");
      deleteCat.innerHTML="Excluir";
      catMenu.appendChild(deleteCat);
    }
    showProducts(showCat);
  }
}

function showProducts(categoria){
  showCat = categoria;
  if (typeof prodDict[categoria] !== "undefined"){
    produtos = document.getElementById('produtosTable').getElementsByTagName('tbody')[0];
    produtos.innerHTML = "";
    for (let i = 0; i<prodDict[categoria].length; i++){
      prodLine = document.createElement('tr');
      for(let key in prodDict[categoria][i]){
        let td = document.createElement('td');
        if (key == "imagem"){
          let imgSrc = prodDict[categoria][i][key];
          if (imgSrc == ''){
            imgSrc = 'default-image.png';
          }
          td.innerHTML = "<img src="+imgSrc+">";
        }
        else if(key == "peso" || key == "preco"){
          td.innerHTML = prodDict[categoria][i][key].toString().replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }
        else {
          td.innerHTML = prodDict[categoria][i][key];
        }
        prodLine.appendChild(td);
      }
      let td = document.createElement('td');
      td.innerHTML='<a href="#" onclick="deleteProd('+prodDict[categoria][i]['id']+')">Excluir</a><a href="#" onclick="editProdPag('+categoria+','+i+')">Editar</a>'
      prodLine.appendChild(td);
      produtos.appendChild(prodLine);
    }
  }
}

function getOrders(){
  let request = new XMLHttpRequest();
  request.open('GET','http://loja.buiar.com/?key='+key+'&c=pedido&t=listar&f=json');
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    pedidosList = document.getElementById('pedidosList');
    pedidosList.innerHTML = "";
    let dadosJson = request.response;

    for (let i = 0; i<dadosJson['dados'].length; i++){
      catLi = document.createElement('li');
      catLi.innerHTML = '<a href="#" onclick="getOrder('+dadosJson['dados'][i]['id']+')">'+dadosJson['dados'][i]['id']+' '+dadosJson['dados'][i]['nome']+'</a>';
      pedidosList.appendChild(catLi);
      orderDict[dadosJson['dados'][i]['id']] = dadosJson['dados'][i];
    }
  }
}

function getOrder(pedido){
  cliente = document.getElementById('cliente')
  cliente.innerHTML = "";

  for(let key in orderDict[pedido]){
    let li = document.createElement('li');
    entry = orderDict[pedido][key];
    if (key == "time"){
      let time = new Date(entry);
      li.innerHTML = 'Data/hora: '+ time.getDate() +'/'+(time.getMonth()+1)+'/'+time.getFullYear()+' '+time.getHours().toString().padStart(2,'0')+':'+time.getMinutes().toString().padStart(2,'0');
    }
    else if(key == "cpf"){
      if (entry.length < 11){
        entry = '0'.repeat(11-entry.length) + entry;
      }
      li.innerHTML = "CPF: "+entry.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    else if(key == "cep"){
      li.innerHTML = "CEP: "+entry.replace(/(\d{2})(\d{3})(\d{2})/, "$1.$2-$3");
    }
    else{
      li.innerHTML = key.charAt(0).toUpperCase() + key.slice(1) +': '+ entry;
    }
    cliente.appendChild(li);
  }

  itens = document.getElementById('pedidoItens').getElementsByTagName('tbody')[0];
  itens.innerHTML = "";
  let request = new XMLHttpRequest();
  request.open('GET','http://loja.buiar.com/?key='+key+'&c=item&t=listar&f=json&pedido='+pedido);
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    let dadosJson = request.response;
    for (let i = 0; i<dadosJson['dados'].length; i++){
      itemLine = document.createElement('tr');
      th = document.createElement('th');
      th.scope = 'row';
      th.innerHTML = i+1;
      itemLine.appendChild(th);
      itens.appendChild(itemLine);

      getOrderItens(dadosJson['dados'][i]['produto'],itemLine,dadosJson['dados'][i]['qtd']);
    }
  }
}

function getOrderItens(id,line,qtd){
  let request = new XMLHttpRequest();
  request.open('GET','http://loja.buiar.com/?key='+key+'&c=produto&t=listar&f=json&id='+id);
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    td = document.createElement('td');
    td.innerHTML = id;
    line.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = request.response['dados'][0]['nome'];
    line.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = request.response['dados'][0]['preco'].replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    line.appendChild(td);

    td = document.createElement('td');
    td.innerHTML = Math.trunc(qtd);
    line.appendChild(td);
  }
}

function hiddenAll(){
  let paginas = document.getElementsByClassName('pag');
  for (let pagina of paginas){
    pagina.style = "display:none;";
  }
}

function catProdPag(){
  hiddenAll();
  document.getElementById('catProdPag').style="display:flex;";
}

function pedidosPag(){
  hiddenAll();
  document.getElementById('pedidosPag').style="display:flex;";
}

function criaCatPag(){
  hiddenAll();
  document.getElementById('criaCatPag').style="display:block;";
}

function editCatPag(id,nome){
  hiddenAll();
  let form = document.getElementById('formEditCategoria');
  form.elements['id'].value = id;
  form.elements['nome'].value = nome;
  document.getElementById('editCatPag').style="display: block;";
}

function editProdPag(categoria,i){
  hiddenAll();
  let form = document.getElementById('formEditProdutos');
  form.elements['id'].value = prodDict[categoria][i]['id'];
  form.elements['codigo'].value = prodDict[categoria][i]['codigo'];
  form.elements['categoria'].value = prodDict[categoria][i]['categoria'];
  form.elements['nome'].value = prodDict[categoria][i]['nome'];
  form.elements['descricao'].value = prodDict[categoria][i]['descricao'];
  form.elements['preco'].value = prodDict[categoria][i]['preco'].toString().replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  form.elements['imagem'].value = prodDict[categoria][i]['imagem'];
  form.elements['peso'].value = prodDict[categoria][i]['peso'].toString().replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  document.getElementById('editProdPag').style="display: block;";
}

function criaProdPag(){
  hiddenAll();
  document.getElementById('criaProdPag').style="display:block;";
}

window.onload = function(){
  getCategories();
  getOrders();
}

document.getElementById("formProdutos").addEventListener('submit',function(event){
    event.preventDefault();
    let data = new FormData();
    let form = document.getElementById('formProdutos');
    data.append('codigo', form.elements['codigo'].value);
    data.append('categoria', form.elements['categoria'].value);
    data.append('nome', form.elements['nome'].value);
    data.append('descricao', form.elements['descricao'].value);
    data.append('preco', form.elements['preco'].value.replace(/[a-zA-Z.$#]/g,'').replace(',','.'));
    data.append('imagem', form.elements['imagem'].value);
    data.append('peso', form.elements['peso'].value.replace(/[a-zA-Z.$#]/g,'').replace(',','.'));
    let request = new XMLHttpRequest();
    request.open('POST',"http://loja.buiar.com/?key="+key+"&c=produto&t=inserir&f=json");
    request.responseType = 'json';
    request.send(data);
    request.onload = function (response) {
      if(request.response['erro'] == 0){
        alert("Produto cadastrado com sucesso!");
        form.reset();
        getCategories();
      }
      else{
        alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status']);
      }
    };
})

document.getElementById("formCategoria").addEventListener('submit',function(event){
    event.preventDefault();
    var data = new FormData();
    let form = document.getElementById('formCategoria');
    data.append('nome', form.elements['nome'].value);
    let request = new XMLHttpRequest();
    request.open('POST',"http://loja.buiar.com/?key="+key+"&c=categoria&t=inserir&f=json");
    request.responseType = 'json';
    request.send(data);
    request.onload = function (response) {
      if(request.response['erro'] == 0){
        form.reset();
        getCategories();
        alert("Categoria cadastrada com sucesso!");
      }
      else{
        alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status'])
      }
    };
})

function deleteProd(id){
  let request = new XMLHttpRequest();
  request.open('GET',"http://loja.buiar.com/?key="+key+"&c=produto&t=remover&f=json&id="+id);
  request.send();
  request.responseType = 'json';
  request.onload = function (response) {
    if(request.response['erro'] == 0){
      getCategories();
      alert("Produto removido com sucesso!");
    }
    else{
      alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status'])
    }
  };
}

function deleteCat(id){
  let request = new XMLHttpRequest();
  request.open('GET',"http://loja.buiar.com/?key="+key+"&c=categoria&t=remover&f=json&id="+id);
  request.send();
  request.responseType = 'json';
  request.onload = function (response) {
    if(request.response['erro'] == 0){
      getCategories();
      alert("Categoria removida com sucesso!");
    }
    else{
      alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status'])
    }
  };
}

document.getElementById("formEditCategoria").addEventListener('submit',function(event){
    event.preventDefault();
    var data = new FormData();
    let form = document.getElementById('formEditCategoria');
    data.append('nome', form.elements['nome'].value);
    let request = new XMLHttpRequest();
    request.open('POST',"http://loja.buiar.com/?key="+key+"&c=categoria&t=alterar&f=json&id="+form.elements['id'].value);
    request.responseType = 'json';
    request.send(data);
    request.onload = function (response) {
      if(request.response['erro'] == 0){
        getCategories();
        catProdPag();
        alert("Categoria alterada com sucesso!");
      }
      else{
        alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status'])
      }
    };
})

document.getElementById("formEditProdutos").addEventListener('submit',function(event){
    event.preventDefault();
    let data = new FormData();
    let form = document.getElementById('formEditProdutos');
    data.append('codigo', form.elements['codigo'].value);
    data.append('categoria', form.elements['categoria'].value);
    data.append('nome', form.elements['nome'].value);
    data.append('descricao', form.elements['descricao'].value);
    data.append('preco', form.elements['preco'].value.replace(/[a-zA-Z.$#]/g,'').replace(',','.'));
    data.append('imagem', form.elements['imagem'].value);
    data.append('peso', form.elements['peso'].value.replace(/[a-zA-Z.$#]/g,'').replace(',','.'));
    let request = new XMLHttpRequest();
    request.open('POST',"http://loja.buiar.com/?key="+key+"&c=produto&t=alterar&f=json&id="+form.elements['id'].value);
    request.responseType = 'json';
    request.send(data);
    request.onload = function (response) {
      if(request.response['erro'] == 0){
        alert("Produto alterado com sucesso!");
        getCategories();
        catProdPag();
      }
      else{
        alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status'])
      }
    };
})

$("#idPriceProd").keypress(function() {
    $(this).mask('#.##0,00', {reverse: true});
});

$("#idEditPriceProd").keypress(function() {
    $(this).mask('#.##0,00', {reverse: true});
});

$("#idWeightProd").keypress(function() {
    $(this).mask('#.##0,000', {reverse: true});
});

$("#idEditWeightProd").keypress(function() {
    $(this).mask('#.##0,000', {reverse: true});
});
