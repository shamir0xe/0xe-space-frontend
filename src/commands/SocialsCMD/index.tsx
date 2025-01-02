import LeetcodeCMD from "../LeetcodeCMD";
import YoutubeCMD from "../YoutubeCMD";
import TwitterCMD from "../TwitterCMD";
import CodeforcesCMD from "../CodeforcesCMD";
import TopcoderCMD from "../TopcoderCMD";
import GithubCMD from "../GithubCMD";

const SocialsCMD = (): JSX.Element => {
  return (
    <div className="items-left space-x-2 p-4 rounded-md">
      <LeetcodeCMD />
      <YoutubeCMD />
      <TwitterCMD />
      <CodeforcesCMD />
      <TopcoderCMD />
      <GithubCMD />
    </div>
  );
};

export default SocialsCMD;
