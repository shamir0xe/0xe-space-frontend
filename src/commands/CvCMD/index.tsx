import MarkdownCmp from "@/components/MarkdownCmp";
import APICall from "@/facades/apiCall";
import { useEffect, useState } from "react";
import cfg from "@/configs/general";
import "./index.css";
import Button from "@/components/Button";
import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import Markdown from "react-markdown";
import StarWars from "@/components/StarWars";

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

  useEffect(() => {
    APICall.getKey("cv")
      .then((value) => {
        setResumeMD(value);
      })
      .catch((error: any) => {
        console.log(error);
        setResumeMD(`## An error occured :( \n ${error}`);
      });
  }, []);

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
      } else if (
        subCommand == "starwars" ||
        subCommand == "sw" ||
        subCommand == "jedi" ||
        subCommand == ":{"
      ) {
        // TODO: Starwars section
        return (
          <div className="w-full h-screen bg-black overflow-hidden">
            <StarWars title="Resume">
              <MarkdownCmp content={resumeMD} />
            </StarWars>
          </div>
        );
      } else {
        throw new Error("bad input");
      }
    } else throw new Error("do the default");
  } catch (error) {
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
