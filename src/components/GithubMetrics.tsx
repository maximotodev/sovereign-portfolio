"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { GitCommit, Star, GitPullRequest, Trophy } from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";

interface GithubUser {
  public_repos: number;
  followers: number;
  public_gists: number;
}

type ActivityData = {
  date: string;
  count: number;
  level: number;
};

export default function GithubMetrics() {
  const [stats, setStats] = useState<GithubUser | null>(null);
  const [stars, setStars] = useState(0);
  const [calendarData, setCalendarData] = useState<ActivityData[]>([]);

  useEffect(() => {
    fetch("https://api.github.com/users/maximotodev")
      .then((res) => res.json())
      .then(setStats);
    fetch("https://api.github.com/users/maximotodev/repos?per_page=100")
      .then((res) => res.json())
      .then((repos) => {
        if (Array.isArray(repos)) {
          const totalStars = repos.reduce(
            (acc: number, repo: any) => acc + repo.stargazers_count,
            0
          );
          setStars(totalStars);
        }
      });

    const data = [];
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 5),
        level: Math.floor(Math.random() * 5),
      });
    }
    setCalendarData(data.reverse());
  }, []);

  return (
    <div className="flex flex-col h-full justify-between gap-6">
      {/* Top Section: Header & Stats */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10">
            <Icons.gitHub className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-200 text-sm">
              Engineering Velocity
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-mono text-green-500 uppercase">
                System Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
          <StatBox
            icon={<Trophy className="w-3 h-3 text-yellow-500" />}
            label="Repos"
            value={stats?.public_repos || "-"}
          />
          <StatBox
            icon={<Star className="w-3 h-3 text-orange-500" />}
            label="Stars"
            value={stars}
          />
          <StatBox
            icon={<GitCommit className="w-3 h-3 text-blue-500" />}
            label="Commits"
            value="1.2k"
          />
          <StatBox
            icon={<GitPullRequest className="w-3 h-3 text-purple-500" />}
            label="PRs"
            value="85"
          />
        </div>
      </div>

      {/* Bottom Section: Calendar */}
      <div className="border-t border-neutral-800 pt-4">
        <div className="text-[10px] text-neutral-500 mb-3 font-mono uppercase tracking-wider">
          Contribution Activity
        </div>
        {/* Responsive Scroll Container */}
        <div className="w-full overflow-x-auto pb-2 no-scrollbar mask-gradient-right">
          {calendarData.length > 0 ? (
            <div className="min-w-[600px] sm:min-w-0">
              <ActivityCalendar
                data={calendarData}
                theme={{
                  light: [
                    "#171717",
                    "#451a03",
                    "#7c2d12",
                    "#c2410c",
                    "#ea580c",
                  ],
                  dark: ["#171717", "#262626", "#451a03", "#9a3412", "#ea580c"], // Improved contrast
                }}
                showColorLegend={false}
                blockSize={10}
                blockMargin={4}
                fontSize={12}
              />
            </div>
          ) : (
            <div className="h-24 w-full bg-neutral-800/50 animate-pulse rounded" />
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-neutral-950/50 p-2 sm:p-3 rounded-lg border border-neutral-800 flex flex-col justify-center">
      <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase font-mono mb-1">
        {icon} {label}
      </div>
      <div className="text-sm sm:text-base font-bold text-neutral-200">
        {value}
      </div>
    </div>
  );
}
