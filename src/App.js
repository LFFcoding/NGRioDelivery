import Header from './Header';
import './App.css';
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import CorpoAdm from './CorpoAdm';
import CorpoEntregador from './CorpoEntregador';
import CorpoLoja from './CorpoLoja';
import EntregaAL from './EntregaAL';

function App() {
  const [user, setUser] = useState('');
  const [tipoConta, setTipoConta] = useState('');
  const [idLoja, setIdLoja] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');
  const [entregasAL, setEntregasAL] = useState([]);

  
  useEffect(()=>{
    auth.onAuthStateChanged((val)=>{
      if(val != null){
        setUser(val.displayName);
        db.collection('usuarios').doc(val.displayName).onSnapshot(function(snapshot){
          setTipoConta(snapshot.get("tipoConta"))
          setIdLoja(snapshot.get("idLoja"))
          setNomeLoja(snapshot.get("nomeLoja"))
        });
        if(tipoConta == 'loja'){
          db.collection('lojas').doc(user).collection('entregas').where('andamento','==', true).orderBy('timestamp','desc').onSnapshot(function(snapshot){
            setEntregasAL(snapshot.docs.map(function(document){
              return{id:document.id, info:document.data()}
            }))
          })

        }
      }
    })
    
  }, []);
  
  var pagina = (
    <div className='App'>
      <Header user={user} setUser={setUser} setTipoConta={setTipoConta} tipoConta={tipoConta} setIdLoja={setIdLoja} setNomeLoja={setNomeLoja}></Header>
    </div>
  );
  if(tipoConta == 'loja'){
    pagina = (
      <div className='App'>
        <Header user={user} setUser={setUser} setTipoConta={setTipoConta} tipoConta={tipoConta} setIdLoja={setIdLoja} setNomeLoja={setNomeLoja}></Header>
        <CorpoLoja user={user} setUser={setUser} tipoConta={tipoConta} idLoja={idLoja}></CorpoLoja>
        {
          entregasAL.map(function(val){
            return(
              <EntregaAL id={val.id} info={val.info}></EntregaAL>
            )
          })
        }
      </div>
    );
  }else if(tipoConta == 'adm'){
    pagina = (
      <div className='App'>
        <Header user={user} setUser={setUser} setTipoConta={setTipoConta} tipoConta={tipoConta} setIdLoja={setIdLoja} setNomeLoja={setNomeLoja}></Header>
        <CorpoAdm user={user} setUser={setUser} tipoConta={tipoConta}></CorpoAdm>
      </div>
    );
  }else if(tipoConta == 'entregador'){
    pagina = (
      <div className='App'>
        <Header user={user} setUser={setUser} setTipoConta={setTipoConta} tipoConta={tipoConta} setIdLoja={setIdLoja} setNomeLoja={setNomeLoja}></Header>
        <CorpoEntregador user={user} setUser={setUser} tipoConta={tipoConta} idLoja={idLoja} nomeLoja={nomeLoja}></CorpoEntregador>
      </div>
    );
  }
  return pagina;
};

export default App;
