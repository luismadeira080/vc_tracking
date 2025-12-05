import Link from 'next/link';
import { getTrackedCompanies } from '@/lib/supabase/queries';

export default async function CompaniesPage() {
  const companies = await getTrackedCompanies();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          VC Companies
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Tracked venture capital firms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              No companies tracked yet.
            </p>
          </div>
        ) : (
          companies.map((company) => (
            <Link
              key={company.id}
              href={`/dashboard/companies/${company.slug}`}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">
                    {company.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {company.name}
                  </h3>
                  {company.follower_count && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {company.follower_count.toLocaleString()} followers
                    </p>
                  )}
                </div>
              </div>
              {company.linkedin_url && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                  {company.linkedin_url}
                </p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
