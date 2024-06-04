

import style from './footer.module.css'

export function Footer() {

    return (
        <div className={style.footer}>
            <div className={style.linha}></div>
            <div className={style.redesIcons}>
                <p>Feito com muito ❤ por <a href="https://github.com/Tiodevs">Felipe.</a></p>
            </div>
        </div>
    )
}