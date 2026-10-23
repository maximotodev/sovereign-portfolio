"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { GitPullRequest, Star, FolderGit2, ExternalLink } from "lucide-react";

interface GithubUser { public_repos: number; }
interface Repo { stargazers_count: number; fork: boolean; }

export default function GithubMetrics() {
  const [stats, setStats] = useState<GithubUser | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/maximotodev", {signal: controller.signal}),
          fetch("https://api.github.com/users/maximotodev/repos?per_page=100&type=owner", {signal: controller.signal}),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API unavailable");
        const user = (await userRes.json()) as GithubUser;
        const repos = (await reposRes.json()) as Repo[];
        if (!Array.isArray(repos)) throw new Error("Unexpected GitHub response");
        setStats(user);
        setStars(repos.filter((repo) => !repo.fork).reduce((sum, repo) => sum + repo.stargazers_count, 0));
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
          <Icons.gitHub className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-neutral-200 text-sm">Public GitHub Activity</h3>
          <p className="text-[11px] text-neutral-500">GitHub public API · counts may be delayed</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Metric icon={<FolderGit2 className="w-4 h-4" />} label="Public repos" value={stats?.public_repos ?? (error ? "Unavailable" : "Loading")} />
        <Metric icon={<Star className="w-4 h-4" />} label="Stars on owned non-fork repos" value={stars ?? (error ? "Unavailable" : "Loading")} />
        <a href="https://github.com/PlebeianApp/market/pulls?q=author%3Amaximotodev" target="_blank" rel="noopener noreferrer" className="p-4 border border-neutral-800 bg-neutral-950/50 rounded-lg hover:border-orange-500/50">
          <div className="flex items-center gap-2 text-orange-400 mb-2"><GitPullRequest className="w-4 h-4" /><span className="text-xs uppercase">Plebeian PRs</span></div>
          <span className="text-sm text-white font-semibold flex gap-2 items-center">Browse verified work <ExternalLink className="w-3 h-3" /></span>
        </a>
      </div>
      <p className="text-xs text-neutral-500">No simulated contribution calendar or unverified commit and PR totals. Visit <a className="underline hover:text-white" href="https://github.com/maximotodev">GitHub</a> for authoritative activity history.</p>
    </div>
  );
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:number|string}) {
  return <div className="p-4 border border-neutral-800 bg-neutral-950/50 rounded-lg">
    <div className="flex gap-2 items-center text-neutral-400 text-xs mb-2">{icon}{label}</div>
    <div className="text-lg text-white font-bold">{value}</div>
  </div>;
}
