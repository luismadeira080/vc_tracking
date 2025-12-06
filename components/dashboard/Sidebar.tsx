import Link from 'next/link';
import { Home, Building2, TrendingUp, FileText } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          VC Intel
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          LinkedIn Analytics
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/posts"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FileText size={20} />
              <span>Recent Posts</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/companies"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Building2 size={20} />
              <span>Companies</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/insights"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <TrendingUp size={20} />
              <span>Insights</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
