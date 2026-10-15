# a11y-flow

Auditoria local de HTML para encontrar problemas comuns de nomes acessíveis, formulários, ARIA, foco de teclado e hierarquia de títulos. O conteúdo analisado fica no navegador.

## Executar

Requer Node.js 20.19 ou superior.

1. Execute **npm install**.
2. Execute **npm run dev** e abra o endereço exibido.
3. Cole o HTML ou carregue um arquivo e selecione **Analisar HTML**.

**npm test** executa os testes das regras e **npm run build** gera a versão estática em dist/.

A auditoria é uma verificação inicial de marcação; valide também a interface real com teclado e tecnologia assistiva.
