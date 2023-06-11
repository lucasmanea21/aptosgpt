const fs = require("fs");
const path = require("path");

function consolidateDocs(directory, outputFile) {
  const files = fs.readdirSync(directory);
  for (let file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      consolidateDocs(filePath, outputFile);
    } else if (path.extname(file) === ".md") {
      // Assuming the docs are in Markdown format
      const contents = fs.readFileSync(filePath, "utf8");
      fs.appendFileSync(outputFile, contents + "\n\n");
    }
  }
}

consolidateDocs(".", "consolidated_docs.txt");
