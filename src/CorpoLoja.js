import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";

function CorpoLoja(props) {

    const [emAndamento, setEmAndamento] = useState([]);
    const [concluidas, setConcluidas] = useState([]);
    const [motoboys, setMotoboys] = useState([]);

    useEffect(()=>{
        db.collection('lojas').doc(auth.currentUser.displayName).collection('entregas').onSnapshot((snapshot)=>{
            let data = [];
            snapshot.forEach(doc => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            let conc = data.filter((entrega)=> entrega.andamento == false).filter((entrega)=> entrega.conferida == false);
            setConcluidas(conc);
            let emA = data.filter((entrega)=> entrega.andamento == true);
            setEmAndamento(emA);
        });
        db.collection('lojas').doc(auth.currentUser.displayName).collection('entregadores').onSnapshot((snapshot)=>{
            let mot = [];
            snapshot.forEach(doc =>{
                mot.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setMotoboys(mot);
        });
    }, []);

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
            alert(error.message);
        });
    
    };

    function conferirEntrega(id){
        db.collection('lojas').doc(auth.currentUser.displayName).collection('entregas').doc(id).update({
            conferida: true
        });
    };



    return(
        <div className="corpo__loja">
            <div className="center loja">
                <div className="btns__menus w100">
                    <button onClick={()=>abrirModalCriarConta()} className="btn_menu_loja">Cadastro Motoboy</button>
                </div>
                <div className="painel_loja_entregas">
                    <div className="lista_motoboys w25">
                        <h3 className="lista_comum">Motoboys</h3>
                        {
                            motoboys.map(mb => (
                                <div key={mb.id} className="mb_single">
                                    <h2>{mb.nomeEntregador}</h2>
                                    <span>Concluídas: {mb.totalConcluidas}</span>
                                    <span>Valor Total: R$ {mb.totalAReceber}</span>
                                    <button>Conferir entregas</button>
                                </div>
                            ))
                        }

                    </div>
                    <div className="corpo_entregas_loja w75">
                        <div className="entregas_andamento">
                            <h3 className="lista_comum">Entregas em Andamento</h3>
                            {
                                emAndamento.map(ea => (
                                    <div key={ea.id} className="ea_single">
                                        <span>Entregador: {ea.userName}</span>
                                        <span>Cliente: {ea.nomeCliente}</span>
                                        <span>Taxa: R${ea.custo}</span>
                                        <span><a href={ea.image}>Ver Nota</a></span>
                                    </div>
                                ))
                            }

                        </div>
                        <div className="entregas_concluidas">
                            <h3 className="lista_comum">Entregas Concluídas</h3>
                            {
                                concluidas.map((ea) => (
                                    <div key={ea.id} className="ea_single">
                                        <span>Entregador: {ea.userName}</span>
                                        <span>Cliente: {ea.nomeCliente}</span>
                                        <span>Taxa: R${ea.custo}</span>
                                        <span><a href={ea.image}>Ver Nota</a></span>
                                    </div>
                                ))
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