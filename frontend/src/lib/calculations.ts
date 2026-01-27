
interface Nota {
  valor: number | null;
  notaMaxima: number; // <--- Mudamos de 'notaMaxima' para 'valorMaximo'
}

interface Atividade {
  concluido: boolean;
}

export function calcularEstatisticas(notas: Nota[], atividades: Atividade[]) {
  // 1. Cálculos de Notas
  const notasLancadas = notas.filter((n) => n.valor !== null);
  
  const totalPontosObtidos = notasLancadas.reduce((acc, n) => acc + Number(n.valor), 0);
  
  // AQUI ESTAVA O ERRO: Trocamos .notaMaxima por .valorMaximo
  const totalPontosPossiveis = notasLancadas.reduce((acc, n) => acc + Number(n.notaMaxima), 0);
  
  // Média proporcional (0 a 10) baseada apenas no que já foi avaliado
  const mediaAtual = totalPontosPossiveis > 0 
    ? (totalPontosObtidos / totalPontosPossiveis) * 10 
    : 0;

  // 2. Cálculos de Tarefas
  const totalTarefas = atividades.length;
  const tarefasConcluidas = atividades.filter(a => a.concluido).length;
  const progressoTarefas = totalTarefas > 0 
    ? (tarefasConcluidas / totalTarefas) * 100 
    : 0;

  return {
    mediaAtual,
    totalPontosObtidos,
    totalPontosPossiveis,
    progressoTarefas,
    tarefasPendentes: totalTarefas - tarefasConcluidas,
    temNotas: notasLancadas.length > 0
  };
}