import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import assets
import './style.css'
import pencil from './assets/pencil.svg';
import iconeFrase from './assets/quote.svg';

// Import Components
import { Modal } from "./components/Modal";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { Footer } from "./components/Footer";

// Gerar imagem
import { toPng } from 'html-to-image';

function App() {

  // Alertas com o toastify
  const inpuVazio = () => {
    toast.error(
      "Você precisa preencher com algum valor!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  const itemAdicionado = () => {
    toast.success(
      "Novo item adicionado com sucesso", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }

  const textoCopiado = () => {
    toast.success(
      "Texto copiado com sucesso", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }


  // Gera o PDF
  const contentDocument = useRef()
  const handlePrint = useReactToPrint({
    content: () => contentDocument.current,
    documentTitle: "To do list s2"
  })

  // Compartilhar 
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

  // Consts useState
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState("")
  const [input2, setInput2] = useState("")
  const [tarefas, setTarefas] = useState([])
  const [open, setOpen] = useState(true)
  const [edit, setEdit] = useState([{
    id: 1,
    name: "teste",
  }])

  // useEffects

  useEffect(() => {
    // Função para verificar o tipo de dispositivo
    const checkDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileDevices = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/;

      if (mobileDevices.test(userAgent) || window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Executa a verificação ao montar o componente
    checkDevice();

    // Listener para ajustar em tempo real caso a janela seja redimensionada
    window.addEventListener('resize', checkDevice);

    // Cleanup para remover o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  useEffect(() => {
    // Pegas as informaçoes salvas no localStorage e tranforma em lista denovo
    const tarefasStorage = localStorage.getItem('@tarefa')
    if (tarefasStorage) {
      setTarefas(JSON.parse(tarefasStorage))
    }
  }, [])

  useEffect(() => {
    // Tranforma a lista em uma string usando JSON e salva os itens da lista no localStorage toda vez que a const tarefas for alterado
    localStorage.setItem('@tarefa', JSON.stringify(tarefas))
  }, [tarefas]);


  // Functions

  // Function para o form
  function handleRegister(e) {
    e.preventDefault()

    // Valida se não está vazio o input
    if (!input || !input2) return inpuVazio();
    const newTarefa = {
      id: Math.random(),
      name: input,
      frase: input2
    }

    console.log("fomulario enviado")
    console.log(newTarefa)
    itemAdicionado()
    setTarefas([...tarefas, newTarefa])
    setInput('')
    setInput2('')
  }

  // Functions dos Itens
  function handleExluir(key) {


    // Filtra a lista atual, criando uma nova lista somente com os itens que não são os com o id igual o da key
    const newList = tarefas.filter((task) => task.id !== key)
    setTarefas(newList)
  }



  function handleEdit(name, id) {
    // Abre o modal
    setOpen(!open)

    // Pega as props e cria um novo item e armazena na const edit
    const editItem = {
      id: id,
      name: name
    }

    setEdit([editItem])
  }

  // Functions dos Btn Export

  const copyToClipboard = () => {
    // Concatenar os valores dos objetos em uma string
    const valuesToCopy = tarefas.map((item, index) => `-------\nNome: ${item.name}\nFrase: ${item.frase}`).join('\n');
    const newVeluesToCopy = "Suas frases especiais são: \n" + valuesToCopy

    // Usa navigator.clipboard.writeText para copiar a string formatada para a área de transferência e depois faz a validação.
    navigator.clipboard.writeText(newVeluesToCopy)
      .then(() => {
        textoCopiado()
      })
      .catch(err => {
        console.error('Falha ao copiar: ', err);
      });
  };

  return (
    // O ref={contentDocument} define qual elemnto vai aparecer no PDF
    <div className="Container" ref={contentDocument}>

      <div className="ContainerTop">

        {/* Dependencia para os alertas */}
        <ToastContainer />

        <Modal
          isOpen={open}
          fecharModal={setOpen}
          id={edit[0].id}
          lista={tarefas}
          mudarLista={setTarefas}
        />

        <Header
          titulo={"Frases Note"}
          descricao={"Anote as melhores frases"}
        />

        <Form
          enviar={handleRegister}
          input={input}
          input2={input2}
          setInput={setInput}
          setInput2={setInput2}
          nome={"Adicionar"}
          textInput={"Nome da pessoa"}
          textInput2={"Frase"}
          version={!isMobile ? 1 : 2}
        />



        <div className="itens" ref={contentRef}>
          {tarefas.length === 0 ? (
            <div className="item">
              <p>Responda o formulario para adicionar um item :D</p>
            </div>
          ) : (
            tarefas.map(tarefa => (
              <div className="item">
                <div className="fraseItem">
                  <img src={iconeFrase} />
                  <div>
                    <h2 key={tarefa.id}>{tarefa.name}<br /></h2>
                    <p>{tarefa.frase}</p>
                  </div>
                </div>
                <div className="btnIcons">
                  <button onClick={() => handleEdit(tarefa.name, tarefa.id)}>
                    <img src={pencil} className="itensIcon" />
                  </button>
                </div>
              </div>
            ))
          )
          }

          <div className="btnsExport">
            <button onClick={handlePrint} className="btnCopy">
              Gerar PDF
            </button>

            <button onClick={copyToClipboard} className="btnCopy">
              Copiar Lista
            </button>
            <button onClick={shareImage} className="btnCopy">Compartilhar Imagem</button>
          </div>
        </div>
      </div>

      <Footer />


    </div>
  );
}

export default App;
