import { useEffect, useRef, useState } from "react";

import * as XLSX from "xlsx";

import logoBBM from "./assets/logo-bbm.png";

import "./App.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const coresTipos = {
  Notebook: "#60a5fa",
  Desktop: "#4ade80",
  Monitor: "#fbbf24",
  Celular: "#c084fc",
  Tablet: "#f87171",
};

function TooltipLocalizacaoTipo({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#16263d",
        border: "1px solid #1f3550",
        borderRadius: "8px",
        padding: "10px 12px",
        color: "#ffffff",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#94a3b8",
          fontSize: "12px",
        }}
      >
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "5px",
            fontSize: "13px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: coresTipos[item.dataKey],
              display: "inline-block",
            }}
          ></span>

          <span
            style={{
              color: "#ffffff",
            }}
          >
            {item.dataKey}: {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [equipamentos, setEquipamentos] = useState(() => {
    const equipamentosSalvos = localStorage.getItem("equipamentos");

    return equipamentosSalvos ? JSON.parse(equipamentosSalvos) : [];
  });

  const [equipamentoEditando, setEquipamentoEditando] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [dashboardAberto, setDashboardAberto] = useState(false);
  const [graficosAberto, setGraficosAberto] = useState(false);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [usuariosAberto, setUsuariosAberto] = useState(false);
  const [telaAnterior, setTelaAnterior] = useState("inicio");

const [logado, setLogado] = useState(() => {
  return localStorage.getItem("usuarioLogado") !== null;
});

const [usuarioLogado, setUsuarioLogado] = useState(() => {
  const usuarioSalvo = localStorage.getItem("usuarioLogado");

  return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
});

const [nomeUsuario, setNomeUsuario] = useState("");

const [setorUsuario, setSetorUsuario] = useState("");

const [emailUsuario, setEmailUsuario] = useState("");
const [senhaUsuario, setSenhaUsuario] = useState("");
const [perfilUsuario, setPerfilUsuario] = useState("");
const [emailLogin, setEmailLogin] = useState("");
const [senhaLogin, setSenhaLogin] = useState("");
const [usuarioEditando, setUsuarioEditando] = useState(null);
const [usuarios, setUsuarios] = useState([]);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [relatoriosAberto, setRelatoriosAberto] = useState(false);
  const [relatorioGeralAberto, setRelatorioGeralAberto] = useState(false);
  const [relatorioManutencaoAberto, setRelatorioManutencaoAberto] = useState(false);
  const [relatorioMovimentacaoAberto, setRelatorioMovimentacaoAberto] = useState(false);
  const [filtroRelatorioManutencaoSituacao, setFiltroRelatorioManutencaoSituacao] = useState("");
  const [relatorioHistoricoAberto, setRelatorioHistoricoAberto] = useState(false);
  // Referências da rolagem horizontal do relatório de histórico
const tabelaHistoricoRef = useRef(null);
const barraHistoricoRef = useRef(null);
  // Filtros do relatório de histórico
const [filtroHistoricoTipoEvento, setFiltroHistoricoTipoEvento] = useState("");
const [filtroHistoricoDataInicial, setFiltroHistoricoDataInicial] = useState("");
const [filtroHistoricoDataFinal, setFiltroHistoricoDataFinal] = useState("");
// Filtros do relatório de movimentações
const [filtroMovimentacaoResponsavel, setFiltroMovimentacaoResponsavel] = useState("");
const [filtroMovimentacaoSetor, setFiltroMovimentacaoSetor] = useState("");
const [filtroMovimentacaoShopping, setFiltroMovimentacaoShopping] = useState("");
const [filtroMovimentacaoDataInicial, setFiltroMovimentacaoDataInicial] = useState("");
const [filtroMovimentacaoDataFinal, setFiltroMovimentacaoDataFinal] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroRelatorioGeralEquipamento, setFiltroRelatorioGeralEquipamento] = useState("");
  const [filtroRelatorioGeralTipo, setFiltroRelatorioGeralTipo] = useState("");
  const [filtroRelatorioGeralStatus, setFiltroRelatorioGeralStatus] = useState("");
  const [filtroRelatorioGeralResponsavel, setFiltroRelatorioGeralResponsavel] = useState("");
  const [filtroRelatorioGeralSetor, setFiltroRelatorioGeralSetor] = useState("");
  const [filtroRelatorioGeralLocalizacao, setFiltroRelatorioGeralLocalizacao] = useState("");
  const [filtroRelatorioGeralDataInicial, setFiltroRelatorioGeralDataInicial] = useState("");
  const [filtroRelatorioGeralDataFinal, setFiltroRelatorioGeralDataFinal] = useState("");
  const [filtroRelatorioGeralIdadeEquipamento, setFiltroRelatorioGeralIdadeEquipamento] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroLocalizacao, setFiltroLocalizacao] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [mostrarEquipamentos, setMostrarEquipamentos] = useState(false);

  const [tipo, setTipo] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [dataFabricacao, setDataFabricacao] = useState("");
  const [status, setStatus] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [setor, setSetor] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [motivoManutencao, setMotivoManutencao] = useState("");
  const [observacaoManutencao, setObservacaoManutencao] = useState("");

  const normalizarTexto = (texto) =>
  texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function equipamentoComMaisDeCincoAnos(dataFabricacao) {
  if (!dataFabricacao) {
    return false;
  }

  const dataFabricacaoDate = new Date(`${dataFabricacao}T00:00:00`);
  const hoje = new Date();

  const dataLimite = new Date(
    dataFabricacaoDate.getFullYear() + 5,
    dataFabricacaoDate.getMonth(),
    dataFabricacaoDate.getDate()
  );

  return hoje > dataLimite;
}

function calcularIdadeEquipamento(dataFabricacao) {
  if (!dataFabricacao) {
    return null;
  }

  const dataFabricacaoDate = new Date(`${dataFabricacao}T00:00:00`);
  const hoje = new Date();

  let idade = hoje.getFullYear() - dataFabricacaoDate.getFullYear();

  const aindaNaoFezAniversario =
    hoje.getMonth() < dataFabricacaoDate.getMonth() ||
    (
      hoje.getMonth() === dataFabricacaoDate.getMonth() &&
      hoje.getDate() < dataFabricacaoDate.getDate()
    );

  if (aindaNaoFezAniversario) {
    idade--;
  }

  return idade;
}

const quantidadePorTipo = [
  {
    tipo: "Notebook",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.tipo === "Notebook"
    ).length,
  },
  {
    tipo: "Desktop",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.tipo === "Desktop"
    ).length,
  },
  {
    tipo: "Monitor",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.tipo === "Monitor"
    ).length,
  },
  {
    tipo: "Celular",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.tipo === "Celular"
    ).length,
  },
  {
    tipo: "Tablet",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.tipo === "Tablet"
    ).length,
  },
];

const quantidadePorLocalizacao = [
  {
    localizacao: "BBM",
    quantidade: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) ===
        normalizarTexto("BBM")
    ).length,
  },
  {
    localizacao: "All Brás",
    quantidade: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) ===
        normalizarTexto("All Brás")
    ).length,
  },
  {
    localizacao: "Caninde",
    quantidade: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) ===
        normalizarTexto("Caninde")
    ).length,
  },
  {
    localizacao: "Elev",
    quantidade: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) ===
        normalizarTexto("Elev")
    ).length,
  },
  {
    localizacao: "Porto Brás",
    quantidade: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) ===
        normalizarTexto("Porto Brás")
    ).length,
  },
  {
    localizacao: "Vautier Premium",
    quantidade: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) ===
        normalizarTexto("Vautier Premium")
    ).length,
  },
  {
    localizacao: "Vautier",
    quantidade: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) ===
        normalizarTexto("Vautier")
    ).length,
  },
];

const quantidadePorStatus = [
  {
    status: "Disponível",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.status === "Disponível"
    ).length,
  },
  {
    status: "Em uso",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.status === "Em uso"
    ).length,
  },
  {
    status: "Manutenção",
    quantidade: equipamentos.filter(
      (equipamento) => equipamento.status === "Manutenção"
    ).length,
  },
];

const equipamentosPorLocalizacaoETipo = [
  {
    localizacao: "BBM",
    Notebook: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("BBM") &&
        equipamento.tipo === "Notebook"
    ).length,
    Desktop: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("BBM") &&
        equipamento.tipo === "Desktop"
    ).length,
    Monitor: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("BBM") &&
        equipamento.tipo === "Monitor"
    ).length,
    Celular: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("BBM") &&
        equipamento.tipo === "Celular"
    ).length,
    Tablet: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("BBM") &&
        equipamento.tipo === "Tablet"
    ).length,
  },

  {
    localizacao: "All Brás",
    Notebook: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("All Brás") &&
        equipamento.tipo === "Notebook"
    ).length,
    Desktop: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("All Brás") &&
        equipamento.tipo === "Desktop"
    ).length,
    Monitor: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("All Brás") &&
        equipamento.tipo === "Monitor"
    ).length,
    Celular: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("All Brás") &&
        equipamento.tipo === "Celular"
    ).length,
    Tablet: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("All Brás") &&
        equipamento.tipo === "Tablet"
    ).length,
  },

  {
    localizacao: "Caninde",
    Notebook: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Caninde") &&
        equipamento.tipo === "Notebook"
    ).length,
    Desktop: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Caninde") &&
        equipamento.tipo === "Desktop"
    ).length,
    Monitor: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Caninde") &&
        equipamento.tipo === "Monitor"
    ).length,
    Celular: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Caninde") &&
        equipamento.tipo === "Celular"
    ).length,
    Tablet: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Caninde") &&
        equipamento.tipo === "Tablet"
    ).length,
  },

  {
    localizacao: "Elev",
    Notebook: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Elev") &&
        equipamento.tipo === "Notebook"
    ).length,
    Desktop: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Elev") &&
        equipamento.tipo === "Desktop"
    ).length,
    Monitor: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Elev") &&
        equipamento.tipo === "Monitor"
    ).length,
    Celular: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Elev") &&
        equipamento.tipo === "Celular"
    ).length,
    Tablet: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Elev") &&
        equipamento.tipo === "Tablet"
    ).length,
  },

  {
    localizacao: "Porto Brás",
    Notebook: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Porto Brás") &&
        equipamento.tipo === "Notebook"
    ).length,
    Desktop: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Porto Brás") &&
        equipamento.tipo === "Desktop"
    ).length,
    Monitor: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Porto Brás") &&
        equipamento.tipo === "Monitor"
    ).length,
    Celular: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Porto Brás") &&
        equipamento.tipo === "Celular"
    ).length,
    Tablet: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Porto Brás") &&
        equipamento.tipo === "Tablet"
    ).length,
  },

  {
    localizacao: "Vautier Premium",
    Notebook: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier Premium") &&
        equipamento.tipo === "Notebook"
    ).length,
    Desktop: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier Premium") &&
        equipamento.tipo === "Desktop"
    ).length,
    Monitor: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier Premium") &&
        equipamento.tipo === "Monitor"
    ).length,
    Celular: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier Premium") &&
        equipamento.tipo === "Celular"
    ).length,
    Tablet: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier Premium") &&
        equipamento.tipo === "Tablet"
    ).length,
  },

  {
    localizacao: "Vautier",
    Notebook: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier") &&
        equipamento.tipo === "Notebook"
    ).length,
    Desktop: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier") &&
        equipamento.tipo === "Desktop"
    ).length,
    Monitor: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier") &&
        equipamento.tipo === "Monitor"
    ).length,
    Celular: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier") &&
        equipamento.tipo === "Celular"
    ).length,
    Tablet: equipamentos.filter(
      (equipamento) =>
        normalizarTexto(equipamento.localizacao) === normalizarTexto("Vautier") &&
        equipamento.tipo === "Tablet"
    ).length,
  },
];

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
setDataFabricacao(equipamento.dataFabricacao || "");
setStatus(equipamento.status);
setResponsavel(equipamento.responsavel || "");
setSetor(equipamento.setor || "");
setLocalizacao(equipamento.localizacao || "");
setMotivoManutencao("");
setObservacaoManutencao("");
    setMotivoManutencao("");
    setObservacaoManutencao("");
  }

 function excluirEquipamento(equipamento) {
  const indexOriginal = equipamentos.findIndex(
    (item) => item === equipamento
  );

  const equipamentosAtualizados = equipamentos.filter(
    (_, index) => index !== indexOriginal
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
  dataFabricacao,
  status,
  responsavel,
  setor,
  localizacao,

  historico:
  equipamentoEditando !== null
    ? equipamentos[equipamentoEditando].historico || []
    : [
        {
          tipo: "Cadastro",
          descricao: "Equipamento cadastrado no inventário",
          data: new Date().toISOString(),
          localizacao,
          responsavel,
          status,
          observacao: ""
        }
      ]
};
  let equipamentosAtualizados;

if (equipamentoEditando !== null) {
  equipamentosAtualizados = [...equipamentos];

  const equipamentoAnterior = equipamentos[equipamentoEditando];

const alteracoes = [];

const entrouEmManutencao =
  equipamentoAnterior.status !== "Manutenção" &&
  status === "Manutenção";

const concluiuManutencao =
  equipamentoAnterior.status === "Manutenção" &&
  status === "Disponível" &&
  normalizarTexto(observacaoManutencao).includes(
    "manutencao concluida"
  );

if (
  equipamentoAnterior.status !== status &&
  !entrouEmManutencao &&
  !concluiuManutencao
) {
  alteracoes.push(
    `Status alterado: ${equipamentoAnterior.status} → ${status}`
  );
}

const movimentacoes = [];

if (equipamentoAnterior.localizacao !== localizacao) {
  movimentacoes.push(
    `Localização alterada: ${equipamentoAnterior.localizacao} → ${localizacao}`
  );
}

if (equipamentoAnterior.setor !== setor) {
  movimentacoes.push(
    `Setor alterado: ${equipamentoAnterior.setor} → ${setor}`
  );
}

if (equipamentoAnterior.responsavel !== responsavel) {
  movimentacoes.push(
    `Responsável alterado: ${equipamentoAnterior.responsavel || "-"} → ${responsavel || "-"}`
  );
}

const historicoAtualizado = [
  ...(equipamentoAnterior.historico || [])
];

if (movimentacoes.length > 0) {
  historicoAtualizado.push({
    tipo: "Movimentação",
    descricao: movimentacoes.join("\n"),
    data: new Date().toISOString(),
    origem: equipamentoAnterior.localizacao,
    destino: localizacao,
    responsavelAnterior: equipamentoAnterior.responsavel,
    responsavelNovo: responsavel,
    setorAnterior: equipamentoAnterior.setor,
    setorNovo: setor,
    observacao: ""
  });
}

if (entrouEmManutencao) {
  historicoAtualizado.push({
    tipo: "Manutenção",
    descricao: "Equipamento entrou em manutenção",
    data: new Date().toISOString(),
    situacaoManutencao: "Em andamento",
    motivo: motivoManutencao,
    observacao: observacaoManutencao
  });
}

if (concluiuManutencao) {
  let manutencaoAtualizada = false;

  for (let i = historicoAtualizado.length - 1; i >= 0; i--) {
    if (
      !manutencaoAtualizada &&
      historicoAtualizado[i].tipo === "Manutenção" &&
      historicoAtualizado[i].situacaoManutencao === "Em andamento"
    ) {
      historicoAtualizado[i] = {
        ...historicoAtualizado[i],
        situacaoManutencao: "Concluída",
        dataConclusao: new Date().toISOString(),
        observacao: observacaoManutencao
      };

      manutencaoAtualizada = true;
    }
  }
}

if (alteracoes.length > 0) {
  historicoAtualizado.push({
    tipo: "Alteração",
    descricao: alteracoes.join("\n"),
    data: new Date().toISOString(),
    observacao: ""
  });
}

if (
  movimentacoes.length === 0 &&
  alteracoes.length === 0 &&
  !entrouEmManutencao &&
  !concluiuManutencao
) {
  historicoAtualizado.push({
    tipo: "Alteração",
    descricao: "Equipamento atualizado",
    data: new Date().toISOString(),
    observacao: ""
  });
}
equipamentosAtualizados[equipamentoEditando] = {
  ...novoEquipamento,
  historico: historicoAtualizado
};

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
  setDataFabricacao("");
  setStatus("");
  setResponsavel("");
  setSetor("");
  setLocalizacao("");

  setFormularioAberto(false);

  console.log("Equipamento salvo:", novoEquipamento);
}

function exportarCSV(dados, nomeArquivo) {
  if (dados.length === 0) {
    return;
  }

  const cabecalhos = Object.keys(dados[0]);

  const linhas = dados.map((item) =>
    cabecalhos
      .map((cabecalho) => {
        const valor = item[cabecalho] ?? "";

        return `"${String(valor).replace(/"/g, '""')}"`;
      })
      .join(";")
  );

  const conteudoCSV = [
    cabecalhos.join(";"),
    ...linhas
  ].join("\n");

  const blob = new Blob(
    ["\uFEFF" + conteudoCSV],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${nomeArquivo}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function exportarExcel(dados, nomeArquivo) {
  if (dados.length === 0) {
    return;
  }

  const planilha = XLSX.utils.json_to_sheet(dados);

  const livro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    livro,
    planilha,
    "Relatório"
  );

  XLSX.writeFile(
    livro,
    `${nomeArquivo}.xlsx`
  );
}

function limparFiltros() {
    setBusca("");
    setFiltroTipo("");
    setFiltroLocalizacao("");
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
  setMotivoManutencao("");
setObservacaoManutencao("");

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

  const correspondeLocalizacao =
  filtroLocalizacao === "" ||
  normalizarTexto(equipamento.localizacao) ===
    normalizarTexto(filtroLocalizacao);

  return (
    correspondeBusca &&
    correspondeTipo &&
    correspondeStatus &&
    correspondeLocalizacao
  );
});

const equipamentosDoLocal = localSelecionado 
    ? equipamentos.filter( 
        (equipamento) => 
          normalizarTexto(equipamento.localizacao) === 
          normalizarTexto(localSelecionado) 
      ) 
    : []; 

const movimentacoesHistorico = equipamentos.flatMap((equipamento) =>
  (equipamento.historico || []).filter(
    (evento) => evento.tipo === "Movimentação"
  )
);

const responsaveisMovimentacao = [
  ...new Set(
    movimentacoesHistorico
      .flatMap((evento) => [
        evento.responsavelAnterior,
        evento.responsavelNovo
      ])
      .filter((responsavel) => responsavel)
  )
];

const setoresMovimentacao = [
  ...new Set(
    movimentacoesHistorico
      .flatMap((evento) => [
        evento.setorAnterior,
        evento.setorNovo
      ])
      .filter((setor) => setor)
  )
];

const shoppingsMovimentacao = [
  ...new Set(
    movimentacoesHistorico
      .flatMap((evento) => [
        evento.origem,
        evento.destino
      ])
      .filter((shopping) => shopping)
  )
];

// Histórico completo de todos os equipamentos
const historicoCompleto = equipamentos.flatMap((equipamento) =>
  (equipamento.historico || []).map((evento) => ({
    ...evento,
    equipamento: `${equipamento.fabricante} ${equipamento.modelo}`,
    numeroSerie: equipamento.numeroSerie,
  }))
);

const historicoFiltrado = historicoCompleto.filter((evento) => {
  if (
    filtroHistoricoTipoEvento !== "" &&
    evento.tipo !== filtroHistoricoTipoEvento
  ) {
    return false;
  }

  if (filtroHistoricoDataInicial !== "") {
    const dataEvento = new Date(evento.data);

    const dataInicial = new Date(
      `${filtroHistoricoDataInicial}T00:00:00`
    );

    if (dataEvento < dataInicial) {
      return false;
    }
  }

  if (filtroHistoricoDataFinal !== "") {
    const dataEvento = new Date(evento.data);

    const dataFinal = new Date(
      `${filtroHistoricoDataFinal}T23:59:59`
    );

    if (dataEvento > dataFinal) {
      return false;
    }
  }

  return true;
});

useEffect(() => {
  const tabela = tabelaHistoricoRef.current;
  const barra = barraHistoricoRef.current;

  if (!tabela || !barra) {
    return;
  }

  const conteudoBarra = barra.firstElementChild;

  if (!conteudoBarra) {
    return;
  }

  conteudoBarra.style.width = `${tabela.scrollWidth}px`;

  const sincronizarComTabela = () => {
    barra.scrollLeft = tabela.scrollLeft;
  };

  const sincronizarComBarra = () => {
    tabela.scrollLeft = barra.scrollLeft;
  };

  tabela.addEventListener("scroll", sincronizarComTabela);
  barra.addEventListener("scroll", sincronizarComBarra);

  return () => {
    tabela.removeEventListener("scroll", sincronizarComTabela);
    barra.removeEventListener("scroll", sincronizarComBarra);
  };
}, [relatorioHistoricoAberto, historicoFiltrado.length]);

useEffect(() => {
  const usuariosSalvos = JSON.parse(
    localStorage.getItem("usuarios") || "[]"
  );

  setUsuarios(usuariosSalvos);
}, []);

if (!logado) {
  return (
    <div className="tela-login">
      <div className="login-container">

        <img
          src={logoBBM}
          alt="Logo BBM"
          className="login-logo"
        />

        <h1>Inventário TI</h1>

        <p>Controle de equipamentos de TI</p>

        <form
  onSubmit={(event) => {
    event.preventDefault();

    const usuariosSalvos = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    const usuarioEncontrado = usuariosSalvos.find(
      (usuario) =>
        usuario.email === emailLogin &&
        usuario.senha === senhaLogin
    );

    if (!usuarioEncontrado) {
  alert("E-mail ou senha incorretos.");
  return;
}

localStorage.setItem(
  "usuarioLogado",
  JSON.stringify(usuarioEncontrado)
);

setUsuarioLogado(usuarioEncontrado);

setDashboardAberto(false);
setGraficosAberto(false);
setHistoricoAberto(false);
setRelatoriosAberto(false);
setRelatorioGeralAberto(false);
setRelatorioManutencaoAberto(false);
setRelatorioMovimentacaoAberto(false);
setRelatorioHistoricoAberto(false);
setCadastroAberto(false);
setUsuariosAberto(false);

setLogado(true);
  }}
>
  <div className="campo-login">
    <label>E-mail corporativo</label>
    <input
      type="email"
      placeholder="Digite seu e-mail"
      value={emailLogin}
      onChange={(event) => setEmailLogin(event.target.value)}
    />
  </div>

  <div className="campo-login">
    <label>Senha</label>
    <input
      type="password"
      placeholder="Digite sua senha"
      value={senhaLogin}
      onChange={(event) => setSenhaLogin(event.target.value)}
    />
  </div>

  <button
    className="botao-login"
    type="submit"
  >
    Entrar
  </button>
</form>

      </div>
    </div>
  );
}

return (
  <div translate="no">
    <header>

      <div className="saudacao-usuario">
  Olá, {usuarioLogado?.nome}! 👋
  
</div>

      <img
        src={logoBBM}
        alt="Logo BBM"
      />

      <div className="cabecalho-texto">
    <h1>Inventário TI</h1>
    <p>Controle de equipamentos de TI</p>
    </div>

<button
    className="botao-menu"
    type="button"
    onClick={() => setMenuAberto(!menuAberto)}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
 </header>

 {menuAberto && (
  <>
    <div
      className="fundo-menu"
      onClick={() => setMenuAberto(false)}
    ></div>

    <aside className="menu-lateral">
      <div className="menu-cabecalho">
        <h2>Menu</h2>

        <button
          className="botao-fechar-menu"
          type="button"
          onClick={() => setMenuAberto(false)}
        >
          ×
        </button>
      </div>

 <button
  className="item-menu"
  type="button"
  onClick={() => {
    setDashboardAberto(false);
    setGraficosAberto(false);
    setHistoricoAberto(false);
    setRelatoriosAberto(false);
    setRelatorioGeralAberto(false);
    setRelatorioManutencaoAberto(false);
    setRelatorioMovimentacaoAberto(false);
    setRelatorioHistoricoAberto(false);
    setMenuAberto(false);
  }}
>
  <span>-</span>
  <span>Início</span>
</button>

<button
  className="item-menu"
  type="button"
  onClick={() => {
    setDashboardAberto(true);
    setGraficosAberto(false);
    setHistoricoAberto(false);
    setRelatoriosAberto(false);
    setRelatorioGeralAberto(false);
    setRelatorioManutencaoAberto(false);
    setRelatorioMovimentacaoAberto(false);
    setRelatorioHistoricoAberto(false);
    setMenuAberto(false);
  }}
>
  <span>-</span>
  <span>Dashboard</span>
</button>

<button
  className="item-menu"
  type="button"
  onClick={() => {
    setGraficosAberto(true);
    setDashboardAberto(false);
    setHistoricoAberto(false);
    setRelatoriosAberto(false);
    setRelatorioGeralAberto(false);
    setRelatorioManutencaoAberto(false);
    setRelatorioMovimentacaoAberto(false);
    setRelatorioHistoricoAberto(false);
    setMenuAberto(false);
  }}
>
  <span>-</span>
  <span>Gráficos</span>
</button>

{usuarioLogado?.perfil === "Administrador" && (
  <button
    className="item-menu"
    type="button"
    onClick={() => {
      setCadastroAberto(true);
      setUsuariosAberto(false);
      setDashboardAberto(false);
      setGraficosAberto(false);
      setHistoricoAberto(false);
      setRelatoriosAberto(false);
      setRelatorioGeralAberto(false);
      setRelatorioManutencaoAberto(false);
      setRelatorioMovimentacaoAberto(false);
      setRelatorioHistoricoAberto(false);
      setMenuAberto(false);
    }}
  >
    <span>-</span>
    <span>Cadastro</span>
  </button>
)}

{usuarioLogado?.perfil === "Administrador" && (
  <button 
    className="item-menu" 
    type="button" 
    onClick={() => { 
      if (dashboardAberto) { 
        setTelaAnterior("dashboard"); 
      } else if (graficosAberto) { 
        setTelaAnterior("graficos"); 
      } else if (cadastroAberto) { 
        setTelaAnterior("cadastro"); 
      } else if (historicoAberto) { 
        setTelaAnterior("historico"); 
      } else if (relatoriosAberto) { 
        setTelaAnterior("relatorios"); 
      } else { 
        setTelaAnterior("inicio"); 
      } 

      setUsuariosAberto(true); 
      setCadastroAberto(false); 
      setDashboardAberto(false); 
      setGraficosAberto(false); 
      setHistoricoAberto(false); 
      setRelatoriosAberto(false); 
      setRelatorioGeralAberto(false); 
      setRelatorioManutencaoAberto(false); 
      setRelatorioMovimentacaoAberto(false); 
      setRelatorioHistoricoAberto(false); 
      setMenuAberto(false); 
    }} 
  > 
    <span>-</span> 
    <span>Usuários</span> 
  </button>
)}

<button
  className="item-menu"
  type="button"
  onClick={() => {
    setHistoricoAberto(true);
    setUsuariosAberto(false);
    setDashboardAberto(false);
    setGraficosAberto(false);
    setRelatoriosAberto(false);
    setRelatorioGeralAberto(false);
    setRelatorioManutencaoAberto(false);
    setRelatorioMovimentacaoAberto(false);
    setRelatorioHistoricoAberto(false);
    setMenuAberto(false);
  }}
>
  <span>-</span>
  <span>Histórico de equipamentos</span>
</button>

    <button
  className="item-menu"
  type="button"
  onClick={() => {
    setRelatoriosAberto(true);
    setDashboardAberto(false);
    setGraficosAberto(false);
    setHistoricoAberto(false);
    setUsuariosAberto(false);
    setRelatorioGeralAberto(false);
    setRelatorioManutencaoAberto(false);
    setRelatorioMovimentacaoAberto(false);
    setRelatorioHistoricoAberto(false);
    setMenuAberto(false);
  }}
>
  <span>-</span>
  <span>Relatórios</span>
</button>

<button
  onClick={() => {
    localStorage.removeItem("usuarioLogado");

    setUsuarioLogado(null);
    setEmailLogin("");
    setSenhaLogin("");
    setLogado(false);
    setMenuAberto(false);
  }}
>
  Sair
</button>

    </aside>
  </>
)}


 <main>

  {cadastroAberto && (
  <section className="dashboard">

    <div className="dashboard-cabecalho">
      <div>
        <h2>Cadastro de usuários</h2>
        <p>Gerenciamento dos usuários do sistema</p>
      </div>

      <button
        className="botao-voltar-inventario"
        type="button"
        onClick={() => setCadastroAberto(false)}
      >
        Voltar
      </button>
    </div>

    <div className="bloco-dashboard">
      <h3>Cadastro de usuário</h3>

      <form className="formulario-equipamento">

        <label>
          Nome
          <input
            type="text"
            value={nomeUsuario}
            onChange={(event) => setNomeUsuario(event.target.value)}
            placeholder="Digite o nome do usuário"
          />
        </label>

        <label>
          Setor
          <input
            type="text"
            value={setorUsuario}
            onChange={(event) => setSetorUsuario(event.target.value)}
            placeholder="Digite o setor"
          />
        </label>

        <label>
          E-mail corporativo
          <input
            type="email"
            value={emailUsuario}
            onChange={(event) => setEmailUsuario(event.target.value)}
            placeholder="Digite o e-mail corporativo"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senhaUsuario}
            onChange={(event) => setSenhaUsuario(event.target.value)}
            placeholder="Digite a senha"
          />
        </label>

        <label>
          Perfil
          <select
            value={perfilUsuario}
            onChange={(event) => setPerfilUsuario(event.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Administrador">Administrador</option>
            <option value="Consulta">Consulta</option>
          </select>
        </label>

        <button
  className="botao-adicionar"
  type="button"
  onClick={() => {
  if (usuarioEditando) {
    const usuariosAtualizados = usuarios.map((usuario) =>
      usuario.id === usuarioEditando.id
        ? {
            ...usuario,
            nome: nomeUsuario,
            setor: setorUsuario,
            email: emailUsuario,
            senha: senhaUsuario,
            perfil: perfilUsuario,
          }
        : usuario
    );

    setUsuarios(usuariosAtualizados);

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuariosAtualizados)
    );

    setUsuarioEditando(null);
  } else {
    const usuariosSalvos = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    const novoUsuario = {
      id: Date.now(),
      nome: nomeUsuario,
      setor: setorUsuario,
      email: emailUsuario,
      senha: senhaUsuario,
      perfil: perfilUsuario,
    };

    usuariosSalvos.push(novoUsuario);

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuariosSalvos)
    );
  }

  setNomeUsuario("");
  setSetorUsuario("");
  setEmailUsuario("");
  setSenhaUsuario("");
  setPerfilUsuario("");
}}
>
  {usuarioEditando ? "Salvar alterações" : "Cadastrar usuário"}
</button>

      </form>
    </div>

  </section>
)}

{usuariosAberto && (
  <section className="dashboard">

    <div className="dashboard-cabecalho">
      <div>
        <h2>Usuários</h2>
        <p>Controle dos usuários cadastrados no sistema</p>
      </div>

      <button
  className="botao-voltar-inventario"
  type="button"
  onClick={() => {
    setUsuariosAberto(false);

    if (telaAnterior === "dashboard") {
      setDashboardAberto(true);
    } else if (telaAnterior === "graficos") {
      setGraficosAberto(true);
    } else if (telaAnterior === "cadastro") {
      setCadastroAberto(true);
    } else if (telaAnterior === "historico") {
      setHistoricoAberto(true);
    } else if (telaAnterior === "relatorios") {
      setRelatoriosAberto(true);
    }
  }}
>
  Voltar
</button>
    </div>

    <div className="bloco-dashboard">
  <h3>Usuários cadastrados</h3>

  <div style={{ overflowX: "hidden" }}>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Setor</th>
          <th>E-mail corporativo</th>
          <th>Perfil</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id}>
            <td>{usuario.nome}</td>
            <td>{usuario.setor}</td>
            <td>{usuario.email}</td>
            <td>{usuario.perfil}</td>

            {usuarioLogado?.perfil === "Administrador" && (
  <td>
    <button
      className="botao-editar"
      type="button"
      onClick={() => {
        setUsuarioEditando(usuario);
        setNomeUsuario(usuario.nome);
        setSetorUsuario(usuario.setor);
        setEmailUsuario(usuario.email);
        setSenhaUsuario(usuario.senha);
        setPerfilUsuario(usuario.perfil);
        setUsuariosAberto(false);
        setCadastroAberto(true);
      }}
    >
      ✏️ Editar
    </button>

    <button
      className="botao-excluir"
      type="button"
      onClick={() => {
        const confirmar = window.confirm(
          `Deseja excluir o usuário "${usuario.nome}"?`
        );

        if (!confirmar) {
          return;
        }

        const usuariosAtualizados = usuarios.filter(
          (item) => item.id !== usuario.id
        );

        setUsuarios(usuariosAtualizados);

        localStorage.setItem(
          "usuarios",
          JSON.stringify(usuariosAtualizados)
        );
      }}
    >
      🗑️ Excluir
    </button>
  </td>
)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  </section>
)}

{historicoAberto && (
  <section className="dashboard">

    <div className="dashboard-cabecalho">
      <div>
        <h1>Histórico de equipamentos</h1>
        <p>Acompanhe o histórico e as movimentações dos equipamentos.</p>
      </div>

      <button
  className="botao-voltar"
  type="button"
  onClick={() => {
    setHistoricoAberto(false);
    setLocalSelecionado(null);
    setEquipamentoSelecionado(null);
  }}
>
  ← Voltar
</button>
    </div>

{!equipamentoSelecionado && (
    <div className="dashboard-cards">
      {quantidadePorLocalizacao.map((item) => (
        <div
          className="card-dashboard"
          key={item.localizacao}
          onClick={() => setLocalSelecionado(item.localizacao)}
        >
          <h3>{item.localizacao}</h3>
          <strong>{item.quantidade}</strong>
          <p>equipamentos</p>
        </div>
      ))}
    </div>
)}

   {localSelecionado && !equipamentoSelecionado && (
      <div className="bloco-dashboard">
        <h2>{localSelecionado}</h2>
        <p>Equipamentos cadastrados nesta localização.</p>

        {equipamentosDoLocal.length === 0 ? (
          <p>Nenhum equipamento cadastrado nesta localização.</p>
        ) : (
          <div className="tabela-container">
            <table border="1">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Fabricante</th>
                  <th>Modelo</th>
                  <th>Número de série</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th>Setor</th>
                </tr>
              </thead>

              <tbody>
                {equipamentosDoLocal.map((equipamento, index) => (
                  <tr
                    key={index}
                    onClick={() => setEquipamentoSelecionado(equipamento)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{equipamento.tipo}</td>
                    <td>{equipamento.fabricante}</td>
                    <td>{equipamento.modelo}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}

    {equipamentoSelecionado && (
      <div className="bloco-dashboard">
        <h2>Equipamento selecionado</h2>

        <p>
          {equipamentoSelecionado.tipo} —{" "}
          {equipamentoSelecionado.fabricante}{" "}
          {equipamentoSelecionado.modelo}
        </p>

      
<div className="tabela-container tabela-ficha">
  <table border="1">
    <tbody>
      <tr>
        <th>Tipo</th>
        <td>{equipamentoSelecionado.tipo}</td>
      </tr>

      <tr>
        <th>Fabricante</th>
        <td>{equipamentoSelecionado.fabricante}</td>
      </tr>

      <tr>
        <th>Modelo</th>
        <td>{equipamentoSelecionado.modelo}</td>
      </tr>

      <tr>
        <th>Marca</th>
        <td>{equipamentoSelecionado.marca}</td>
      </tr>

      <tr>
        <th>Número de série</th>
        <td>{equipamentoSelecionado.numeroSerie}</td>
      </tr>

      <tr>
        <th>Status</th>
        <td>
          <span
            className={
              equipamentoSelecionado.status === "Disponível"
                ? "status status-disponivel"
                : equipamentoSelecionado.status === "Em uso"
                ? "status status-em-uso"
                : "status status-manutencao"
            }
          >
            {equipamentoSelecionado.status}
          </span>
        </td>
      </tr>

      <tr>
        <th>Responsável</th>
        <td>{equipamentoSelecionado.responsavel}</td>
      </tr>

      <tr>
        <th>Setor</th>
        <td>{equipamentoSelecionado.setor}</td>
      </tr>

      <tr>
        <th>Localização</th>
        <td>{equipamentoSelecionado.localizacao}</td>
      </tr>
    </tbody>
  </table>
</div>

<div className="bloco-historico">
  <h2>Histórico do equipamento</h2>

  {equipamentoSelecionado.historico &&
  equipamentoSelecionado.historico.length > 0 ? (
    <div className="lista-historico">
      {equipamentoSelecionado.historico.map((evento, index) => (
  <div
  className={`item-historico ${
    evento.tipo === "Manutenção" ? "item-manutencao" : ""
  }`}
  key={index}
>
  <strong>{evento.tipo}</strong>

 <span>
  {new Date(evento.data).toLocaleString("pt-BR")}
</span>

{evento.dataConclusao && (
  <span>
    Conclusão:{" "}
    {new Date(evento.dataConclusao).toLocaleString("pt-BR")}
  </span>
)}

<p style={{ whiteSpace: "pre-line" }}>{evento.descricao}</p>

{evento.motivo && (
  <span>
    Motivo: {evento.motivo}
  </span>
)}

{evento.situacaoManutencao && (
  <span>
    Situação: {evento.situacaoManutencao}
  </span>
)}

{evento.observacao && (
  <span>
    Observação: {evento.observacao}
  </span>
)}

{evento.localizacao && (
  <span>
    Localização: {evento.localizacao}
  </span>
)}

{evento.responsavel && (
  <span>
    Responsável: {evento.responsavel}
  </span>
)}

{evento.status && (
  <span>
    Status: {evento.status}
  </span>
)}
</div>
      ))}
    </div>
  ) : (
    <p>Nenhum histórico registrado.</p>
  )}
</div>

<button
  className="botao-voltar-inventario"
  type="button"
  onClick={() => setEquipamentoSelecionado(null)}
>
  ← Voltar para {localSelecionado}
</button>
      </div>
    )}

  </section>
)}

{relatoriosAberto && (
  <section className="dashboard">

    <div className="dashboard-cabecalho">
      <div>
        <h2>Relatórios</h2>
        <p>Consulte e gere relatórios do Inventário TI</p>
      </div>

      <button
        className="botao-voltar-inventario"
        type="button"
        onClick={() => setRelatoriosAberto(false)}
      >
        Voltar
      </button>
    </div>

    <div className="bloco-dashboard">
  <h3>Relatórios do Inventário</h3>

  <p>
    Selecione o relatório que deseja consultar.
  </p>

  <div className="opcoes-relatorios">

  <button
    type="button"
    className="opcao-relatorio"
    onClick={() => {
      setRelatorioGeralAberto(true);
      setRelatoriosAberto(false);
    }}
  >
    <span>📋</span>
    <strong>Relatório Geral</strong>
    <small>Visão geral dos equipamentos cadastrados</small>
  </button>

  <button
    type="button"
    className="opcao-relatorio"
    onClick={() => {
      setRelatorioManutencaoAberto(true);
      setRelatoriosAberto(false);
    }}
  >
    <span>🔧</span>
    <strong>Relatório de Manutenções</strong>
    <small>Equipamentos enviados para manutenção</small>
  </button>

  <button
    type="button"
    className="opcao-relatorio"
    onClick={() => {
      setRelatorioMovimentacaoAberto(true);
      setRelatoriosAberto(false);
    }}
  >
    <span>🔄</span>
    <strong>Relatório de Movimentações</strong>
    <small>Histórico de movimentações dos equipamentos</small>
  </button>

  <button
    type="button"
    className="opcao-relatorio"
    onClick={() => {
      setRelatorioHistoricoAberto(true);
      setRelatoriosAberto(false);
    }}
  >
    <span>📜</span>
    <strong>Relatório de Histórico</strong>
    <small>Histórico completo dos equipamentos</small>
  </button>

</div>
</div>

  </section>
)}

{relatorioGeralAberto && (
  <section className="dashboard">

    <div className="dashboard-cabecalho">
      <div>
        <h2>Relatório Geral</h2>
        <p>Visão geral dos equipamentos cadastrados</p>
      </div>

      <button
        className="botao-voltar-inventario"
        type="button"
        onClick={() => {
          setRelatorioGeralAberto(false);
          setRelatoriosAberto(true);
        }}
      >
        Voltar
      </button>
    </div>

    <div className="bloco-dashboard">
  <h3>Equipamentos</h3>

  <div className="filtros-relatorio">

  <div className="campo-filtro">
    <label>Equipamento</label>

    <select
      value={filtroRelatorioGeralEquipamento}
      onChange={(e) =>
        setFiltroRelatorioGeralEquipamento(e.target.value)
      }
    >
      <option value="">Todos os equipamentos</option>

      {equipamentos.map((equipamento, index) => (
        <option
          key={`${equipamento.numeroSerie}-${index}`}
          value={equipamento.numeroSerie}
        >
          {equipamento.fabricante} {equipamento.modelo} - {equipamento.numeroSerie}
        </option>
      ))}
    </select>
  </div>

  <div className="campo-filtro">
    <label>Tipo</label>

    <select
      value={filtroRelatorioGeralTipo}
      onChange={(e) =>
        setFiltroRelatorioGeralTipo(e.target.value)
      }
    >
      <option value="">Todos os tipos</option>

      <option value="Notebook">Notebook</option>
      <option value="Desktop">Desktop</option>
      <option value="Monitor">Monitor</option>
      <option value="Celular">Celular</option>
      <option value="Tablet">Tablet</option>
    </select>
  </div>

  <div className="campo-filtro">
    <label>Status</label>

    <select
      value={filtroRelatorioGeralStatus}
      onChange={(e) =>
        setFiltroRelatorioGeralStatus(e.target.value)
      }
    >
      <option value="">Todos os status</option>

      <option value="Disponível">Disponível</option>
      <option value="Em uso">Em uso</option>
      <option value="Manutenção">Manutenção</option>
    </select>
  </div>

  <div className="campo-filtro">
    <label>Responsável</label>

    <select
      value={filtroRelatorioGeralResponsavel}
      onChange={(e) =>
        setFiltroRelatorioGeralResponsavel(e.target.value)
      }
    >
      <option value="">Todos os responsáveis</option>

      {[...new Set(
        equipamentos
          .map((equipamento) => equipamento.responsavel)
          .filter((responsavel) => responsavel)
      )].map((responsavel) => (
        <option
          key={responsavel}
          value={responsavel}
        >
          {responsavel}
        </option>
      ))}
    </select>
  </div>

  <div className="campo-filtro">
  <label>Setor</label>

  <select
    value={filtroRelatorioGeralSetor}
    onChange={(e) =>
      setFiltroRelatorioGeralSetor(e.target.value)
    }
  >
    <option value="">Todos os setores</option>

    {[...new Set(
      equipamentos
        .map((equipamento) => equipamento.setor)
        .filter((setor) => setor)
    )].map((setor) => (
      <option
        key={setor}
        value={setor}
      >
        {setor}
      </option>
    ))}
  </select>
</div>

<div className="campo-filtro">
  <label>Localização</label>

  <select
    value={filtroRelatorioGeralLocalizacao}
    onChange={(e) =>
      setFiltroRelatorioGeralLocalizacao(e.target.value)
    }
  >
    <option value="">Todas as localizações</option>

    {[...new Set(
      equipamentos
        .map((equipamento) => equipamento.localizacao)
        .filter((localizacao) => localizacao)
    )].map((localizacao) => (
      <option
        key={localizacao}
        value={localizacao}
      >
        {localizacao}
      </option>
    ))}
  </select>
</div>

<div className="campo-filtro">
  <label>Data inicial</label>

  <input
    type="date"
    value={filtroRelatorioGeralDataInicial}
    onChange={(e) =>
      setFiltroRelatorioGeralDataInicial(e.target.value)
    }
  />
</div>

<div className="campo-filtro">
  <label>Data final</label>

  <input
    type="date"
    value={filtroRelatorioGeralDataFinal}
    onChange={(e) =>
      setFiltroRelatorioGeralDataFinal(e.target.value)
    }
  />
</div>

<div className="campo-filtro">
  <label>Idade do equipamento</label>

  <select
    value={filtroRelatorioGeralIdadeEquipamento}
    onChange={(e) =>
      setFiltroRelatorioGeralIdadeEquipamento(e.target.value)
    }
  >
    <option value="">Todos</option>
    <option value="ate5">Até 5 anos</option>
    <option value="mais5">Mais de 5 anos</option>
  </select>
</div>

</div>

  <button
    className="botao-salvar"
    type="button"
    onClick={() => {
      const equipamentosRelatorio = equipamentos
        .filter((equipamento) => {
          if (
            filtroRelatorioGeralBusca !== "" &&
            !`${equipamento.fabricante || ""} ${equipamento.modelo || ""} ${equipamento.numeroSerie || ""}`
              .toLowerCase()
              .includes(filtroRelatorioGeralBusca.toLowerCase())
          ) {
            return false;
          }

          if (
            filtroRelatorioGeralTipo !== "" &&
            equipamento.tipo !== filtroRelatorioGeralTipo
          ) {
            return false;
          }

          if (
            filtroRelatorioGeralLocalizacao !== "" &&
            equipamento.localizacao !== filtroRelatorioGeralLocalizacao
          ) {
            return false;
          }

          if (
            filtroRelatorioGeralStatus !== "" &&
            equipamento.status !== filtroRelatorioGeralStatus
          ) {
            return false;
          }

          return true;
        })
        .map((equipamento) => ({
          Tipo: equipamento.tipo || "-",
          Fabricante: equipamento.fabricante || "-",
          Modelo: equipamento.modelo || "-",
          Marca: equipamento.marca || "-",
          "Número de série": equipamento.numeroSerie || "-",
          "Data de fabricação": equipamento.dataFabricacao || "-",
          Idade: equipamento.dataFabricacao
            ? `${new Date().getFullYear() - new Date(equipamento.dataFabricacao).getFullYear()} anos`
            : "-",
          Status: equipamento.status || "-",
          Responsável: equipamento.responsavel || "-",
          Setor: equipamento.setor || "-",
          Localização: equipamento.localizacao || "-",
        }));

      if (equipamentosRelatorio.length === 0) {
        alert("Não há equipamentos para exportar.");
        return;
      }

      exportarCSV(
        equipamentosRelatorio,
        "relatorio-geral"
      );
    }}
  >
    📥 Exportar CSV
  </button>

  <button
  className="botao-salvar"
  type="button"
  onClick={() => {
    const equipamentosRelatorio = equipamentos
      .filter((equipamento) =>
        filtroRelatorioGeralEquipamento === ""
          ? true
          : equipamento.numeroSerie === filtroRelatorioGeralEquipamento
      )
      .filter((equipamento) =>
        filtroRelatorioGeralTipo === ""
          ? true
          : equipamento.tipo === filtroRelatorioGeralTipo
      )
      .filter((equipamento) =>
        filtroRelatorioGeralStatus === ""
          ? true
          : equipamento.status === filtroRelatorioGeralStatus
      )
      .filter((equipamento) =>
        filtroRelatorioGeralResponsavel === ""
          ? true
          : equipamento.responsavel === filtroRelatorioGeralResponsavel
      )
      .filter((equipamento) =>
        filtroRelatorioGeralSetor === ""
          ? true
          : equipamento.setor === filtroRelatorioGeralSetor
      )
      .filter((equipamento) =>
        filtroRelatorioGeralLocalizacao === ""
          ? true
          : equipamento.localizacao === filtroRelatorioGeralLocalizacao
      )
      .filter((equipamento) => {
        if (
          filtroRelatorioGeralDataInicial === "" &&
          filtroRelatorioGeralDataFinal === ""
        ) {
          return true;
        }

        const eventoCadastro = (equipamento.historico || []).find(
          (evento) => evento.tipo === "Cadastro"
        );

        if (!eventoCadastro || !eventoCadastro.data) {
          return false;
        }

        const dataCadastro = new Date(eventoCadastro.data);

        if (filtroRelatorioGeralDataInicial !== "") {
          const dataInicial = new Date(
            `${filtroRelatorioGeralDataInicial}T00:00:00`
          );

          if (dataCadastro < dataInicial) {
            return false;
          }
        }

        if (filtroRelatorioGeralDataFinal !== "") {
          const dataFinal = new Date(
            `${filtroRelatorioGeralDataFinal}T23:59:59`
          );

          if (dataCadastro > dataFinal) {
            return false;
          }
        }

        return true;
      })
      .filter((equipamento) => {
        if (filtroRelatorioGeralIdadeEquipamento === "") {
          return true;
        }

        if (filtroRelatorioGeralIdadeEquipamento === "mais5") {
          return equipamentoComMaisDeCincoAnos(
            equipamento.dataFabricacao
          );
        }

        if (filtroRelatorioGeralIdadeEquipamento === "ate5") {
          return !equipamentoComMaisDeCincoAnos(
            equipamento.dataFabricacao
          );
        }

        return true;
      })
      .map((equipamento) => ({
        Tipo: equipamento.tipo || "-",
        Fabricante: equipamento.fabricante || "-",
        Modelo: equipamento.modelo || "-",
        Marca: equipamento.marca || "-",
        "Número de série": equipamento.numeroSerie || "-",
        "Data de fabricação": equipamento.dataFabricacao || "-",
        Idade:
          calcularIdadeEquipamento(equipamento.dataFabricacao) !== null
            ? `${calcularIdadeEquipamento(equipamento.dataFabricacao)} anos`
            : "-",
        Status: equipamento.status || "-",
        Responsável: equipamento.responsavel || "-",
        Setor: equipamento.setor || "-",
        Localização: equipamento.localizacao || "-",
      }));

    if (equipamentosRelatorio.length === 0) {
      alert("Não há equipamentos para exportar.");
      return;
    }

    exportarExcel(
      equipamentosRelatorio,
      "relatorio-geral"
    );
  }}
>
  📊 Exportar Excel
</button>

  <div className="tabela-dashboard">
    <table>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Fabricante</th>
          <th>Modelo</th>
          <th>Marca</th>
          <th>Número de série</th>
          <th>Data de fabricação</th>
          <th>Idade</th>
          <th>Status</th>
          <th>Responsável</th>
          <th>Setor</th>
          <th>Localização</th>
        </tr>
      </thead>

      <tbody>
  {equipamentos
    .filter((equipamento) =>
      filtroRelatorioGeralEquipamento === ""
        ? true
        : equipamento.numeroSerie === filtroRelatorioGeralEquipamento
    )
    .filter((equipamento) =>
      filtroRelatorioGeralTipo === ""
        ? true
        : equipamento.tipo === filtroRelatorioGeralTipo
    )
    .filter((equipamento) =>
      filtroRelatorioGeralStatus === ""
        ? true
        : equipamento.status === filtroRelatorioGeralStatus
    )
    .filter((equipamento) =>
      filtroRelatorioGeralResponsavel === ""
        ? true
        : equipamento.responsavel === filtroRelatorioGeralResponsavel
    )
    .filter((equipamento) =>
      filtroRelatorioGeralSetor === ""
        ? true
        : equipamento.setor === filtroRelatorioGeralSetor
    )
    .filter((equipamento) =>
  filtroRelatorioGeralLocalizacao === ""
    ? true
    : equipamento.localizacao === filtroRelatorioGeralLocalizacao
)
.filter((equipamento) => {
  if (
    filtroRelatorioGeralDataInicial === "" &&
    filtroRelatorioGeralDataFinal === ""
  ) {
    return true;
  }

  const eventoCadastro = (equipamento.historico || []).find(
    (evento) => evento.tipo === "Cadastro"
  );

  if (!eventoCadastro || !eventoCadastro.data) {
    return false;
  }

  const dataCadastro = new Date(eventoCadastro.data);

  if (filtroRelatorioGeralDataInicial !== "") {
    const dataInicial = new Date(
      `${filtroRelatorioGeralDataInicial}T00:00:00`
    );

    if (dataCadastro < dataInicial) {
      return false;
    }
  }

  if (filtroRelatorioGeralDataFinal !== "") {
    const dataFinal = new Date(
      `${filtroRelatorioGeralDataFinal}T23:59:59`
    );

    if (dataCadastro > dataFinal) {
      return false;
    }
  }

  return true;
})
.filter((equipamento) => {
  if (filtroRelatorioGeralIdadeEquipamento === "") {
    return true;
  }

  if (filtroRelatorioGeralIdadeEquipamento === "mais5") {
    return equipamentoComMaisDeCincoAnos(
      equipamento.dataFabricacao
    );
  }

  if (filtroRelatorioGeralIdadeEquipamento === "ate5") {
    return !equipamentoComMaisDeCincoAnos(
      equipamento.dataFabricacao
    );
  }

  return true;
})
.map((equipamento, index) => (
      <tr key={`${equipamento.numeroSerie}-${index}`}>
        <td>{equipamento.tipo || "-"}</td>
        <td>{equipamento.fabricante || "-"}</td>
        <td>{equipamento.modelo || "-"}</td>
       <td>{equipamento.marca || "-"}</td>
<td>{equipamento.numeroSerie || "-"}</td>

<td>
  {equipamento.dataFabricacao
    ? equipamento.dataFabricacao.split("-").reverse().join("/")
    : "-"}

  {equipamentoComMaisDeCincoAnos(equipamento.dataFabricacao) && (
    <span
      style={{
        display: "block",
        color: "#ef4444",
        fontWeight: "600",
        marginTop: "4px",
      }}
    >
      ⚠️ Mais de 5 anos
    </span>
  )}
</td>

<td>
  {calcularIdadeEquipamento(equipamento.dataFabricacao) !== null
    ? `${calcularIdadeEquipamento(equipamento.dataFabricacao)} anos`
    : "-"}
</td>

<td>{equipamento.status || "-"}</td>
<td>{equipamento.responsavel || "-"}</td>
        <td>{equipamento.setor || "-"}</td>
        <td>{equipamento.localizacao || "-"}</td>
      </tr>
    ))}
</tbody>
    </table>
  </div>
</div>

  </section>
)}

{relatorioManutencaoAberto && (
  <section className="dashboard">

  
        <div className="dashboard-cabecalho">
  <div>
    <h2>Relatório de Manutenções</h2>
    <p>Equipamentos enviados para manutenção</p>
  </div>

  <button
    className="botao-voltar-inventario"
    type="button"
    onClick={() => {
      setRelatorioManutencaoAberto(false);
      setRelatoriosAberto(true);
    }}
  >
    Voltar
  </button>
</div>

<div className="bloco-dashboard">
  <h3>Manutenções</h3>

  <div className="campo-filtro">
    <label>Situação da manutenção</label>

    <select
      value={filtroRelatorioManutencaoSituacao}
      onChange={(event) =>
        setFiltroRelatorioManutencaoSituacao(event.target.value)
      }
    >
      <option value="">Todas</option>
      <option value="Em andamento">Em andamento</option>
      <option value="Concluída">Concluída</option>
    </select>
  </div>

  <button
  className="botao-salvar"
  type="button"
  onClick={() => {
    const manutencoesRelatorio = equipamentos.flatMap((equipamento) =>
      (equipamento.historico || [])
        .filter((evento) => {
          if (evento.tipo !== "Manutenção") {
            return false;
          }

          if (filtroRelatorioManutencaoSituacao === "") {
            return true;
          }

          return (
            evento.situacaoManutencao ===
            filtroRelatorioManutencaoSituacao
          );
        })
        .map((evento) => ({
          Equipamento:
            `${equipamento.fabricante || ""} ${equipamento.modelo || ""}`.trim() || "-",

          "Número de série":
            equipamento.numeroSerie || "-",

          Responsável:
            equipamento.responsavel || "-",

          "Data/hora de entrada":
            evento.data
              ? new Date(evento.data).toLocaleString("pt-BR")
              : "-",

          Motivo:
            evento.motivo || "-",

          Situação:
            evento.situacaoManutencao || "-",

          "Data/hora de conclusão":
            evento.dataConclusao
              ? new Date(evento.dataConclusao).toLocaleString("pt-BR")
              : "-",

          Observação:
            evento.observacao || "-",
        }))
    );

    if (manutencoesRelatorio.length === 0) {
      alert("Não há manutenções para exportar.");
      return;
    }

    exportarCSV(
      manutencoesRelatorio,
      "relatorio-manutencoes"
    );
  }}
>
  📥 Exportar CSV
</button>

<button
  className="botao-salvar"
  type="button"
  onClick={() => {
    const manutencoesRelatorio = equipamentos.flatMap((equipamento) =>
      (equipamento.historico || [])
        .filter((evento) => {
          if (evento.tipo !== "Manutenção") {
            return false;
          }

          if (filtroRelatorioManutencaoSituacao === "") {
            return true;
          }

          return (
            evento.situacaoManutencao ===
            filtroRelatorioManutencaoSituacao
          );
        })
        .map((evento) => ({
          Equipamento:
            `${equipamento.fabricante || ""} ${equipamento.modelo || ""}`.trim() || "-",

          "Número de série":
            equipamento.numeroSerie || "-",

          Responsável:
            equipamento.responsavel || "-",

          "Data/hora de entrada":
            evento.data
              ? new Date(evento.data).toLocaleString("pt-BR")
              : "-",

          Motivo:
            evento.motivo || "-",

          Situação:
            evento.situacaoManutencao || "-",

          "Data/hora de conclusão":
            evento.dataConclusao
              ? new Date(evento.dataConclusao).toLocaleString("pt-BR")
              : "-",

          Observação:
            evento.observacao || "-",
        }))
    );

    if (manutencoesRelatorio.length === 0) {
      alert("Não há manutenções para exportar.");
      return;
    }

    exportarExcel(
      manutencoesRelatorio,
      "relatorio-manutencoes"
    );
  }}
>
  📊 Exportar Excel
</button>

  <div className="tabela-dashboard">
    <table>
      <thead>
        <tr>
          <th>Equipamento</th>
          <th>Número de série</th>
          <th>Responsável</th>
          <th>Data/hora de entrada</th>
          <th>Motivo</th>
          <th>Situação</th>
          <th>Data/hora de conclusão</th>
          <th>Observação</th>
        </tr>
      </thead>

          <tbody>
            {equipamentos.flatMap((equipamento) =>
  (equipamento.historico || [])
    .filter((evento) => {
      if (evento.tipo !== "Manutenção") {
        return false;
      }

      if (filtroRelatorioManutencaoSituacao === "") {
        return true;
      }

      return (
        evento.situacaoManutencao ===
        filtroRelatorioManutencaoSituacao
      );
    })
    .map((evento, index) => (
      <tr
        key={`${equipamento.numeroSerie}-manutencao-${index}`}
      >
                    <td>
                      {equipamento.fabricante} {equipamento.modelo}
                    </td>

                    <td>
                      {equipamento.numeroSerie}
                    </td>

                    <td>
                      {equipamento.responsavel || "-"}
                    </td>

                    <td>
                      {evento.data
                        ? new Date(evento.data).toLocaleString("pt-BR")
                        : "-"}
                    </td>

                    <td>
                      {evento.motivo || "-"}
                    </td>

                    <td>
                      {evento.situacaoManutencao || "-"}
                    </td>

                    <td>
                      {evento.dataConclusao
                        ? new Date(evento.dataConclusao).toLocaleString("pt-BR")
                        : "-"}
                    </td>

                    <td>
                      {evento.observacao || "-"}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>

  </section>
)}

{relatorioMovimentacaoAberto && (
  <section className="dashboard">

    <div className="dashboard-cabecalho">
      <div>
        <h2>Relatório de Movimentações</h2>
        <p>Histórico de movimentações dos equipamentos</p>
      </div>

      <button
        className="botao-voltar-inventario"
        type="button"
        onClick={() => {
          setRelatorioMovimentacaoAberto(false);
          setRelatoriosAberto(true);
        }}
      >
        Voltar
      </button>
    </div>

    <div className="bloco-dashboard">
  <h3>Movimentações</h3>

  <div className="filtros-relatorio">
    <div className="campo-filtro">
  <label>Responsável</label>

  <select
    value={filtroMovimentacaoResponsavel}
    onChange={(event) =>
      setFiltroMovimentacaoResponsavel(event.target.value)
    }
  >
    <option value="">Todos</option>

    {responsaveisMovimentacao.map((responsavel) => (
      <option key={responsavel} value={responsavel}>
        {responsavel}
      </option>
    ))}
  </select>
</div>

    <div className="campo-filtro">
  <label>Setor</label>

  <select
    value={filtroMovimentacaoSetor}
    onChange={(event) =>
      setFiltroMovimentacaoSetor(event.target.value)
    }
  >
    <option value="">Todos</option>

    {setoresMovimentacao.map((setor) => (
      <option key={setor} value={setor}>
        {setor}
      </option>
    ))}
  </select>
</div>

    <div className="campo-filtro">
  <label>Shopping</label>

  <select
    value={filtroMovimentacaoShopping}
    onChange={(event) =>
      setFiltroMovimentacaoShopping(event.target.value)
    }
  >
    <option value="">Todos</option>

    {shoppingsMovimentacao.map((shopping) => (
      <option key={shopping} value={shopping}>
        {shopping}
      </option>
    ))}
  </select>
</div>

    <div className="campo-filtro">
      <label>Data inicial</label>
      <input
        type="date"
        value={filtroMovimentacaoDataInicial}
        onChange={(event) =>
          setFiltroMovimentacaoDataInicial(event.target.value)
        }
      />
    </div>

    <div className="campo-filtro">
      <label>Data final</label>
      <input
        type="date"
        value={filtroMovimentacaoDataFinal}
        onChange={(event) =>
          setFiltroMovimentacaoDataFinal(event.target.value)
        }
      />
    </div>
  </div>

  <button
    className="botao-salvar"
    type="button"
    onClick={() => {
      const movimentacoesRelatorio = equipamentos.flatMap((equipamento) =>
        (equipamento.historico || [])
          .filter((evento) => {
            if (evento.tipo !== "Movimentação") {
              return false;
            }

            if (filtroMovimentacaoResponsavel !== "") {
              if (
                evento.responsavelAnterior !== filtroMovimentacaoResponsavel &&
                evento.responsavelNovo !== filtroMovimentacaoResponsavel
              ) {
                return false;
              }
            }

            if (filtroMovimentacaoSetor !== "") {
              if (
                evento.setorAnterior !== filtroMovimentacaoSetor &&
                evento.setorNovo !== filtroMovimentacaoSetor
              ) {
                return false;
              }
            }

            if (filtroMovimentacaoShopping !== "") {
              if (
                evento.origem !== filtroMovimentacaoShopping &&
                evento.destino !== filtroMovimentacaoShopping
              ) {
                return false;
              }
            }

            if (filtroMovimentacaoDataInicial !== "") {
              const dataMovimentacao = new Date(evento.data);

              const dataInicial = new Date(
                `${filtroMovimentacaoDataInicial}T00:00:00`
              );

              if (dataMovimentacao < dataInicial) {
                return false;
              }
            }

            if (filtroMovimentacaoDataFinal !== "") {
              const dataMovimentacao = new Date(evento.data);

              const dataFinal = new Date(
                `${filtroMovimentacaoDataFinal}T23:59:59`
              );

              if (dataMovimentacao > dataFinal) {
                return false;
              }
            }

            return true;
          })
          .map((evento) => ({
            Equipamento:
              `${equipamento.fabricante || ""} ${equipamento.modelo || ""}`.trim() || "-",

            "Número de série":
              equipamento.numeroSerie || "-",

            Origem:
              evento.origem || "-",

            Destino:
              evento.destino || "-",

            "Responsável anterior":
              evento.responsavelAnterior || "-",

            "Novo responsável":
              evento.responsavelNovo || "-",

            "Setor anterior":
              evento.setorAnterior || "-",

            "Novo setor":
              evento.setorNovo || "-",

            "Data/hora":
              evento.data
                ? new Date(evento.data).toLocaleString("pt-BR")
                : "-",

            Observação:
              evento.observacao || "-",
          }))
      );

      if (movimentacoesRelatorio.length === 0) {
        alert("Não há movimentações para exportar.");
        return;
      }

      exportarCSV(
        movimentacoesRelatorio,
        "relatorio-movimentacoes"
      );
    }}
  >
    📥 Exportar CSV
  </button>

  <button
    className="botao-salvar"
    type="button"
    onClick={() => {
      const movimentacoesRelatorio = equipamentos.flatMap((equipamento) =>
        (equipamento.historico || [])
          .filter((evento) => {
            if (evento.tipo !== "Movimentação") {
              return false;
            }

            if (filtroMovimentacaoResponsavel !== "") {
              if (
                evento.responsavelAnterior !== filtroMovimentacaoResponsavel &&
                evento.responsavelNovo !== filtroMovimentacaoResponsavel
              ) {
                return false;
              }
            }

            if (filtroMovimentacaoSetor !== "") {
              if (
                evento.setorAnterior !== filtroMovimentacaoSetor &&
                evento.setorNovo !== filtroMovimentacaoSetor
              ) {
                return false;
              }
            }

            if (filtroMovimentacaoShopping !== "") {
              if (
                evento.origem !== filtroMovimentacaoShopping &&
                evento.destino !== filtroMovimentacaoShopping
              ) {
                return false;
              }
            }

            if (filtroMovimentacaoDataInicial !== "") {
              const dataMovimentacao = new Date(evento.data);

              const dataInicial = new Date(
                `${filtroMovimentacaoDataInicial}T00:00:00`
              );

              if (dataMovimentacao < dataInicial) {
                return false;
              }
            }

            if (filtroMovimentacaoDataFinal !== "") {
              const dataMovimentacao = new Date(evento.data);

              const dataFinal = new Date(
                `${filtroMovimentacaoDataFinal}T23:59:59`
              );

              if (dataMovimentacao > dataFinal) {
                return false;
              }
            }

            return true;
          })
          .map((evento) => ({
            Equipamento:
              `${equipamento.fabricante || ""} ${equipamento.modelo || ""}`.trim() || "-",

            "Número de série":
              equipamento.numeroSerie || "-",

            Origem:
              evento.origem || "-",

            Destino:
              evento.destino || "-",

            "Responsável anterior":
              evento.responsavelAnterior || "-",

            "Novo responsável":
              evento.responsavelNovo || "-",

            "Setor anterior":
              evento.setorAnterior || "-",

            "Novo setor":
              evento.setorNovo || "-",

            "Data/hora":
              evento.data
                ? new Date(evento.data).toLocaleString("pt-BR")
                : "-",

            Observação:
              evento.observacao || "-",
          }))
      );

      if (movimentacoesRelatorio.length === 0) {
        alert("Não há movimentações para exportar.");
        return;
      }

      exportarExcel(
        movimentacoesRelatorio,
        "relatorio-movimentacoes"
      );
    }}
  >
    📊 Exportar Excel
  </button>

  <div className="tabela-dashboard">
    <table>
          <thead>
  <tr>
    <th>Equipamento</th>
    <th>Número de série</th>
    <th>Origem</th>
    <th>Destino</th>
    <th>Responsável anterior</th>
    <th>Novo responsável</th>
    <th>Setor anterior</th>
    <th>Novo setor</th>
    <th>Data/hora</th>
    <th>Observação</th>
  </tr>
</thead>

          <tbody>
  {equipamentos.flatMap((equipamento) =>
    (equipamento.historico || [])
      .filter((evento) => {
        if (evento.tipo !== "Movimentação") {
          return false;
        }

        if (filtroMovimentacaoResponsavel !== "") {
          if (
            evento.responsavelAnterior !== filtroMovimentacaoResponsavel &&
            evento.responsavelNovo !== filtroMovimentacaoResponsavel
          ) {
            return false;
          }
        }

        if (filtroMovimentacaoSetor !== "") {
          if (
            evento.setorAnterior !== filtroMovimentacaoSetor &&
            evento.setorNovo !== filtroMovimentacaoSetor
          ) {
            return false;
          }
        }

        if (filtroMovimentacaoShopping !== "") {
  if (
    evento.origem !== filtroMovimentacaoShopping &&
    evento.destino !== filtroMovimentacaoShopping
  ) {
    return false;
  }
}

if (filtroMovimentacaoDataInicial !== "") {
  const dataMovimentacao = new Date(evento.data);
  const dataInicial = new Date(
    `${filtroMovimentacaoDataInicial}T00:00:00`
  );

  if (dataMovimentacao < dataInicial) {
    return false;
  }
}

if (filtroMovimentacaoDataFinal !== "") {
  const dataMovimentacao = new Date(evento.data);
  const dataFinal = new Date(
    `${filtroMovimentacaoDataFinal}T23:59:59`
  );

  if (dataMovimentacao > dataFinal) {
    return false;
  }
}

return true;
      })
      .map((evento, index) => (
        <tr
          key={`${equipamento.numeroSerie}-movimentacao-${index}`}
        >
                    <td>
                      {equipamento.fabricante} {equipamento.modelo}
                    </td>

                    <td>
                      {equipamento.numeroSerie}
                    </td>

                    <td>
                      {evento.origem || "-"}
                    </td>

                    <td>
  {evento.destino || "-"}
</td>

<td>
  {evento.responsavelAnterior || "-"}
</td>

<td>
  {evento.responsavelNovo || "-"}
</td>

<td>
  {evento.setorAnterior || "-"}
</td>

<td>
  {evento.setorNovo || "-"}
</td>

<td>
  {evento.data
    ? new Date(evento.data).toLocaleString("pt-BR")
    : "-"}
</td>

<td>
  {evento.observacao || "-"}
</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>

  </section>
)}

{relatorioHistoricoAberto && ( 
  <section className="dashboard"> 
 
    <div className="dashboard-cabecalho"> 
      <div> 
        <h2>Relatório de Histórico</h2> 
        <p>Histórico completo dos equipamentos</p> 
      </div> 
 
      <button 
        className="botao-voltar-inventario" 
        type="button" 
        onClick={() => { 
          setRelatorioHistoricoAberto(false); 
          setRelatoriosAberto(true); 
        }} 
      > 
        Voltar 
      </button> 
    </div> 
 
    <div className="bloco-dashboard"> 
      <h3>Histórico</h3> 
 
      <div className="filtros-relatorio"> 
        <div className="campo-filtro"> 
          <label>Tipo de evento</label> 
          <select 
            value={filtroHistoricoTipoEvento} 
            onChange={(event) => 
              setFiltroHistoricoTipoEvento(event.target.value) 
            } 
          > 
            <option value="">Todos</option> 
            <option value="Cadastro">Cadastro</option> 
            <option value="Movimentação">Movimentação</option> 
            <option value="Alteração">Alteração</option> 
            <option value="Manutenção">Manutenção</option> 
          </select> 
        </div> 

        <div className="campo-filtro"> 
          <label>Data/hora inicial</label> 
          <input 
            type="date" 
            value={filtroHistoricoDataInicial} 
            onChange={(event) => 
              setFiltroHistoricoDataInicial(event.target.value) 
            } 
          /> 
        </div> 

        <div className="campo-filtro"> 
          <label>Data/hora final</label> 
          <input 
            type="date" 
            value={filtroHistoricoDataFinal} 
            onChange={(event) => 
              setFiltroHistoricoDataFinal(event.target.value) 
            } 
          /> 
        </div> 
      </div> 

      <button
        className="botao-salvar"
        type="button"
        onClick={() => {
          const historicoRelatorio = historicoFiltrado.map((evento) => ({
            Equipamento:
              evento.equipamento || "-",

            "Número de série":
              evento.numeroSerie || "-",

            "Tipo de evento":
              evento.tipo || "-",

            Descrição:
              evento.descricao || "-",

            "Responsável anterior":
              evento.responsavelAnterior || "-",

            "Novo responsável":
              evento.responsavelNovo ||
              evento.responsavel ||
              "-",

            "Setor anterior":
              evento.setorAnterior || "-",

            "Novo setor":
              evento.setorNovo || "-",

            "Localização anterior":
              evento.origem || "-",

            "Nova localização":
              evento.destino ||
              evento.localizacao ||
              "-",

            "Data/Hora":
              evento.data
                ? new Date(evento.data).toLocaleString("pt-BR")
                : "-",

            Observação:
              evento.observacao || "-",
          }));

          if (historicoRelatorio.length === 0) {
            alert("Não há histórico para exportar.");
            return;
          }

          exportarCSV(
            historicoRelatorio,
            "relatorio-historico"
          );
        }}
      >
        📥 Exportar CSV
      </button>

      <button
        className="botao-salvar"
        type="button"
        onClick={() => {
          const historicoRelatorio = historicoFiltrado.map((evento) => ({
            Equipamento:
              evento.equipamento || "-",

            "Número de série":
              evento.numeroSerie || "-",

            "Tipo de evento":
              evento.tipo || "-",

            Descrição:
              evento.descricao || "-",

            "Responsável anterior":
              evento.responsavelAnterior || "-",

            "Novo responsável":
              evento.responsavelNovo ||
              evento.responsavel ||
              "-",

            "Setor anterior":
              evento.setorAnterior || "-",

            "Novo setor":
              evento.setorNovo || "-",

            "Localização anterior":
              evento.origem || "-",

            "Nova localização":
              evento.destino ||
              evento.localizacao ||
              "-",

            "Data/Hora":
              evento.data
                ? new Date(evento.data).toLocaleString("pt-BR")
                : "-",

            Observação:
              evento.observacao || "-",
          }));

          if (historicoRelatorio.length === 0) {
            alert("Não há histórico para exportar.");
            return;
          }

          exportarExcel(
            historicoRelatorio,
            "relatorio-historico"
          );
        }}
      >
        📊 Exportar Excel
      </button>

      <div
        className="tabela-dashboard"
        ref={tabelaHistoricoRef}
      >
        <table>
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>Número de série</th>
              <th>Tipo de evento</th>
              <th>Descrição</th>
              <th>Responsável anterior</th>
              <th>Novo responsável</th>
              <th>Setor anterior</th>
              <th>Novo setor</th>
              <th>Localização anterior</th>
              <th>Nova localização</th>
              <th>Data/Hora</th>
              <th>Observação</th>
            </tr>
          </thead>

          <tbody>
            {historicoFiltrado.map((evento, index) => (
              <tr
                key={`${evento.numeroSerie}-${evento.data}-${index}`}
              >
                <td>{evento.equipamento || "-"}</td>

                <td>{evento.numeroSerie || "-"}</td>

                <td>{evento.tipo || "-"}</td>

                <td style={{ whiteSpace: "pre-line" }}>
                  {evento.descricao || "-"}
                </td>

                <td>{evento.responsavelAnterior || "-"}</td>

                <td>
                  {evento.responsavelNovo ||
                    evento.responsavel ||
                    "-"}
                </td>

                <td>{evento.setorAnterior || "-"}</td>

                <td>{evento.setorNovo || "-"}</td>

                <td>{evento.origem || "-"}</td>

                <td>
                  {evento.destino ||
                    evento.localizacao ||
                    "-"}
                </td>

                <td>
                  {evento.data
                    ? new Date(evento.data).toLocaleString("pt-BR")
                    : "-"}
                </td>

                <td>{evento.observacao || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>

  </section>
)}

{graficosAberto && (
  <section className="dashboard">

    <div className="dashboard-cabecalho">
      <div>
        <h2>Gráficos</h2>
        <p>Análise visual do Inventário TI</p>
      </div>

      <button
        className="botao-voltar-inventario"
        type="button"
        onClick={() => setGraficosAberto(false)}
      >
        Voltar
      </button>
    </div>

  </section>
)}

{dashboardAberto && (
    <section className="dashboard">

      <div className="dashboard-cabecalho">
        <div>
          <h2>Dashboard</h2>
          <p>Visão geral do Inventário TI</p>
        </div>

        <button
          className="botao-voltar-inventario"
          type="button"
          onClick={() => setDashboardAberto(false)}
        >
          Voltar
        </button>
      </div>

      <div className="dashboard-conteudo">

      <div className="dashboard-indicadores">

  <h3>Indicadores</h3>

  <div className="lista-indicadores">

   <div className="indicador">
  <span>Total de equipamentos</span>
  <strong>{equipamentos.length}</strong>

  <div className="barra-indicador">
    <div
      className="barra-indicador-preenchida total"
      style={{
        width: `${
          equipamentos.length === 0
            ? 0
            : Math.min(
                90,
                15 + Math.log10(equipamentos.length) * 30
              )
        }%`
      }}
    ></div>
  </div>
</div>

    <div className="indicador">
  <span>Disponíveis</span>
  <strong>
    {equipamentos.filter(
      (equipamento) => equipamento.status === "Disponível"
    ).length}
  </strong>

  <div className="barra-indicador">
    <div
      className="barra-indicador-preenchida"
      style={{
        width: `${
          equipamentos.filter(
            (equipamento) => equipamento.status === "Disponível"
          ).length === 0
            ? 0
            : Math.min(
                90,
                15 +
                  Math.log10(
                    equipamentos.filter(
                      (equipamento) =>
                        equipamento.status === "Disponível"
                    ).length
                  ) *
                    30
              )
        }%`
      }}
    ></div>
  </div>
</div>

    <div className="indicador">
  <span>Em uso</span>
  <strong>
    {equipamentos.filter(
      (equipamento) => equipamento.status === "Em uso"
    ).length}
  </strong>

  <div className="barra-indicador">
    <div
      className="barra-indicador-preenchida"
      style={{
        width: `${
          equipamentos.filter(
            (equipamento) => equipamento.status === "Em uso"
          ).length === 0
            ? 0
            : Math.min(
                90,
                15 +
                  Math.log10(
                    equipamentos.filter(
                      (equipamento) => equipamento.status === "Em uso"
                    ).length
                  ) *
                    30
              )
        }%`
      }}
    ></div>
  </div>
</div>

    <div className="indicador">
  <span>Manutenção</span>
  <strong>
    {equipamentos.filter(
      (equipamento) => equipamento.status === "Manutenção"
    ).length}
  </strong>

  <div className="barra-indicador">
    <div
      className="barra-indicador-preenchida"
      style={{
        width: `${
          equipamentos.filter(
            (equipamento) => equipamento.status === "Manutenção"
          ).length === 0
            ? 0
            : Math.min(
                90,
                15 +
                  Math.log10(
                    equipamentos.filter(
                      (equipamento) =>
                        equipamento.status === "Manutenção"
                    ).length
                  ) *
                    30
              )
        }%`
      }}
    ></div>
  </div>
</div>

    <div className="indicador">
      <span>Shoppings</span>
      <strong>7</strong>

      <div className="barra-indicador">
        <div className="barra-indicador-preenchida shopping"></div>
      </div>
    </div>

  </div>

</div>

      <div className="dashboard-area-graficos">

    <div className="bloco-dashboard">
  <h3>Equipamentos por tipo</h3>

  <div className="espaco-grafico">
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={quantidadePorTipo}>
  <defs>
    <linearGradient id="gradienteBarras" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
<stop offset="100%" stopColor="#2563eb" stopOpacity={0.55} />
    </linearGradient>
  </defs>

  <XAxis
    dataKey="tipo"
    tick={{ fill: "#94a3b8", fontSize: 12 }}
  />

  <YAxis
    allowDecimals={false}
    tick={{ fill: "#64748b", fontSize: 12 }}
  />

  <Tooltip
    cursor={false}
    contentStyle={{
      backgroundColor: "#16263d",
      border: "1px solid #1f3550",
      borderRadius: "8px",
      color: "#ffffff",
    }}
    labelStyle={{
      color: "#94a3b8",
    }}
    itemStyle={{
      color: "#ffffff",
    }}
  />

  <Bar
    dataKey="quantidade"
    fill="url(#gradienteBarras)"
    radius={[6, 6, 0, 0]}
  />
</BarChart>
    </ResponsiveContainer>
  </div>
</div>

   <div className="bloco-dashboard">
  <h3>Equipamentos por localização</h3>

  <div className="espaco-grafico">
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={quantidadePorLocalizacao}>
        <XAxis
          dataKey="localizacao"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />

        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: "#16263d",
            border: "1px solid #1f3550",
            borderRadius: "8px",
            color: "#ffffff",
          }}
          labelStyle={{
            color: "#94a3b8",
          }}
          itemStyle={{
            color: "#ffffff",
          }}
        />

        <Bar
          dataKey="quantidade"
          fill="url(#gradienteBarras)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
<div className="bloco-dashboard">
  <h3>Equipamentos por localização e tipo</h3>

  <div className="espaco-grafico">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={equipamentosPorLocalizacaoETipo}>
  <defs>
    <filter id="sombraBarras" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow
        dx="0"
        dy="2"
        stdDeviation="3"
        floodColor="#000000"
        floodOpacity="0.25"
      />
    </filter>
  </defs>

  <XAxis
    dataKey="localizacao"
    tick={{ fill: "#94a3b8", fontSize: 12 }}
  />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />

        <Tooltip
  cursor={false}
  content={<TooltipLocalizacaoTipo />}
/>

 <Bar
  dataKey="Notebook"
  fill="#60a5fa"
  fillOpacity={0.38}
  radius={[6, 6, 0, 0]}
  style={{
    filter: "drop-shadow(0 0 5px rgba(96, 165, 250, 0.25))",
  }}
/>

<Bar
  dataKey="Desktop"
  fill="#4ade80"
  fillOpacity={0.32}
  radius={[6, 6, 0, 0]}
  style={{
    filter: "drop-shadow(0 0 5px rgba(74, 222, 128, 0.20))",
  }}
/>

<Bar
  dataKey="Monitor"
  fill="#fbbf24"
  fillOpacity={0.32}
  radius={[6, 6, 0, 0]}
  style={{
    filter: "drop-shadow(0 0 5px rgba(251, 191, 36, 0.20))",
  }}
/>

<Bar
  dataKey="Celular"
  fill="#c084fc"
  fillOpacity={0.32}
  radius={[6, 6, 0, 0]}
  style={{
    filter: "drop-shadow(0 0 5px rgba(192, 132, 252, 0.20))",
  }}
/>

<Bar
  dataKey="Tablet"
  fill="#f87171"
  fillOpacity={0.32}
  radius={[6, 6, 0, 0]}
  style={{
    filter: "drop-shadow(0 0 5px rgba(248, 113, 113, 0.20))",
  }}
/>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      </div>

    </div>

    </section>
  )}

{!dashboardAberto &&
 !graficosAberto &&
 !historicoAberto &&
 !relatoriosAberto &&
 !relatorioGeralAberto &&
 !relatorioManutencaoAberto &&
 !relatorioMovimentacaoAberto &&
 !relatorioHistoricoAberto &&
 !cadastroAberto &&
 !usuariosAberto && (
    <div>

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

    {usuarioLogado?.perfil === "Administrador" && (
      <button
        className="botao-salvar"
        type="button"
        onClick={() => setFormularioAberto(true)}
      >
        + Adicionar equipamento
      </button>
    )}
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
    <option value="">Equipamentos</option>
    <option value="Notebook">Notebook</option>
    <option value="Desktop">Desktop</option>
    <option value="Monitor">Monitor</option>
    <option value="Celular">Celular</option>
    <option value="Tablet">Tablet</option>
  </select>

  <select
  value={filtroLocalizacao}
  onChange={(event) => {
    setFiltroLocalizacao(event.target.value);
    setMostrarEquipamentos(true);
  }}
>
  <option value="">Shoppings</option>
  <option value="BBM">BBM</option>
  <option value="All Brás">All Brás</option>
  <option value="Caninde">Caninde</option>
  <option value="Elev">Elev</option>
  <option value="Porto Brás">Porto Brás</option>
  <option value="Vautier Premium">Vautier Premium</option>
  <option value="Vautier">Vautier</option>
</select>

  <select
  value={filtroStatus}
  onChange={(event) => {
    setFiltroStatus(event.target.value);
    setMostrarEquipamentos(true);
  }}
>
    <option value="">Status</option>
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
  Data de fabricação
  <input
    type="date"
    value={dataFabricacao}
    onChange={(event) => setDataFabricacao(event.target.value)}
  />
</label>

<label>
  Status
  <select
    value={status}
    onChange={(event) => {
      const novoStatus = event.target.value;

      if (status === "Manutenção" && novoStatus === "Disponível") {
        setObservacaoManutencao("Manutenção concluída");
      }

      setStatus(novoStatus);
    }}
  >
    <option value="">Selecione</option>
    <option value="Disponível">Disponível</option>
    <option value="Em uso">Em uso</option>
    <option value="Manutenção">Manutenção</option>
  </select>
</label>

            {status === "Manutenção" && (
  <label>
    Motivo da manutenção
    <textarea
      value={motivoManutencao}
      onChange={(event) => setMotivoManutencao(event.target.value)}
      placeholder="Informe o motivo da manutenção"
      rows="3"
    />
  </label>
)}

{(status === "Manutenção" ||
  (equipamentoEditando !== null &&
    equipamentos[equipamentoEditando]?.status === "Manutenção")) && (
  <label>
    Observação
    <textarea
      value={observacaoManutencao}
      onChange={(event) =>
        setObservacaoManutencao(event.target.value)
      }
      placeholder="Informe uma observação"
      rows="3"
    />
  </label>
)}

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
<th>Data de fabricação</th>
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
  {equipamento.dataFabricacao
    ? equipamento.dataFabricacao.split("-").reverse().join("/")
    : "-"}

  {equipamentoComMaisDeCincoAnos(equipamento.dataFabricacao) && (
    <span
      style={{
        display: "block",
        color: "#ef4444",
        fontWeight: "600",
        marginTop: "4px",
      }}
    >
      ⚠️ Mais de 5 anos
    </span>
  )}
</td>

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
          onClick={() => excluirEquipamento(equipamento)}
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

    </div>
  )}

</main>

    <div
      className="barra-scroll-historico"
      ref={barraHistoricoRef}
    >
      <div className="barra-scroll-historico-conteudo"></div>
    </div>

  </div>
)
}

export default App