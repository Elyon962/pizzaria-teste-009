let produtos=[];
let id=1;

// GERAR 30 PRODUTOS
const categorias=["pizza","burger","lanche","porcao","bebida"];

categorias.forEach(cat=>{
  for(let i=1;i<=6;i++){
    produtos.push({
      id:id++,
      nome:cat.toUpperCase()+" Especial "+i,
      categoria:cat,
      preco:10+Math.floor(Math.random()*30),
      img:`https://source.unsplash.com/400x300/?${cat}`
    });
  }
});

let carrinho=JSON.parse(localStorage.getItem("carrinho"))||[];
let pedidos=JSON.parse(localStorage.getItem("pedidos"))||[];

function carregar(lista=produtos){
  const div=document.getElementById("produtos");
  div.innerHTML="";
  lista.forEach(p=>{
    div.innerHTML+=`
      <div class="card">
        <img src="${p.img}">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco}</p>
        <button onclick="add(${p.id})">Adicionar</button>
      </div>`;
  });
}

function filtrar(cat){
  if(cat==="todos") carregar();
  else carregar(produtos.filter(p=>p.categoria===cat));
}

function buscar(){
  const texto=document.getElementById("busca").value.toLowerCase();
  carregar(produtos.filter(p=>p.nome.toLowerCase().includes(texto)));
}

function add(id){
  const prod=produtos.find(p=>p.id===id);
  const existente=carrinho.find(p=>p.id===id);
  if(existente) existente.qtd++;
  else carrinho.push({...prod,qtd:1});
  salvarCarrinho();
  atualizar();
  toast("Adicionado!");
}

function atualizar(){
  const div=document.getElementById("itens");
  div.innerHTML="";
  let total=0;
  carrinho.forEach((p,i)=>{
    total+=p.preco*p.qtd;
    div.innerHTML+=`
      <p>${p.nome} (${p.qtd}) - R$${p.preco*p.qtd}
      <button onclick="mudarQtd(${i},1)">+</button>
      <button onclick="mudarQtd(${i},-1)">-</button>
      </p>`;
  });
  document.getElementById("total").innerText=total.toFixed(2);
}

function mudarQtd(i,v){
  carrinho[i].qtd+=v;
  if(carrinho[i].qtd<=0) carrinho.splice(i,1);
  salvarCarrinho();
  atualizar();
}

function salvarCarrinho(){
  localStorage.setItem("carrinho",JSON.stringify(carrinho));
}

function mostrarPix(){
  const pag=document.getElementById("pagamento").value;
  document.getElementById("pix-area").style.display=
  pag==="Pix"?"block":"none";
}

function finalizar(){
  const numero=Date.now();
  const pedido={
    numero,
    cliente:document.getElementById("nome").value,
    total:document.getElementById("total").innerText,
    pagamento:document.getElementById("pagamento").value,
    status:"Em preparo"
  };

  pedidos.push(pedido);
  localStorage.setItem("pedidos",JSON.stringify(pedidos));
  document.getElementById("msg").innerText="Pedido Nº "+numero+" confirmado!";
  carrinho=[];
  salvarCarrinho();
  atualizar();
  atualizarPainel();
}

function atualizarPainel(){
  const div=document.getElementById("lista-pedidos");
  div.innerHTML="";
  pedidos.forEach((p,i)=>{
    div.innerHTML+=`
      <div class="card">
        <p>Nº ${p.numero}</p>
        <p>${p.cliente}</p>
        <p>R$ ${p.total}</p>
        <p>${p.pagamento}</p>
        <p>Status: ${p.status}</p>
        <button onclick="mudarStatus(${i})">Mudar Status</button>
      </div>`;
  });
}

function mudarStatus(i){
  const s=["Em preparo","Saiu para entrega","Entregue"];
  let atual=s.indexOf(pedidos[i].status);
  pedidos[i].status=s[(atual+1)%3];
  localStorage.setItem("pedidos",JSON.stringify(pedidos));
  atualizarPainel();
}

function enviarWhats(){
  let texto="Pedido:%0A";
  carrinho.forEach(p=>{
    texto+=`${p.nome} x${p.qtd}%0A`;
  });
  texto+="Total: R$"+document.getElementById("total").innerText;
  window.open("https://wa.me/5585999999999?text="+texto);
}

function toast(msg){
  const t=document.getElementById("toast");
  t.innerText=msg;
  t.style.display="block";
  setTimeout(()=>t.style.display="none",2000);
}

function toggleMenu(){
  const nav=document.getElementById("menu");
  nav.style.display=nav.style.display==="flex"?"none":"flex";
}

function scrollCardapio(){
  document.getElementById("cardapio").scrollIntoView({behavior:"smooth"});
}

carregar();
atualizar();
atualizarPainel();
