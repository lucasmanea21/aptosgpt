import fs from "fs";

exports.uploadFile = ({ req, res }: any) => {
  console.log("ran upload");
  // req.file is the `file` file
  // req.body will hold the text fields, if there were any (in this case, 'folder-name')

  // Get the path where the chunks need to be saved
  // @ts-ignore
  const folderPath = path.join("uploads", req.headers["folder-name"]);

  // Create directory if it does not exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Move the file to the appropriate directory
  // @ts-ignore
  fs.renameSync(req.file.path, path.join(folderPath, req.file.originalname));

  // Reassemble the file from the chunks if all the chunks have been uploaded.
  // This depends on your implementation - you might need to track which chunks have been uploaded.

  res.sendStatus(200);
};
