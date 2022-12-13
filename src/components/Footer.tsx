import GithubIcon from "../assets/githubicon.svg";
import LinkedInIcon from "../assets/linkedinicon.svg";

export const Footer = () => {
  return (
    <footer className="mt-28 flex h-16 w-full items-center justify-center gap-2 bg-violet-700">
      <div className="flex gap-1">
        <a
          href="https://github.com/andrewsolonets"
          className="group"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon className="h-7 w-7 stroke-white stroke-[1.75] hover:stroke-amber-400 group-hover:stroke-amber-400" />
        </a>
        <a
          href="https://www.linkedin.com/in/andrii-solonets/"
          className="group"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedInIcon className="group-hover:fill-amstroke-amber-400 hover:fill-amstroke-amber-400 h-7 w-7 fill-white" />
        </a>
      </div>
      <h2 className="text-white">Designed & Built by Andrii Solonets</h2>
    </footer>
  );
};
