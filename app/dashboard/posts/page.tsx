import { getRecentPosts } from '@/lib/supabase/queries';
import { formatDistanceToNow } from 'date-fns';

export default async function RecentPostsPage() {
  const posts = await getRecentPosts(7);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Recent Posts
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          LinkedIn posts from all VC companies (last 7 days)
        </p>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              No posts found. Add some VC companies and data to get started.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
            >
              {/* Engagement metrics - Prominent at top */}
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

              {/* Header: Company info */}
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
                    <span>{formatDistanceToNow(new Date(post.posted_at), { addSuffix: true })}</span>
                    <span>•</span>
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
                    className="max-w-full h-auto max-h-[600px] object-contain rounded-lg"
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
                        className="max-w-full h-auto max-h-[600px] object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {post.media.images.slice(0, 4).map((image: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2">
                          <img
                            src={image.url || image}
                            alt="Post media"
                            className="max-w-full h-auto max-h-[300px] object-contain rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Post text content */}
              <p className="text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-4 leading-relaxed">
                {post.text_content}
              </p>

              {post.post_url && (
                <a
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View on LinkedIn →
                </a>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
