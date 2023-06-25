import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";

export const runChroma = async () => {
  // Create docs with a loader
  const texts = [
    `Tortoise: Labyrinth? Labyrinth? Could it Are we in the notorious Little
    Harmonic Labyrinth of the dreaded Majotaur?`,
    "Achilles: Yiikes! What is that?",
    `Tortoise: They say-although I person never believed it myself-that an I
    Majotaur has created a tiny labyrinth sits in a pit in the middle of
    it, waiting innocent victims to get lost in its fears complexity.
    Then, when they wander and dazed into the center, he laughs and
    laughs at them-so hard, that he laughs them to death!`,
    "Achilles: Oh, no!",
    "Tortoise: But it's only a myth. Courage, Achilles.",
  ];

  const metadatas = [{ id: 2 }, { id: 1 }, { id: 3 }];

  // Create OpenAIEmbeddings instance
  const embeddings = new OpenAIEmbeddings();

  // Create Chroma vector store
  const vectorStore = await Chroma.fromTexts(texts, metadatas, embeddings, {
    collectionName: "godel-escher-bach",
  });

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
