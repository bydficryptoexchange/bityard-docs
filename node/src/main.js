const JSDOM = require("jsdom").JSDOM;
const path = require("path");
const fs = require("fs");

const paths = [
  "../../docs/base/index.html",
  "../../docs/base/btn_dm.html",
  "../../docs/base/second.html",
].map((file) => path.join(__dirname, file));

paths.forEach((file) => {
  JSDOM.fromFile(file).then((dom) => {
    ((node) => {
      function translateDomTree(node) {
        if (node.nodeType === 3) {
          const text = node.textContent.trim();
          if (text && /[\u4e00-\u9fa5]/.test(text)) {
            node.textContent = `{{${text}}}`;
          }
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            if (!["SCRIPT"].includes(node.tagName)) {
              translateDomTree(node.childNodes[i]);
            }
          }
        }
      }
      translateDomTree(node);
      fs.writeFileSync(file, node.outerHTML);
    })(dom.window.document.documentElement);
  });
});
