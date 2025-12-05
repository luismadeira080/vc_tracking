import { notFound } from 'next/navigation';
import { getCompanyBySlug, getCompanyPosts } from '@/lib/supabase/queries';
import { formatDistanceToNow } from 'date-fns';

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const company = await getCompanyBySlug(params.slug);

  if (!company) {
    notFound();
  }

  const posts = await getCompanyPosts(params.slug);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
            <span className="text-2xl font-semibold text-zinc-600 dark:text-zinc-300">
              {company.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {company.name}
            </h1>
            {company.follower_count && (
              <p className="text-zinc-600 dark:text-zinc-400">
                {company.follower_count.toLocaleString()} followers
              </p>
            )}
          </div>
        </div>
        {company.linkedin_url && (
          <a
            href={company.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View on LinkedIn →
          </a>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Recent Posts
        </h2>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">
              No posts found for this company.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatDistanceToNow(new Date(post.posted_at), { addSuffix: true })}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {post.post_categories?.name}
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {post.engagement_score} 🔥
                  </span>
                </div>
              </div>

              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                {post.text_content}
              </p>

              {/* Media Preview */}
              {post.media && post.media.images && post.media.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {post.media.images.slice(0, 4).map((image: any, idx: number) => (
                    <img
                      key={idx}
                      src={image.url || image}
                      alt="Post media"
                      className="w-full h-48 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                <span>👍 {post.stats.total_reactions || 0}</span>
                <span>💬 {post.stats.comments || 0}</span>
                <span>🔄 {post.stats.reposts || 0}</span>
              </div>

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
