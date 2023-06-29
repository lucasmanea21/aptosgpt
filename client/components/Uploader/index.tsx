import * as React from "react";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import Tus from "@uppy/tus";

const Uploader = () => {
  let uppy: any;

  React.useEffect(() => {
    uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxFileSize: 10000000, // 10mb
        maxNumberOfFiles: 100,
        minNumberOfFiles: 1,
      },
    });

    console.log("uppy", uppy);

    uppy.use(Tus, {
      endpoint: "/upload", // your server endpoint
    });

    uppy.on("complete", (result: any) => {
      console.log(
        "Upload complete! We’ve uploaded these files:",
        result.successful
      );
    });

    // cleanup function
    return () => {
      uppy.close();
    };
  }, []);

  return <DragDrop uppy={uppy} />;
};

export default Uploader;
