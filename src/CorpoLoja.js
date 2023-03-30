import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { auth, db } from "./firebase";
function CorpoLoja(props) {

    const [entregas, setEntregas] = useState([]);

    useEffect(()=>{
        db.collection('lojas').doc(props.user).collection('entregas').where('idLoja','==',auth.currentUser.uid).onSnapshot((snapshot)=>{
            setEntregas(snapshot.docs.map((document)=>{
                return{id:document.id, info:document.data()}
            }))
        })
    }, []);

    function exibeDados(){
        alert(`
Id usuário: ${auth.currentUser.uid}
Tipo de conta: ${props.tipoConta}
Id da loja: ${props.idLoja}
Nome da loja: ${props.nomeLoja}`
        )
    }

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
            db.collection('lojas').doc(props.user).collection('entregadores').doc(username).set({
                nomeEntregador:username,
                idLoja: props.idLoja
            });
            db.collection('usuarios').doc(username).set({
                usuario:username,
                tipoConta:'entregador',
                idUsuario:authUser.user.uid,
                idLoja: props.idLoja,
                nomeLoja: props.user
            })
            alert('Conta criada com sucesso!');
            let modal = document.querySelector('.modalCriarConta');
            modal.style.display = 'none';
        }).catch((error)=>{
            var errorMessage = error.message;
            alert(error);
        });
    
      };



    return(
        <div className="corpo__loja">
            <div className="center loja">
                <div className="btns__menus w100">
                    <button className="btn_menu_loja">Motoboys</button>
                    <button onClick={()=>exibeDados()} className="btn_menu_loja">Relatório</button>
                    <button onClick={()=>abrirModalCriarConta()} className="btn_menu_loja">Cadastro Motoboy</button>
                </div>
                <div className="w100 painel">
                    <div className="W25">

                    </div>
                    <div className="W75">
                        <div>
                            {
                                `${entregas.length}`
                            }
                        </div>
                    </div>
                </div>

            </div>
            <div className='modalCriarConta'>
                <div className='formCriarConta'>
                    <div onClick={()=>fecharModalCriar()} className='close-modal-criar'>X</div>
                    <h2>Cadastrar Motoboy</h2>
                    <form onSubmit={(e)=>criarConta(e)}>
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

export default CorpoLoja;