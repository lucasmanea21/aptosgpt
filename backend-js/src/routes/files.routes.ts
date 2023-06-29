const multer = require("multer");

module.exports = async (app: any) => {
  const files = require("../controllers/files.controller.ts");

  const upload = multer({
    dest: "uploads/", // this saves your file into a directory called "uploads"
  });

  const baseRoute = "/upload";

  app.post(`${baseRoute}`, upload.single("file"), files.uploadFile);
};
