import GithubIcon from "public/img/GithubIcon";
import LinkedInIcon from "public/img/LinkedinIcon";

export const Footer = () => {
  return (
    <footer className="flex h-16 w-full items-center justify-center gap-2 bg-violet-700">
      <div className="flex gap-1">
        <a
          aria-label="GitHub"
          href="https://github.com/andrewsolonets"
          className="group"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon className="h-7 w-7 stroke-white stroke-[1.75] text-transparent hover:stroke-amber-400 group-hover:stroke-amber-400" />
        </a>
        <a
          href="https://www.linkedin.com/in/andrii-solonets/"
          className="group"
          aria-label="LinkedIn"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedInIcon className="h-7 w-7 fill-white hover:stroke-amber-400 group-hover:stroke-amber-400" />
        </a>
      </div>
      <h2 className="text-slate-50">Designed & Built by Andrii Solonets</h2>
    </footer>
  );
};
