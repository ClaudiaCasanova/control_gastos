import { useState, useEffect } from 'react'
import Header from './components/Header'
import Filtros from './components/Filtros';
import ListadoGastos from './components/ListadoGastos';
import Modal from './components/Modal';
import { generarId } from './helpers'
import IconoNuevoGasto from './img/nuevo-gasto.svg'

function App() {

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  );
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  const [modal, setModal] = useState(false);
  const [animarModal, setAnimarModal] = useState(false);
  const [gastos, setGastos] = useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  );
  const [gastoEditar, setGastoEditar] = useState({});
  const [filtro, setFiltro] = useState('');
  const [gastosFiltrados, setGastosFiltrados] = useState([]);

  useEffect(() => {
    if (Object.keys(gastoEditar).length > 0) { //Porque siempre se ejecuta la primera vez aunque no tenga nada
      setModal(true);

      setTimeout(() => {
        setAnimarModal(true);
      }, 200);
    }
  }, [gastoEditar])

  useEffect(() => {
    localStorage.setItem('presupuesto', presupuesto ?? 0) //Si no está presente esa variable se setea a 0
  }, [presupuesto])

  useEffect(() => { //Solo carga una vez, la primera
    const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0;
    if (presupuestoLS > 0) {
      setIsValidPresupuesto(true);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? []);
  }, [gastos])

  useEffect(() => {
    if (filtro) { //filtrar Gastos por categoria
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro);
      setGastosFiltrados(gastosFiltrados);
    }
  }, [filtro]);

  const handleNuevoGasto = () => {
    setModal(true);
    setGastoEditar({});

    setTimeout(() => {
      setAnimarModal(true);
    }, 200);
  }

  const guardarGasto = gasto => {

    if (gasto.id) { //Actualizamos gasto existente
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState);
      setGastos(gastosActualizados);
    } else { //Nuevo gasto
      gasto.id = generarId();
      gasto.fecha = Date.now();
      setGastos([...gastos, gasto])
      setGastoEditar({});
    }
    setAnimarModal(false);

    setTimeout(() => {
      setModal(false);
    }, 200);
  }

  const eliminarGasto = id => {
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id);
    setGastos(gastosActualizados);
  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />


      {isValidPresupuesto && (
        <>
          <main>
            <Filtros
              filtro={filtro}
              setFiltro={setFiltro} />
            <ListadoGastos gastos={gastos}
              setGastoEditar={setGastoEditar}
              eliminarGasto={eliminarGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </main>
          <div className='nuevo-gasto'>
            <img src={IconoNuevoGasto} alt="icono nuevo gasto" onClick={handleNuevoGasto} />
          </div>
        </>
      )}

      {modal && <Modal setModal={setModal}
        animarModal={animarModal}
        setAnimarModal={setAnimarModal}
        guardarGasto={guardarGasto}
        gastoEditar={gastoEditar}
        setGastoEditar={setGastoEditar} />}

    </div>
  )
}

export default App
