import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import { FiRefreshCcw } from "react-icons/fi";

function HomePage() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const url = "http://localhost:8000/api/models";
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

  //   useEffect(() => {
  //     const fetchModels = async () => {
  //       try {
  //         const response = await axios.get(url);
  //         setModels(response.data.models);
  //       } catch (error) {
  //         setError(error.message);
  //       }
  //     };

  //     fetchModels();
  //   }, []);

  const formik = useFormik({
    initialValues: {
      provider: "",
      dataFilePath: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(url, values);
        router.push(`/${response.data.id}`);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
  });

  if (error) return <div>An error occurred: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-6 bg-white rounded shadow-md w-96 text-black">
        <h1 className="text-2xl font-bold mb-4">Create a new model</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="provider"
              className="block text-sm font-medium text-gray-700"
            >
              Provider
            </label>
            <select
              id="provider"
              name="provider"
              onChange={formik.handleChange}
              value={formik.values.provider}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a provider</option>
              <option value="Chroma">Chroma</option>
              <option value="Pinecone">Pinecone</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="dataFilePath"
              className="block text-sm font-medium text-gray-700"
            >
              Index
            </label>
            <input
              id="dataFilePath"
              name="dataFilePath"
              type="text"
              required
              onChange={formik.handleChange}
              value={formik.values.dataFilePath}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md  py-2 px-3"
            />
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <FiRefreshCcw className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            ) : null}
            <span>Create</span>
          </button>
        </form>
      </div>
      <div className="mt-8 w-full flex justify-center">
        <ul className="list-disc list-inside w-96 space-y-2">
          {models?.map((model) => (
            <li key={model.id}>
              <a
                href={`/${model.id}`}
                className="text-indigo-600 hover:underline"
              >
                {model.id} ({model.provider})
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
