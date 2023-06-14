import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

from flask import Flask, request

from llama_index import (SimpleDirectoryReader, StorageContext,
                         VectorStoreIndex, load_index_from_storage)

index = None
persist_dir = './storage'

def initialize_index():
    print("does path exist?", os.path.exists(persist_dir))

    global index
    storage_context = StorageContext.from_defaults(persist_dir=persist_dir)
    if os.path.exists(persist_dir):
        index = load_index_from_storage(storage_context)
    else:
        documents = SimpleDirectoryReader("./data/docs").load_data()
        index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
        storage_context.persist(persist_dir=persist_dir)


app = Flask(__name__)

@app.route("/query", methods=["GET"])
def query_index():
  global index
  query_text = request.args.get("text", None)
  if query_text is None:
    return "No text found, please include a ?text=blah parameter in the URL", 400
  query_engine = index.as_query_engine()
  response = query_engine.query(query_text)
  return str(response), 200

if __name__ == "main":
    initialize_index()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
