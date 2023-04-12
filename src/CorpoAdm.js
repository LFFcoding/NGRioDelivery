import React from "react";
import { auth, db } from "./firebase";

function CorpoAdm(props) {

    function abrirModalCriarConta(){
        let modal = document.querySelector('.modalCriarConta');
        modal.style.display = 'block';
    };

    function fecharModalCriar(){
        let modal = document.querySelector('.modalCriarConta');
        modal.style.display = 'none';
    };
    
    function criarConta(e){
        e.preventDefault();
    
        let email = document.getElementById('email-cadastro').value;
        let username = document.getElementById('username-cadastro').value;
        let senha = document.getElementById('password-cadastro').value;
    
        auth.createUserWithEmailAndPassword(email, senha)
        .then((authUser)=>{
            authUser.user.updateProfile({
                displayName:username
            })
            db.collection('lojas').doc(username).set({
                nomeLoja:username,
                idLoja:authUser.user.uid
            });
            db.collection('usuarios').doc(username).set({
                usuario:username,
                tipoConta:'loja',
                idUsuario:authUser.user.uid,
                idLoja:authUser.user.uid,
                nomeLoja: username
            });
            alert('Conta criada com sucesso!');
            let modal = document.querySelector('.modalCriarConta');
            modal.style.display = 'none';
            document.getElementById('form-cadastrarloja').reset();
        }).catch((error)=>{
            var errorMessage = error.message;
            alert(error);
        });
    
    };

    return(
        <div className="corpo__adm">
            <div className="center">
            <div className="btns__menus w100">
                    <button onClick={()=>abrirModalCriarConta()} className="btn_menu_loja">Cadastrar Loja</button>
                </div>
            </div>
            <div className='modalCriarConta'>
                <div className='formCriarConta'>
                    <div onClick={()=>fecharModalCriar()} className='close-modal-criar'>X</div>
                    <h2>Cadastrar nova loja</h2>
                    <form id='form-cadastrarloja' onSubmit={(e)=>criarConta(e)}>
                        <input id='email-cadastro' type='text' placeholder='E-mail' />
                        <input id='username-cadastro' type='text' placeholder='Nome' />
                        <input id='password-cadastro' type='password' placeholder='Senha' />
                        <input type='submit' value='Cadastrar' />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CorpoAdm;