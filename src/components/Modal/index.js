import { useState } from 'react'
import { Form } from '../Form'
import style from './modal.module.css'
import logoX from '../../assets/x.svg'
import trash from '../../assets/trash.svg'

// Gerar imagem
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';

export function Modal({ isOpen, fecharModal, id, lista, mudarLista }) {

    const [input, setInput] = useState("")
    const [input2, setInput2] = useState("")

    var index = lista.findIndex((task) => task.id === id);

    function handledeletar() {
        fecharModal(!isOpen)
        // Filtra a lista atual, criando uma nova lista somente com os itens que não são os com o id igual o da key
        const newList = lista.filter((task) => task.id !== id)
        mudarLista(newList)
    }

    function handleRegister(e) {
        e.preventDefault()

        if (!input || !input2) return alert("Você deixou o campo vazio");

        // Cria um novo item pelas infomações enviadas do props e o input do formulario do modal
        const newItem = {
            id: id,
            name: input,
            frase: input2
        }

        // Cria uma nova lista alterando apenas o item que tem o id do props pelo newItem e atualiza a lista
        const newLista = lista.map(item =>
            item.id === id ? { ...item, ...newItem } : item
        )

        mudarLista(newLista)

        fecharModal(!isOpen)
        setInput('')
    }

    const contentRef = useRef();
    
    const shareImage = async () => {
        try {
          const dataUrl = await toPng(contentRef.current);
          const blob = await fetch(dataUrl).then((res) => res.blob());
          const file = new File([blob], 'share-image.png', { type: 'image/png' });
    
          if (navigator.share) {
            await navigator.share({
              files: [file],
              title: 'Compartilhar imagem',
            });
          }
        } catch (error) {
          console.error('Error sharing image:', error);
        }
      };

    if (!isOpen) {
        return (
            <div className={style.background}>
                <div className={style.modal}>
                    <div className={style.headerModal}>
                        <div className={style.textHeaderModal}>
                            <h2>Editar item</h2>
                        </div>
                        <button className={style.btnFechar} onClick={() => fecharModal(!isOpen)}>
                            <img src={logoX} alt='a' />
                        </button>
                    </div>
                    <div className={style.linha}></div>
                    <div className={style.item} ref={contentRef}>
                        <div>
                        <h2>{lista[index].name}</h2>
                        <h2>{lista[index].frase}</h2>
                        </div>
                        
                        <div className={style.btnIcons}>
                            <button onClick={() => handledeletar()}>
                                <img src={trash} alt='a'/>
                            </button>
                        </div>
                    </div>
                    <Form
                        enviar={handleRegister}
                        input={input}
                        setInput={setInput}
                        input2={input2}
                        setInput2={setInput2}
                        nome={"Atualizar"}
                        textInput={"Alterar Nome"}
                        textInput2={"Alterar frase"}
                        version={2}
                    />
                    <button onClick={shareImage}>Compartilhar Imagem</button>
                </div>
            </div>
        )
    }
}