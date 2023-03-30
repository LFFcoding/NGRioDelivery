import { render } from "@testing-library/react";
import { useEffect, useState } from "react";





function Posicao(props){
    var [latitude, setLatitude] = useState('');
    var [longitude, setLongitude] = useState('');
    var [distancia, setDistancia] = useState([]);

    function calculaDistancia(e){
        e.preventDefault();
        var coordLanchonete = "-22.645386642154325, -43.28690287685827";
        var coordenadas = coordLanchonete.split(", ");
    
        var lat1 = parseFloat(coordenadas[0]);
        var lon1 = parseFloat(coordenadas[1]);
        var lat2 = latitude;
        var lon2 = longitude;
    
        var dla = (lat1)-(lat2);
        var dlo = (lon1)-(lon2);
    
        var hipotenusa = Math.sqrt((dla*dla)+(dlo*dlo));
        var dist = hipotenusa*102177;
        setDistancia(dist);
        render(distancia + 'm');
    }

    function atualizaDistancia(e){
        e.preventDefault();
        navigator.geolocation.watchPosition((position)=>{
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        })
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').placeholder = longitude;
    }

    useEffect(()=>{
        navigator.geolocation.watchPosition((position)=>{
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        })
        document.getElementById('latitude').placeholder = latitude;
        document.getElementById('longitude').placeholder = longitude;
    });

    return ( 
        <div className="center">
            <form onSubmit={(e)=>calculaDistancia(e)} className="form_posicao">
                <h5>Latitude</h5>
                <input id='latitude' type="text" placeholder='lat' />
                <h5>Longitude</h5>
                <input id='longitude' type="text" placeholder='long' />
                <button onClick={(e)=>atualizaDistancia(e)} name="Atualizar distancia">Atualizar posição</button>
                <input type="submit" value='gravar distancia' />
            </form>
        </div>
    )
}

export default Posicao
