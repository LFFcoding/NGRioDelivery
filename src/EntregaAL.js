
function EntregaAL(props) {


    return(
        <div className="entregaAL">
            <span><b>{props.info.userName}</b></span>
            <hr></hr>         
            <span><b>{props.info.nomeCliente}</b></span>           
            <span>R$: <b>{props.info.custo}</b></span>
            <button>Nota</button>
            <button>Excluir</button>
            <button>Conferir</button>
        </div>
    )
}

export default EntregaAL;