import React from "react";
import { useState } from "react";
import firebase from "firebase";
import { auth, db, storage } from "./firebase";

function CorpoEntregador(props) {

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    function exibeDados(){
        alert(`
Id usuário: ${auth.currentUser.uid}
Tipo de conta: ${props.tipoConta}
Id da loja: ${props.idLoja}
Nome da loja: ${props.nomeLoja}`
        )
    }

    function abrirModalUpload(){
        let modal = document.querySelector('.modalUpload');
        modal.style.display = 'block';
        
    }

    function fecharModalUpload(){
        let modal = document.querySelector('.modalUpload');
        modal.style.display = 'none';
        window.location.href = '/';
    }

    // mudar upload de entrega para numero do  pedido, nome, valor
    // campos padroes: em andamento true, conferida false

    function uploadPost(e){
        e.preventDefault();
        let tituloPost = document.getElementById('titulo-upload').value;
        let nomeCliente = document.getElementById('nomeCliente').value;
        const uploadTask = storage.ref(`images/${file.name}`).put(file);
        uploadTask.on('state_changed', function(snapshot){
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            setProgress(progress);

        }, function(error){

        },
        ()=>{
            storage.ref('images').child(file.name).getDownloadURL()
            .then(function(url){
                db.collection('lojas').doc(props.nomeLoja).collection('entregas').add({
                    custo: tituloPost,
                    andamento:true,
                    conferida:false,
                    image: url,
                    idLoja: props.idLoja,
                    nomeLoja: props.nomeLoja,
                    userName: props.user,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(()=>{

                    setProgress(0);
                    setFile(null);
    
                    alert('Enviada!');
    
                    document.getElementById('form-upload').reset();
                    fecharModalUpload();
                })
                .catch((error)=>{
                    alert(error);
                })
            })
        })
    
    }

    return(
        <div className="corpo__entregador">
            <div className="center">
                <div className="btns__menus w100">
                    <button className="btn_menu_loja">Relatório</button>
                    <button onClick={()=>exibeDados()} className="btn_menu_loja">Dados da conta</button>
                    <button onClick={()=>abrirModalUpload()} className="btn_menu_loja">Nova entrega</button>
                </div>
            </div>
            <div className='modalUpload'>
                <div className='formUpload'>
                    <div onClick={()=>fecharModalUpload()} className='close-modal-upload'>X</div>
                    <h2>Criar Post</h2>
                    <form id='form-upload' onSubmit={(e)=>uploadPost(e)}>
                        <progress id='progress-upload' value={progress}></progress>
                        <input id='titulo-upload' type='text' placeholder='Valor' />
                        <input id='nomeCliente' type="text" placeholder="Nome do cliente" />
                        <input onChange={(e)=>setFile(e.target.files[0])} type='file' name='file' />
                        <input type='submit' value='Postar!' />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CorpoEntregador;