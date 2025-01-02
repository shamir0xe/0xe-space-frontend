import MarkdownCmp from "@/components/MarkdownCmp";
import APICall from "@/facades/apiCall";
import { useState } from "react";

const AboutMeCMD = (): JSX.Element => {
  const [value, setValue] = useState<string>("");

  APICall.getKey("about_me")
    .then((content: string) => {
      setValue(content);
    })
    .catch((error) => {
      console.log(`error occurred: ${error}`);
    });
  return <MarkdownCmp content={value} />;
};

export default AboutMeCMD;
