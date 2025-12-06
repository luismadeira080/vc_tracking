import { getRecentPosts, getTopPosts } from '@/lib/supabase/queries';

export default async function InsightsPage() {
  const recentPosts = await getRecentPosts(7);
  const topPosts = await getTopPosts(5, 30);

  // Calculate simple stats
  const totalEngagement = recentPosts.reduce((sum, post) => sum + (post.engagement_score || 0), 0);
  const avgEngagement = recentPosts.length > 0 ? Math.round(totalEngagement / recentPosts.length) : 0;

  // Category breakdown
  const categoryStats = recentPosts.reduce((acc, post) => {
    const category = post.post_categories?.name || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Insights
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Analytics and trends from the last 7 days
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Total Posts
          </h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {recentPosts.length}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Total Engagement
          </h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {totalEngagement}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Avg Engagement
          </h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {avgEngagement}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Post Categories
        </h2>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-zinc-700 dark:text-zinc-300">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-48 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(count / recentPosts.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Top Performing Posts (Last 30 Days)
        </h2>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <article
              key={post.id}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
            >
              {/* Rank badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                    #{index + 1}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Top Performer
                </div>
              </div>

              {/* Engagement metrics - Prominent */}
              <div className="grid grid-cols-4 gap-3 mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {post.engagement_score}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">TOTAL ENG.</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {post.stats.total_reactions || 0}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">LIKES</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {post.stats.comments || 0}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">COMMENTS</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {post.stats.reposts || 0}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">REPOSTS</div>
                </div>
              </div>

              {/* Company info */}
              <div className="flex items-center gap-3 mb-4">
                {post.vc_companies?.logo_url ? (
                  <img
                    src={post.vc_companies.logo_url}
                    alt={post.vc_companies.name}
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                ) : (
                  <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">
                      {post.vc_companies?.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {post.vc_companies?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {post.post_categories?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Preview - Full image visible with margins */}
              {post.document?.thumbnail && (
                <div className="mb-4 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
                  <img
                    src={post.document.thumbnail}
                    alt={post.document.title || 'Post document'}
                    className="max-w-full h-auto max-h-[400px] object-contain rounded-lg"
                  />
                </div>
              )}
              {!post.document?.thumbnail && post.media?.images && post.media.images.length > 0 && (
                <div className="mb-4">
                  {post.media.images.length === 1 ? (
                    <div className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
                      <img
                        src={post.media.images[0].url || post.media.images[0]}
                        alt="Post media"
                        className="max-w-full h-auto max-h-[400px] object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {post.media.images.slice(0, 4).map((image: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2">
                          <img
                            src={image.url || image}
                            alt="Post media"
                            className="max-w-full h-auto max-h-[200px] object-contain rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Post text content */}
              <p className="text-zinc-700 dark:text-zinc-300 text-sm line-clamp-3 leading-relaxed">
                {post.text_content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
