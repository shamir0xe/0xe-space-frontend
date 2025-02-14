import MarkdownCmp from "@/components/MarkdownCmp";
import { GeneralAPI } from "@/facades/apiCall";
import { useState } from "react";
import SocialsCMD from "../SocialsCMD";
import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import Button from "@/components/Button";

const AboutMeCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  GeneralAPI.getKey("about_me")
    .then((content: string) => {
      setValue(content);
    })
    .catch((error) => {
      console.log(`error occurred: ${error}`);
    });
  return (
    <div>
      <MarkdownCmp content={value} />
      <SocialsCMD className="justify-center" />
      <div className="p-4">
        <p>
          type or tap{" "}
          <strong>
            <Button onMouseDown={() => TypeSetterMediator.enter("help")}>
              help
            </Button>
          </strong>{" "}
          for more info, or{" "}
          <Button onMouseDown={() => TypeSetterMediator.enter("cv")}>
            <strong>cv</strong>
          </Button>{" "}
          ( or <Button onMouseDown={() => TypeSetterMediator.enter("cv sw")}> <strong>cv sw</strong></Button> for cooler version :D )
          for seeing my resume ^^
        </p>
      </div>
    </div>
  );
};

export default AboutMeCMD;
