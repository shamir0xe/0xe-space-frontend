import LeetcodeCMD from "../LeetcodeCMD";
import YoutubeCMD from "../YoutubeCMD";
import TwitterCMD from "../TwitterCMD";
import CodeforcesCMD from "../CodeforcesCMD";
import TopcoderCMD from "../TopcoderCMD";
import GithubCMD from "../GithubCMD";

type SocialsCMDProps = {
  className?: string;
};

const SocialsCMD = ({ className }: SocialsCMDProps): JSX.Element => {
  return (
    <div
      className={`items-left space-x-2 p-4 rounded-md flex flex-row ${className}`}
    >
      <div>
        <LeetcodeCMD />
        <YoutubeCMD />
        <TwitterCMD />
      </div>
      <div>
        <CodeforcesCMD />
        <TopcoderCMD />
        <GithubCMD />
      </div>
    </div>
  );
};

export default SocialsCMD;
