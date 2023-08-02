import React from "react";
import Select from "react-select";
import useModels from "../../hooks/useModels";
import { useRouter } from "next/router";
import { IoReloadSharp } from "react-icons/io5";
import Image from "next/image";

const Model = () => {
  const models = useModels();
  const router = useRouter();
  const options = models.map((model: any) => ({
    value: model.id,
    label: model.name,
    image: model.image,
    name: model.name,
  }));

  const handleModelChange = (selectedOption: any) => {
    if (selectedOption.value === "explore") {
      router.push("/explore");
    } else {
      router.push(`?model=${selectedOption.name}`);
    }
  };

  const createNewChat = () => {
    // Implement the logic for creating a new chat
  };

  const customOption = ({ data, ...props }) => (
    <div>
      <div className="flex items-center bg-zinc-900 text-white p-3 cursor-pointer">
        <Image
          src={data.image}
          width={35}
          height={35}
          alt={data.label}
          className="rounded-md"
        />
        <span className="ml-4">{data.label}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#141619] text-white">
      <Select
        options={[...options]}
        isSearchable={false}
        className="w-full mb-4 bg-zinc-900 text-white"
        components={{
          Option: customOption,
        }}
        onChange={handleModelChange}
      />
      <button
        className="w-full h-10 text-md text-center rounded-md bg-gray-700 my-2 text-white"
        onClick={createNewChat}
      >
        New Chat
      </button>
    </div>
  );
};

export default Model;
