import MarkdownCmp from "@/components/MarkdownCmp";
import APICall from "@/facades/apiCall";
import { useState } from "react";
import cfg from "@/configs/general";
import "./index.css";
import Button from "@/components/Button";
import TypeSetterMediator from "@/mediators/TypeSetterMediator";

type CvCMDType = {
  subCommand: string | null;
};

const CvCMD = ({ subCommand = null }: CvCMDType): JSX.Element => {
  const [resumeMD, setResumeMD] = useState<string>("** loading...");

  const downloadCV = (): void => {
    const cvUrl = cfg.cv.url;
    const link = document.createElement("a");
    link.href = cvUrl;
    link.download = `${cfg.me.name}_${cfg.me.surname}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  try {
    if (subCommand) {
      if (
        subCommand == "dl" ||
        subCommand == "download" ||
        subCommand == "pdf"
      ) {
        downloadCV();
        return (
          <div className="text-left">
            The requested CV is start downloading :)
          </div>
        );
      } else {
        throw new Error("bad input");
      }
      //TODO: Add starwars themed CV download
    } else throw new Error("do the default");
  } catch (error) {
    APICall.getKey("cv")
      .then((value) => {
        setResumeMD(value);
      })
      .catch((error: any) => {
        console.log(error);
        setResumeMD(`## An error occured :( \n ${error}`);
      });
    return (
      <div>
        <p>
          <span className="italic">Download the </span>
          <Button onMouseDown={() => TypeSetterMediator.enter("cv pdf")}>
            <strong>PDF version</strong>
          </Button>
        </p>
        <div className="border-double bg-white text-black rounded-3xl font-sans mt-5 cv-css">
          <MarkdownCmp content={resumeMD} />
        </div>
      </div>
    );
  }
};

export default CvCMD;
