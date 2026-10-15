import { useMemo, useState } from "react";
import { auditDocument, summarize, type Finding, type Severity } from "./audit";

const sample = [
  "<main>",
  "  <h1>Cadastro de conta</h1>",
  "  <img src=\"/perfil.png\">",
  "  <label for=\"email\">E-mail</label>",
  "  <input id=\"email\" type=\"email\">",
  "  <button aria-label=\"Salvar cadastro\">Salvar</button>",
  "</main>",
].join("\n");

const labels: Record<Severity, string> = { error: "Erro", warning: "Atenção", info: "Dica" };

export default function App() {
  const [source, setSource] = useState(sample);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [message, setMessage] = useState("");
  const counts = useMemo(() => findings ? summarize(findings) : null, [findings]);

  function runAudit() {
    const parsed = new DOMParser().parseFromString(source, "text/html");
    setFindings(auditDocument(parsed));
    setMessage("");
  }

  async function loadFile(file?: File) {
    if (!file) return;
    setSource(await file.text());
    setFindings(null);
    setMessage(file.name + " carregado.");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="./" aria-label="a11y-flow início"><span className="brand-mark">a</span> a11y-flow</a>
        <span className="top-note">Acessibilidade, em um só fluxo</span>
      </header>
      <section className="intro">
        <p className="eyebrow">AUDITORIA DE HTML</p>
        <h1>Encontre barreiras antes que elas cheguem às pessoas.</h1>
        <p>Verifique nomes acessíveis, formulários, referências ARIA, foco e estrutura de títulos.</p>
      </section>
      <div className="workspace">
        <section className="panel source-panel" aria-labelledby="source-title">
          <div className="panel-heading">
            <div><span className="step">01</span><h2 id="source-title">HTML para analisar</h2></div>
            <label className="file-button">Abrir arquivo<input type="file" accept=".html,text/html" onChange={(event) => void loadFile(event.target.files?.[0])} /></label>
          </div>
          <textarea aria-label="HTML para analisar" spellCheck={false} value={source} onChange={(event) => setSource(event.target.value)} />
          <div className="source-footer">
            <span>{source.length.toLocaleString("pt-BR")} caracteres {message && "· " + message}</span>
            <button className="primary" onClick={runAudit}>Analisar HTML <span aria-hidden="true">→</span></button>
          </div>
        </section>
        <section className="panel results-panel" aria-labelledby="results-title" aria-live="polite">
          <div className="panel-heading">
            <div><span className="step">02</span><h2 id="results-title">Resultados</h2></div>
            {counts && <span className="finding-count">{findings?.length} achados</span>}
          </div>
          {!findings ? (
            <div className="empty-state"><span className="scan-icon" aria-hidden="true">⌕</span><strong>Seu relatório aparece aqui</strong><p>Insira o HTML e execute a auditoria.</p></div>
          ) : findings.length === 0 ? (
            <div className="clean-state"><span aria-hidden="true">✓</span><strong>Nenhum problema encontrado</strong><p>Uma boa primeira passada. Testes manuais seguem importantes.</p></div>
          ) : (
            <>
              <div className="summary">
                <div><strong>{counts?.errors ?? 0}</strong><span>erros</span></div>
                <div><strong>{counts?.warnings ?? 0}</strong><span>atenções</span></div>
                <div><strong>{counts?.info ?? 0}</strong><span>dicas</span></div>
              </div>
              <ul className="findings">
                {findings.map((finding, index) => (
                  <li key={finding.rule + finding.element + index}>
                    <span className={"badge " + finding.severity}>{labels[finding.severity]}</span>
                    <div><p>{finding.message}</p><code>{finding.element}</code><small>{finding.rule}</small></div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
      <footer>Feito para revisar marcação. A automação não substitui testes com teclado e leitores de tela.</footer>
    </main>
  );
}

