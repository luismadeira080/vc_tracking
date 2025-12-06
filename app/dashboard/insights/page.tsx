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
            <div
              key={post.id}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {post.vc_companies?.name}
                    </h3>
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {post.engagement_score} 🔥
                    </span>
                  </div>
                  {post.document?.thumbnail && (
                    <div className="mb-3">
                      <img
                        src={post.document.thumbnail}
                        alt={post.document.title || 'Post document'}
                        className="w-full h-32 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                      />
                    </div>
                  )}
                  {!post.document?.thumbnail && post.media?.images && post.media.images.length > 0 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {post.media.images.slice(0, 4).map((image: any, idx: number) => (
                        <img
                          key={idx}
                          src={image.url || image}
                          alt="Post media"
                          className="w-full h-32 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-zinc-700 dark:text-zinc-300 text-sm line-clamp-2 mb-3">
                    {post.text_content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>👍 {post.stats.total_reactions || 0}</span>
                    <span>💬 {post.stats.comments || 0}</span>
                    <span>🔄 {post.stats.reposts || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
