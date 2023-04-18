import React, { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase";
import { auth, db, storage } from "./firebase";

function CorpoEntregador(props) {

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);
    const [concluidas, setConcluidas] = useState([]);
    const [emAndamento, setemAndamento] = useState([]);
    const [aReceber, setAReceber] = useState(0);

    useEffect(()=>{
        db.collection('lojas').doc(props.nomeLoja).collection('entregas').where('userName','==', auth.currentUser.displayName).onSnapshot((snapshot)=>{
            let data = [];
            snapshot.forEach(doc => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            let andm = data.filter((entrega) => entrega.andamento == true);
            setemAndamento(andm);
            let conc = data.filter((entrega) => entrega.andamento == false);
            let total = 0;
            conc.map((x)=>{
                total += x.custo;
            })
            setConcluidas(conc);
            setAReceber(total);
            db.collection('lojas').doc(props.nomeLoja).collection('entregadores').doc(auth.currentUser.displayName).update({
                totalAReceber: total,
                totalConcluidas: conc.length
            }).then(console.log('ok')).catch((err)=>{console.log(err.message)});
        })
    }
    , [])

    function concluirEntrega(id){
        db.collection('lojas').doc(props.nomeLoja).collection('entregas').doc(id).update({
            andamento: false
        })
        .then(alert('Concluída'))
        .catch((err)=>{
            console.log(err.message);
        });
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

    function uploadPost(e){
        e.preventDefault();
        let custo = document.getElementById('titulo-upload').value;
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
                    custo: parseInt(custo),
                    nomeCliente: nomeCliente,
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
            <div className="center__entregador">
                <div className="btns__menus w100">
                    <button onClick={()=>abrirModalUpload()} className="btn_menu_loja">Nova entrega</button>
                </div>
                <div className="relatorio">
                    <p>Entregas concluidas: {concluidas.length}<br /></p>
                    <p>Total a receber: R$ {aReceber}<br /></p>
                </div>
                <div className="corpo__entregasSingleAndamento">
                    {
                        emAndamento.map((x)=>(
                        <div key={x.id} className="entrega__single">
                            <span>{x.nomeCliente}</span>
                            <span>Taxa: R$ {x.custo}</span>
                            <span><a href={x.image}>Ver nota</a></span>
                            <button onClick={()=>concluirEntrega(x.id)}>Concluir</button>
                        </div>))
                    }
                </div>
            </div>
            <div className='modalUpload'>
                <div className='formUpload'>
                    <div onClick={()=>fecharModalUpload()} className='close-modal-upload'>X</div>
                    <h2>Nova entrega</h2>
                    <form id='form-upload' onSubmit={(e)=>uploadPost(e)}>
                        <progress id='progress-upload' value={progress}></progress>
                        <input id='titulo-upload' type='number' placeholder='Valor' />
                        <input id='nomeCliente' type="text" placeholder="Nome do cliente" /> 
                        <input onChange={(e)=>setFile(e.target.files[0])} type='file' name='file' />
                        <input type='submit' value='Enviar' />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CorpoEntregador;