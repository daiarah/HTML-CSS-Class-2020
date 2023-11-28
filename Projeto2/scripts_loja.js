var key = 'EIOQV1czL3f';
var prodDict = [];
var carrinho = {};
var carrinhoItens = 0;
var cliente = {}
var valorTotal = 0.0;
var itemFila = 0;

function getProducts(categoria){
    let request = new XMLHttpRequest();
    request.open('GET','http://loja.buiar.com/?key='+key+'&c=produto&t=listar&f=json&categoria='+categoria.value);
    request.responseType = 'json';
    request.send();
    request.onload = function(){
      let dadosJson = request.response;
      prodDict = dadosJson['dados'];
        showProducts();
    }
  }

function showProducts(){
    let product_div = document.getElementById("produtos");
    product_div.innerHTML = "";
    if(prodDict.length == 0){
        product_div.innerHTML = "Não há produtos cadastrados nesta categoria!";
    }
    else
    {

      for (let i=0;i<prodDict.length;i++){
          let produto = document.createElement("div");
          if(prodDict[i].imagem == "")
          {
            prodDict[i].imagem = "default-image.png";
          }
          html = '<div class="prodImg"><img width="200"  ondblclick="addProductToCart('+prodDict[i].id+')" src="' + prodDict[i].imagem + '" draggable="true" ondragstart="drag(event,'+prodDict[i].id+');" /></div>';
          html = html + "<h4>"+prodDict[i]['nome']+"</h4>";
          html = html + "<span>"+prodDict[i]['descricao']+"</span>";
          html = html + "<span class='preco'>R$"+prodDict[i]['preco'].replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')+"</span>"
          produto.innerHTML = html;
          product_div.appendChild(produto);
      }
    }
}

function getCategories(){
  let request = new XMLHttpRequest();
  request.open('GET','http://loja.buiar.com/?key='+key+'&c=categoria&t=listar&f=json');
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    let categoriasList = document.getElementById('categoria');
       let dadosJson = request.response;

    for (let i = 0; i<dadosJson['dados'].length; i++){

       let catoption = document.createElement('option');
       catoption.value = dadosJson['dados'][i]['id'];
       catoption.text = dadosJson['dados'][i]['nome'];
       categoriasList.add(catoption);
     }
     getProducts({ value: dadosJson['dados'][0]['id']});
  }
}
function getCategories(){
  let request = new XMLHttpRequest();
  request.open('GET','http://loja.buiar.com/?key='+key+'&c=categoria&t=listar&f=json');
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    let categoriasList = document.getElementById('categoria');
    let dadosJson = request.response;

    for (let i = 0; i<dadosJson['dados'].length; i++){

      let catoption = document.createElement('option');
      catoption.value = dadosJson['dados'][i]['id'];
      catoption.text = dadosJson['dados'][i]['nome'];
      categoriasList.add(catoption);
      }
      getProducts({ value: dadosJson['dados'][0]['id']});
  }
}

function addProductToCart(produtoId){
  let produto = prodDict.find( e => e.id == produtoId);
  if (!(produtoId in carrinho)){
    carrinho[produtoId] = {'produto':produto,'quantidade':1};
  }
  else{
    carrinho[produtoId]['quantidade']++;
  }
  getCart();

}

function cartAddItem(item){
  carrinho[item]['quantidade']++;
  getCart();
}

function cartSubItem(item){
  carrinho[item]['quantidade']--;
  if (carrinho[item]['quantidade'] < 1){
    delete carrinho[item];
  }
  getCart();
}

function cartRemoveItem(item){
  delete carrinho[item];
  getCart();
}

function getCart(){
  valorTotal = 0.0;
  let cart = document.getElementById('carrinhoItens').getElementsByTagName('tbody')[0];
  cart.innerHTML = "";
  let i = 1;
  carrinhoItens = 0;

  for(let item in carrinho){
    let linha = document.createElement('tr');

    let col = document.createElement('th');
    col.scope = "row";
    col.innerHTML = i;
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = carrinho[item]['produto'].nome;
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = "<img src='"+carrinho[item]['produto'].imagem+"'>";
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = carrinho[item]['produto'].preco.replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = "<a href='#' class='cartQuant button' onclick='cartSubItem("+carrinho[item]['produto'].id+")'>-</a>"+carrinho[item]['quantidade']+"<a href='#' class='cartQuant button' onclick='cartAddItem("+carrinho[item]['produto'].id+")'>+</a>";
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = "<a href='#' onclick='cartRemoveItem("+carrinho[item]['produto'].id+")' class='button'>Remover</a>";
    linha.appendChild(col);

    cart.appendChild(linha);
    valorTotal += parseFloat(carrinho[item]['produto'].preco*carrinho[item]['quantidade']);
    carrinhoItens += carrinho[item]['quantidade'];

    i++;
  }
  document.getElementById('valorTotal').innerHTML = valorTotal.toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  document.getElementById('itensN').innerHTML = carrinhoItens;
}

function hiddenAll(){
  let paginas = document.getElementsByClassName('pag');
  for (let pagina of paginas){
    pagina.style = "display:none;";
  }
}

function showCart(valorTotal){
  hiddenAll();
  document.getElementById('carrinhoPag').style="display: block;";
}

function prodPag(){
  hiddenAll();
  document.getElementById('listaProdutos').style="display: block;";
}

function criaPedido(){
  hiddenAll();
  document.getElementById('criaPedPag').style="display: block;";
}

function buscaCep(form){
  cep = form.elements['clienteCep'].value.replace(/[a-zA-Z.-]/g,'');
  let request = new XMLHttpRequest();
  request.open('GET','https://viacep.com.br/ws/'+cep+'/json');
  request.responseType = 'json';
  request.send();
  request.onload = function(){
    form.elements['clienteLograd'].value = request.response['logradouro'];
    form.elements['clienteBairro'].value = request.response['bairro'];
    form.elements['clienteCidade'].value = request.response['localidade'];
    form.elements['clienteUF'].value = request.response['uf'];
  }
}

function dadosCliente(form){
  cliente['nome'] = form.elements['clienteNome'].value;
  cliente['cpf'] = form.elements['clienteCpf'].value.replace(/[a-zA-Z.-]/g,'');
  cliente['cep'] = form.elements['clienteCep'].value.replace(/[a-zA-Z.-]/g,'');
  cliente['rua'] = form.elements['clienteLograd'].value;
  cliente['numero'] = form.elements['clienteNumero'].value;
  cliente['complemento'] = form.elements['clienteCompl'].value;
  cliente['bairro'] = form.elements['clienteBairro'].value;
  cliente['cidade'] = form.elements['clienteCidade'].value;
  cliente['uf'] = form.elements['clienteUF'].value;

  hiddenAll()
  document.getElementById('confirmaPedidoPag').style = "display: block;";
  confirmaPedidoPag();
}

function confirmaPedidoPag(){
  dadosClienteList = document.getElementById('dadosClienteList');
  dadosClienteList.innerHTML = "";

  for(let key in cliente){
    let li = document.createElement('li');
    entry = cliente[key];
    if(key == "cpf"){
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
    dadosClienteList.appendChild(li);
  }

  let pedidoItens = document.getElementById('pedidoItens').getElementsByTagName('tbody')[0];
  pedidoItens.innerHTML = "";
  let i = 1;

  for(let item in carrinho){
    let linha = document.createElement('tr');

    let col = document.createElement('th');
    col.scope = "col";
    col.innerHTML = i;
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = carrinho[item]['produto'].nome;
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = "<img src='"+carrinho[item]['produto'].imagem+"'>";
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = carrinho[item]['produto'].preco.replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    linha.appendChild(col);

    col = document.createElement('td');
    col.innerHTML = carrinho[item]['quantidade'];
    linha.appendChild(col);

    pedidoItens.appendChild(linha);
    i++;
  }
  let total = document.getElementById('valorTotalPedido');
  total.innerHTML = valorTotal.toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function finalizaPedido(){
  let data = new FormData();
  itemFila = 0;
  data.append('nome', cliente['nome']);
  data.append('cpf', cliente['cpf']);
  data.append('cep', cliente['cep']);
  data.append('rua', cliente['rua']);
  data.append('numero', cliente['numero']);
  data.append('complemento', cliente['complemento']);
  data.append('bairro', cliente['bairro']);
  data.append('cidade', cliente['cidade']);
  data.append('uf', cliente['uf']);
  let request = new XMLHttpRequest();
  request.open('POST',"http://loja.buiar.com/?key="+key+"&c=pedido&t=inserir&f=json");
  request.responseType = 'json';
  request.send(data);
  request.onload = function (response) {
    if(request.response['erro'] == 0){
      alert("Aguarde, seu pedido está sendo enviado");
      for (let key in carrinho){
        itemFila++;
        addItemPedido(request.response['dados']['id'],key);
      }
    }
    else{
      alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status'])
    }
  };
}

function cleanCart(){
  for(key in carrinho){
    cartRemoveItem(key);
  }
}

function addItemPedido(pedido,produto){
  let request = new XMLHttpRequest();
  request.open('POST',"http://loja.buiar.com/?key="+key+"&c=item&t=inserir&f=json&pedido="+pedido+"&produto="+produto+"&qtd="+carrinho[produto]['quantidade']);
  request.responseType = 'json';
  request.send();
  request.onload = function (response) {
    if(request.response['erro'] == 0){
      itemFila--;
      if(itemFila==0){
        alert("Pedido enviado");
        cleanCart();
        prodPag();
      }
    }
    else{
      alert("Ocorreu um erro. A seguinte mensagem foi enviada pelo servidor: "+request.response['status'])
    }
  };
}

window.onload = function(){
    getCategories();
}

function allowDrop(e){
  e.preventDefault();
}

function drag(ev,id){
  ev.dataTransfer.setData("text",id);
}

function drop(ev){
  ev.preventDefault();
  addProductToCart(ev.dataTransfer.getData("text"));
}

$("#clienteCep").keypress(function() {
  $(this).mask('00.000-000', {reverse: true});
});

$("#clienteCpf").keypress(function() {
  $(this).mask('000.000.000-00', {reverse: true});
});
