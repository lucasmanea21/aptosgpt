import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";

export const runChroma = async () => {
  // Create docs with a loader

  const loader = new DirectoryLoader("training/data/docs/concepts", {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path, "text"),
  });

  const splitter = new CharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  console.log("loader", loader);
  const docs = await loader.load();

  const texts = await splitter.splitDocuments(docs);

  console.log("docs", docs);

  // Create vector store and index the docs
  const vectorStore = await Chroma.fromDocuments(
    texts,
    new OpenAIEmbeddings(),
    {
      collectionName: "a-test-collection",
    }
  );

  // Search for the most similar document
  const response = await vectorStore.similaritySearch("hello", 1);

  console.log(response);
  /*
[
  Document {
    pageContent: 'Foo\nBar\nBaz\n\n',
    metadata: { source: 'src/document_loaders/example_data/example.txt' }
  }
]
*/
};
