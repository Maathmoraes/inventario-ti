import { useState } from "react";
import logoBBM from "./assets/logo-bbm.png";
import "./App.css";
function App() {
  const [equipamentos, setEquipamentos] = useState(() => {
    const equipamentosSalvos = localStorage.getItem("equipamentos");

    return equipamentosSalvos ? JSON.parse(equipamentosSalvos) : [];
  });

  const [equipamentoEditando, setEquipamentoEditando] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [mostrarEquipamentos, setMostrarEquipamentos] = useState(false);

  const [tipo, setTipo] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [status, setStatus] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [setor, setSetor] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  function editarEquipamento(equipamento) {
    const indexOriginal = equipamentos.findIndex(
      (item) => item === equipamento
    );

    setEquipamentoEditando(indexOriginal);
    setFormularioAberto(true);

    setTipo(equipamento.tipo);
    setFabricante(equipamento.fabricante);
    setModelo(equipamento.modelo);
    setMarca(equipamento.marca);
    setNumeroSerie(equipamento.numeroSerie);
    setStatus(equipamento.status);
    setResponsavel(equipamento.responsavel);
    setSetor(equipamento.setor);
    setLocalizacao(equipamento.localizacao);
  }

  function excluirEquipamento(index) {
    const equipamentosAtualizados = equipamentos.filter(
      (_, equipamentoIndex) => equipamentoIndex !== index
    );

    setEquipamentos(equipamentosAtualizados);

    localStorage.setItem(
      "equipamentos",
      JSON.stringify(equipamentosAtualizados)
    );
  }

  function salvarEquipamento(event) {
    event.preventDefault();

    const novoEquipamento = {
      tipo,
      fabricante,
      modelo,
      marca,
      numeroSerie,
      status,
      responsavel,
      setor,
      localizacao
    };

    let equipamentosAtualizados;

    if (equipamentoEditando !== null) {
      equipamentosAtualizados = [...equipamentos];

      equipamentosAtualizados[equipamentoEditando] = novoEquipamento;

      setEquipamentoEditando(null);
    } else {
      equipamentosAtualizados = [...equipamentos, novoEquipamento];
    }

    setEquipamentos(equipamentosAtualizados);

    localStorage.setItem(
      "equipamentos",
      JSON.stringify(equipamentosAtualizados)
    );

    setTipo("");
    setFabricante("");
    setModelo("");
    setMarca("");
    setNumeroSerie("");
    setStatus("");
    setResponsavel("");
    setSetor("");
    setLocalizacao("");

    setFormularioAberto(false);

    console.log("Equipamento salvo:", novoEquipamento);

  }

 function limparFiltros() {
    setBusca("");
    setFiltroTipo("");
    setFiltroStatus("");
    setMostrarEquipamentos(false);
  setTipo("");
  setFabricante("");
  setModelo("");
  setMarca("");
  setNumeroSerie("");
  setStatus("");
  setResponsavel("");
  setSetor("");
  setLocalizacao("");

    setFormularioAberto(false);
    setEquipamentoEditando(null);
  }

  function filtrarPorStatus(statusSelecionado) {
  setBusca("");
  setFiltroTipo("");
  setFiltroStatus(statusSelecionado);
  setMostrarEquipamentos(true);
}

function mostrarTodosEquipamentos() {
  setBusca("");
  setFiltroTipo("");
  setFiltroStatus("");
  setMostrarEquipamentos(true);
}

  const equipamentosFiltrados = equipamentos.filter((equipamento) => {
    const textoBusca = busca.toLowerCase();

    const correspondeBusca =
      equipamento.tipo.toLowerCase().includes(textoBusca) ||
      equipamento.fabricante.toLowerCase().includes(textoBusca) ||
      equipamento.modelo.toLowerCase().includes(textoBusca) ||
      equipamento.marca.toLowerCase().includes(textoBusca) ||
      equipamento.numeroSerie.toLowerCase().includes(textoBusca) ||
      equipamento.status.toLowerCase().includes(textoBusca) ||
      equipamento.responsavel.toLowerCase().includes(textoBusca) ||
      equipamento.setor.toLowerCase().includes(textoBusca) ||
      equipamento.localizacao.toLowerCase().includes(textoBusca);

      const correspondeTipo =
      filtroTipo === "" || equipamento.tipo === filtroTipo;

      const correspondeStatus =
      filtroStatus === "" || equipamento.status === filtroStatus;

      return correspondeBusca && correspondeTipo && correspondeStatus;

    
  });

return (
  <div translate="no">
    <header>
      <img src={logoBBM} alt="Logo BBM" />

      <div className="cabecalho-texto">
    <h1>Inventário TI</h1>
    <p>Controle de equipamentos de TI</p>
    </div>
 </header>

 <main>
  <div className="resumo-dashboard">

    <div 
    className="card-resumo card-disponivel"
     onClick={() => filtrarPorStatus("Disponível")}
>
            <div className="icone-card">🖥️</div>
      <span>Disponível</span>
      <strong>
        {equipamentos.filter(
          (equipamento) => equipamento.status === "Disponível"
        ).length}
        </strong>
        </div>

        <div 
        className="card-resumo card-em-uso"
        onClick={() => filtrarPorStatus("Em uso")}
>
          <div className="icone-card">👤</div>
          <span>Em uso</span>
          <strong>
            {equipamentos.filter(
              (equipamento) => equipamento.status === "Em uso"
            ).length}
          </strong>
        </div>
      
      <div 
      className="card-resumo card-manutencao"
      onClick={() => filtrarPorStatus("Manutenção")}
>
        <div className="icone-card">🔧</div>
        <span>Manutenção</span>
        <strong>
          {equipamentos.filter(
            (equipamento) => equipamento.status === "Manutenção"
          ).length}
        </strong>
      </div>

      <div 
      className="card-resumo card-total"
      onClick={mostrarTodosEquipamentos}
>
        <div className="icone-card">📦</div>
        <span>Total de equipamentos</span>
        <strong>{equipamentos.length}</strong>
        </div>
    </div>
    
<div className="secao-equipamentos">
  <div className="cabecalho-equipamentos">
  <h2>Equipamentos</h2>


  <button
               className="botao-salvar"
                type="button"
                onClick={() => setFormularioAberto(true)}
                >
                  + Adicionar equipamento
                
                </button>
                </div>

                <div className="barra-pesquisa">
    <input
  type="text"
  placeholder="🔎 Buscar por nome, modelo, número de série, responsável..."
  value={busca}
  onChange={(event) => {
    setBusca(event.target.value);
    setMostrarEquipamentos(true);
  }}
/>

  <select
  value={filtroTipo}
  onChange={(event) => {
    setFiltroTipo(event.target.value);
    setMostrarEquipamentos(true);
  }}
>
    <option value="">Todos os tipos</option>
    <option value="Notebook">Notebook</option>
    <option value="Desktop">Desktop</option>
    <option value="Monitor">Monitor</option>
    <option value="Celular">Celular</option>
    <option value="Tablet">Tablet</option>
  </select>

  <select
  value={filtroStatus}
  onChange={(event) => {
    setFiltroStatus(event.target.value);
    setMostrarEquipamentos(true);
  }}
>
    <option value="">Todos os status</option>
    <option value="Disponível">Disponível</option>
    <option value="Em uso">Em uso</option>
    <option value="Manutenção">Manutenção</option>
  </select>

   <button
    className="botao-limpar-filtros"
    type="button"
    onClick={limparFiltros}
  >
    🧹 Limpar filtros
  </button>
  

  </div>

{formularioAberto && (
  <form 
  className="formulario-equipamento"
  onSubmit={salvarEquipamento}
  autoComplete="off"
  >
  
    <label>
      Tipo
      <select
        value={tipo}
        onChange={(event) => setTipo(event.target.value)}
      >
        <option value="">Selecione</option>
        <option value="Notebook">Notebook</option>
        <option value="Desktop">Desktop</option>
        <option value="Monitor">Monitor</option>
        <option value="Celular">Celular</option>
        <option value="Tablet">Tablet</option>
      
      </select>
    </label>

    <label>
      Fabricante
      <input 
      type="text"
      value={fabricante}
      onChange={(event) => setFabricante(event.target.value)}
      />
      </label>

      <label>
        Modelo
        <input 
        type="text"
        value={modelo}
        onChange={(event) => setModelo(event.target.value)}
        />
        </label>

        <label>
          Marca
          <input 
          type="text"
          value={marca}
          onChange={(event) => setMarca(event.target.value)}
          />
          </label>

          <label>
            Número de série
            <input 
            type="text"
            value={numeroSerie}
            onChange={(event) => setNumeroSerie(event.target.value)}
           />
            </label>

            <label>
              Status
              <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Disponível">Disponível</option>
                <option value="Em uso">Em uso</option>
                <option value="Manutenção">Manutenção</option>
              </select>
              </label>

              <label>
                Responsável
                <input 
                type="text"
                value={responsavel}
                onChange={(event) => setResponsavel(event.target.value)}
                />
              </label>

              <label>
                Setor
                <input 
                type="text"
                value={setor}
                onChange={(event) => setSetor(event.target.value)}
                />
              </label>

              <label>
                Localização
                <input 
                type="text"
                value={localizacao}
                onChange={(event) => setLocalizacao(event.target.value)}
                />
              </label>

              <button className="botao-salvar" type="submit">
                {equipamentoEditando !== null
                ? "Atualizar equipamento"
              : "Adicionar equipamento"}
              </button>
            
  </form>
)}

{!mostrarEquipamentos && (
  <div className="estado-inicial">
    <div className="ilustracao-computador">
      <div className="monitor">
        <div className="tela"></div>
      </div>

      <div className="base-monitor"></div>

      <div className="gabinete">
        <div className="botao-gabinete"></div>
        <div className="luz-gabinete"></div>
      </div>
    </div>

    <p>Selecione uma opção acima para visualizar os equipamentos</p>
  </div>
)}

{mostrarEquipamentos && (
  <div className="tabela-container">
  <table border="1">
    <thead>
      <tr>
        <th>Tipo</th>
        <th>Fabricante</th>
        <th>Modelo</th>
        <th>Marca</th>
        <th>Número de série</th>
        <th>Status</th>
        <th>Responsável</th>
        <th>Setor</th>
        <th>Localização</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {equipamentosFiltrados.map((equipamento, index) => (
        <tr key={index}>
          <td>{equipamento.tipo}</td>
          <td>{equipamento.fabricante}</td>
          <td>{equipamento.modelo}</td>
          <td>{equipamento.marca}</td>
          <td>{equipamento.numeroSerie}</td>
          <td>
            <span
             className={
              equipamento.status === "Disponível"
              ? "status status-disponivel"
              : equipamento.status === "Em uso"
              ? "status status-em-uso"
              : "status status-manutencao"
             }
             >
            {equipamento.status}
            </span>
            </td>
          <td>{equipamento.responsavel}</td>
          <td>{equipamento.setor}</td>
          <td>{equipamento.localizacao}</td>
          <td>
            <button 
            className="botao-editar"
            type="button"
            onClick={() => editarEquipamento(equipamento)}
            >

                ✏️ Editar
            </button>

            <button
            className="botao-excluir"
              type="button"
              onClick={() => excluirEquipamento(index)}
            >
              🗑️ Excluir
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
)}
</div>
  </main>
  </div>
)
}

export default App