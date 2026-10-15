export type Severity = "error" | "warning" | "info";

export interface Finding {
  rule: string;
  severity: Severity;
  message: string;
  element: string;
}

const labelledByName = (element: Element, document: Document): boolean => {
  const labelledBy = element.getAttribute("aria-labelledby");
  if (!labelledBy) return false;
  return labelledBy.split(/\s+/).some((id) => {
    const label = document.getElementById(id);
    return Boolean(label?.textContent?.trim());
  });
};

const hasAccessibleName = (element: Element, document: Document): boolean =>
  Boolean(element.getAttribute("aria-label")?.trim()) ||
  labelledByName(element, document) ||
  Boolean(element.textContent?.trim());

const describe = (element: Element): string => {
  const id = element.id ? "#" + element.id : "";
  const classes = typeof element.className === "string" && element.className.trim()
    ? "." + element.className.trim().split(/\s+/).slice(0, 2).join(".")
    : "";
  return "<" + element.tagName.toLowerCase() + id + classes + ">";
};

export function auditDocument(document: Document): Finding[] {
  const findings: Finding[] = [];
  const add = (rule: string, severity: Severity, message: string, element: Element) =>
    findings.push({ rule, severity, message, element: describe(element) });

  const ids = new Set<string>();
  document.querySelectorAll("[id]").forEach((element) => {
    if (ids.has(element.id)) add("duplicate-id", "error", "ID repetido: " + element.id, element);
    else ids.add(element.id);
  });

  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("alt")) add("image-alt", "error", "Imagem sem atributo alt.", image);
  });
  document.querySelectorAll("button, input[type=button], input[type=submit], input[type=reset]").forEach((button) => {
    if (!hasAccessibleName(button, document) && !button.getAttribute("value")?.trim()) {
      add("control-name", "error", "Controle sem nome acessível.", button);
    }
  });
  document.querySelectorAll("a[href]").forEach((link) => {
    if (!hasAccessibleName(link, document)) add("link-name", "error", "Link sem nome acessível.", link);
  });

  document.querySelectorAll("input:not([type=hidden]), select, textarea").forEach((control) => {
    const id = control.id;
    const hasLabel = Boolean(id && Array.from(document.querySelectorAll("label[for]"))
      .some((label) => label.getAttribute("for") === id)) || Boolean(control.closest("label"));
    if (!hasLabel && !control.getAttribute("aria-label")?.trim() && !labelledByName(control, document)) {
      add("form-label", "error", "Campo de formulário sem label associado.", control);
    }
  });

  document.querySelectorAll("[aria-labelledby], [aria-describedby]").forEach((element) => {
    ["aria-labelledby", "aria-describedby"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      value.split(/\s+/).filter(Boolean).forEach((id) => {
        if (!document.getElementById(id)) {
          add("aria-reference", "error", attribute + " referencia ID inexistente: " + id, element);
        }
      });
    });
  });
  document.querySelectorAll("[aria-hidden], [aria-required]").forEach((element) => {
    ["aria-hidden", "aria-required"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value !== null && value !== "true" && value !== "false") {
        add("aria-value", "error", attribute + " deve ser true ou false.", element);
      }
    });
  });

  document.querySelectorAll("[tabindex]").forEach((element) => {
    const value = Number(element.getAttribute("tabindex"));
    if (!Number.isInteger(value)) add("tabindex-value", "error", "tabindex deve ser um número inteiro.", element);
    else if (value > 0) add("tabindex-order", "warning", "tabindex positivo pode quebrar a ordem natural do teclado.", element);
    else if (value === -1 && element.matches("a[href], button, input, select, textarea")) {
      add("keyboard-focus", "warning", "Elemento interativo foi removido da navegação por Tab.", element);
    }
  });

  let previousHeading = 0;
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    const level = Number(heading.tagName.slice(1));
    if (previousHeading && level > previousHeading + 1) {
      add("heading-order", "warning", "A hierarquia de títulos pulou do nível " + previousHeading + " para " + level + ".", heading);
    }
    previousHeading = level;
  });
  if (!document.querySelector("main, [role=main]")) {
    add("main-landmark", "info", "A página não tem um landmark main.", document.body ?? document.documentElement);
  }
  return findings;
}

export function summarize(findings: Finding[]) {
  return {
    errors: findings.filter((item) => item.severity === "error").length,
    warnings: findings.filter((item) => item.severity === "warning").length,
    info: findings.filter((item) => item.severity === "info").length,
  };
}

