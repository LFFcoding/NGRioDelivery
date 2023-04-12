import Header from './Header';
import './App.css';
import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import CorpoAdm from './CorpoAdm';
import CorpoEntregador from './CorpoEntregador';
import CorpoLoja from './CorpoLoja';

function App() {
  const [user, setUser] = useState('');
  const [tipoConta, setTipoConta] = useState('');
  const [idLoja, setIdLoja] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');

  
  useEffect(()=>{
    auth.onAuthStateChanged((val)=>{
      if(val != null){
        setUser(val.displayName);
        db.collection('usuarios').doc(val.displayName).onSnapshot(function(snapshot){
          setTipoConta(snapshot.get("tipoConta"))
          setIdLoja(snapshot.get("idLoja"))
          setNomeLoja(snapshot.get("nomeLoja"))
        });
      }
    })
    
  }, []);
  
  var pagina = (
    <div className='App'>
      <Header user={user} setUser={setUser} setTipoConta={setTipoConta} tipoConta={tipoConta} setIdLoja={setIdLoja} setNomeLoja={setNomeLoja}></Header>
    </div>
  );
  if(tipoConta === 'loja'){
    pagina = (
      <div className='App'>
        <Header user={user} setUser={setUser} setTipoConta={setTipoConta} tipoConta={tipoConta} setIdLoja={setIdLoja} setNomeLoja={setNomeLoja}></Header>
        <CorpoLoja user={user} setUser={setUser} tipoConta={tipoConta} idLoja={idLoja}></CorpoLoja>
      </div>
    );
  }else if(tipoConta === 'adm'){
    pagina = (
      <div className='App'>
        <Header user={user} setUser={setUser} setTipoConta={setTipoConta} tipoConta={tipoConta} setIdLoja={setIdLoja} setNomeLoja={setNomeLoja}></Header>
        <CorpoAdm user={user} setUser={setUser} tipoConta={tipoConta}></CorpoAdm>
      </div>
    );
  }else if(tipoConta === 'entregador'){
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
