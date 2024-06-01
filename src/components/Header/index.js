import style from './header.module.css'
import logo from '../../assets/logoFelipe.svg'

export function Header({descricao,titulo}) {
    return (
        <div className={style.header}>
            <div className={style.headerTopo}>
                <div className={style.headerText}>
                    <h1>{titulo}</h1>
                    <p>{descricao}</p>
                </div>
                <img src={logo} />
            </div>
            <div className={style.linha}></div>
        </div>
    )
}