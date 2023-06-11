import React from "react";

const ProjectInfo: React.FC = () => {
  return (
    <div className="p-4 mb-4 text-lg bg-white rounded-lg shadow-lg">
      <h2 className="mb-2 text-xl font-bold">Project Details:</h2>
      <p>- Trained on various Aptos data</p>
      <p>- Developed during the Hack Holland Hackathon</p>
      <h3 className="mt-4 text-lg font-bold">Disclaimer:</h3>
      <p>- This system may be biased due to the nature of the training data.</p>
      <p>
        - The response may not always be accurate, please use with discretion.
      </p>
    </div>
  );
};

export default ProjectInfo;
