import React from "react";
import { useState } from "react";
import logo from "./logong.jpeg";
import { auth, db } from "./firebase";
import firebase from "firebase";
function Header(props){

  

  
  function logar(e){
    e.preventDefault();
    let email = document.getElementById('email-login').value;
    let senha = document.getElementById('senha-login').value;

    auth.signInWithEmailAndPassword(email, senha)
    .then((auth)=>{
        props.setUser(auth.user.displayName);
        db.collection('usuarios').doc(auth.user.displayName).onSnapshot(function(snapshot){
          props.setTipoConta(snapshot.get("tipoConta"))
          props.setIdLoja(snapshot.get("idLoja"))
          props.setNomeLoja(snapshot.get("nomeLoja"))
        });
          
        alert('Logado com sucesso!');
    }).catch((error)=>{
        var errorMessage = error.message;
        alert(errorMessage);
    });
  };

  function deslogar(e){
    e.preventDefault();
    auth.signOut().then(function(val){
        props.setUser(null);            
        window.location.href = '/';
    })
  }

    return (
      <div className="header">
        <div className='center'>

          <div className='header__logo'>
            <a href=''><img src={logo} /></a>
          </div>

          {
            (props.user)?
            <div className='header__logadoInfo'>
              <span><b>{props.user}</b></span>              
              <a onClick={(e)=>deslogar(e)}>Deslogar</a>
            </div>
            :
            <div className="header__info">
              <div className='header__loginForm'>
                <form onSubmit={(e)=>logar(e)}>
                  <input id='email-login' type="text" placeholder="Login..." />
                  <input id='senha-login' type="password" placeholder="Senha..." />
                  <input type="submit" name="acao" value="Login" />
                </form>
              </div>
            </div>
          }
        </div>
      </div>
    )
}

export default Header;