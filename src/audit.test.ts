import { describe, expect, it } from "vitest";
import { auditDocument, summarize } from "./audit";

function parse(html: string) {
  return new DOMParser().parseFromString(html, "text/html");
}

describe("auditDocument", () => {
  it("detects missing image names, labels, ARIA references, and positive tab order", () => {
    const findings = auditDocument(parse(
      '<main><img src="x"><input id="q"><div aria-labelledby="missing"></div><button tabindex="2">Go</button></main>',
    ));
    expect(findings.map((item) => item.rule)).toEqual(
      expect.arrayContaining(["image-alt", "form-label", "aria-reference", "tabindex-order"]),
    );
    expect(summarize(findings).errors).toBeGreaterThanOrEqual(3);
  });

  it("accepts explicit labels and decorative images", () => {
    const findings = auditDocument(parse(
      '<main><img src="x" alt=""><label for="q">Search</label><input id="q" aria-required="true"></main>',
    ));
    expect(findings).toEqual([]);
  });

  it("reports duplicate IDs and skipped heading levels", () => {
    const findings = auditDocument(parse(
      '<main><h1>Page</h1><h3>Section</h3><div id="x"></div><div id="x"></div></main>',
    ));
    expect(findings.map((item) => item.rule)).toEqual(expect.arrayContaining(["duplicate-id", "heading-order"]));
  });
});

