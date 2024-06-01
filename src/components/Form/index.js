import style from './form.module.css'

export function Form({enviar, input, input2, setInput, setInput2, nome, textInput, textInput2, version}) {
    
    if (version === 1){
        return (
            <form onSubmit={enviar} className={style.form}>
                <input
                    placeholder={textInput}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <input
                    placeholder={textInput2}
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                />
                <button type="submit">{nome}</button>
            </form>
        )
    } else {
        return (
            <form onSubmit={enviar} className={style.form2}>
                <input
                    placeholder={textInput}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <input
                    placeholder={textInput2}
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                />
                <button type="submit">{nome}</button>
            </form>
        )
    }

}