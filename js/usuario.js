const KEY_BD = '@inventario'

var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}

var filtro = ''

function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(value){
    filtro = value;
    desenhar()
}

function desenhar(){
    const  tbody = document.getElementById('listaRegistroBody')
    if (tbody){
        var data = listaRegistros.usuarios
        if(filtro.trim()){
            const expReg = eval(`/${filtro.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.usuario ) ||  expReg.test( usuario.setor ) || expReg.test( usuario.computador ) || expReg.test( usuario.monitor1 ) || expReg.test( usuario.monitor2 ) || expReg.test( usuario.nobreak )
            } )
        }
        data = data
        .sort( (a,b) => {
            return a.id < b.id ? -1 : 1
        })
        .map(usuario => {
            return `<tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.setor}</td>
                    <td>${usuario.computador}</td>
                    <td>${usuario.monitor1}</td>
                    <td>${usuario.monitor2}</td>
                    <td>${usuario.nobreak}</td>
                    </tr>`
        })
        tbody.innerHTML =  data.join('')
    }
}

function insertUser( nome, usuario, setor, computador, monitor1, monitor2, nobreak ){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, usuario, setor, computador, monitor1, monitor2, nobreak
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editUser( id, nome, usuario, setor, computador, monitor1, monitor2, nobreak ){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id)
    usuario.nome = nome;
    usuario.setor = setor;
    usuario.computador = computador;
    usuario.monitor1 = monitor1;
    usuario.monitor2 = monitor2;
    usuario.nobreak = nobreak;

    gravarBD()
    desenhar()
    visualizar('lista')
}

function deleteUser(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    })
    gravarBD()
    desenhar()
}

function perguntarDelete(id){
    if(confirm('O Registro será excluido. ID:' + id)){
        deleteUser(id)
    }
}

function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('usuario').value = ''
    document.getElementById('setor').value = ''
    document.getElementById('computador').value = ''
    document.getElementById('monitor1').value = ''
    document.getElementById('monitor2').value = ''
    document.getElementById('nobreak').value  = ''
}

function visualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page', pagina)
    if(pagina == 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if (usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('usuario').value = usuario.usuario
                document.getElementById('setor').value = usuario.setor
                document.getElementById('computador').value = usuario.computador
                document.getElementById('monitor1').value = usuario.monitor1
                document.getElementById('monitor2').value = usuario.monitor2
                document.getElementById('nobreak').value  = usuario.nobreak
            }
        }
        document.getElementById('nome').focus();
    }else{
        
    }
}

function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        usuario: document.getElementById('usuario').value,
        setor: document.getElementById('setor').value,
        computador: document.getElementById('computador').value,
        monitor1: document.getElementById('monitor1').value,
        monitor2: document.getElementById('monitor2').value,
        nobreak: document.getElementById('nobreak').value,
    }
    if(data.id){
        editUser( data.id, data.nome, data.usuario, data.setor, data.computador, data.monitor1, data.monitor2, data.nobreak)
    }else{
        insertUser(data.nome, data.usuario, data.setor, data.computador, data.monitor1, data.monitor2, data.nobreak)
    }
    console.log(data)
}

window.addEventListener('load', () => {
    lerBD()

    document.getElementById('cadastroregistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })
})