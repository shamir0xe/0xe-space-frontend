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
    <div className={`items-left p-4 rounded-md flex flex-row ${className}`}>
      <div className="bg-cyan-900 rounded-l-lg">
        <YoutubeCMD />
        <TwitterCMD />
        <LeetcodeCMD />
      </div>
      <div className="bg-cyan-900 rounded-r-lg">
        <GithubCMD />
        <CodeforcesCMD />
        <TopcoderCMD />
      </div>
    </div>
  );
};

export default SocialsCMD;
