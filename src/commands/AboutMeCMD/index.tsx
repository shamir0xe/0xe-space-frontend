import MarkdownCmp from "@/components/MarkdownCmp";
import APICall from "@/facades/apiCall";
import { useState } from "react";
import SocialsCMD from "../SocialsCMD";

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
    </div>
  );
};

export default AboutMeCMD;
