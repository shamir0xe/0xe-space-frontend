import MarkdownCmp from "@/components/MarkdownCmp";
import APICall from "@/facades/apiCall";
import { useState } from "react";
import SocialsCMD from "../SocialsCMD";
import TypeSetterMediator from "@/mediators/TypeSetterMediator";
import Button from "@/components/Button";

const AboutMeCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  APICall.getKey("about_me")
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
      <div>
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
          for seeing my resume ^^
        </p>
      </div>
    </div>
  );
};

export default AboutMeCMD;
