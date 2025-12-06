import { getRecentPosts } from '@/lib/supabase/queries';
import { format, parseISO } from 'date-fns';
import { FileText, TrendingUp, Users, Award } from 'lucide-react';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';

export default async function DashboardPage() {
  // Fetch all recent posts (last 30 days for better analytics)
  const posts = await getRecentPosts(30);

  // Calculate KPIs
  const totalPosts = posts.length;

  // Total Engagement = sum of all individual stats (Likes + Comments + Reposts)
  const totalEngagement = posts.reduce((sum, post) => {
    return sum + (post.stats.total_reactions || 0) + (post.stats.comments || 0) + (post.stats.reposts || 0);
  }, 0);

  const avgEngagement = totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0;

  // Top Category = category with highest total engagement
  const categoryEngagement = posts.reduce((acc, post) => {
    const category = post.post_categories?.name || 'Portfolio News';
    const engagement = (post.stats.total_reactions || 0) + (post.stats.comments || 0) + (post.stats.reposts || 0);
    acc[category] = (acc[category] || 0) + engagement;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryEngagement)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

  // Chart A: Category Performance
  const categoryPerformance = posts.reduce((acc, post) => {
    const category = post.post_categories?.name || 'Portfolio News';
    if (!acc[category]) {
      acc[category] = { totalEngagement: 0, postCount: 0 };
    }
    const engagement = (post.stats.total_reactions || 0) + (post.stats.comments || 0) + (post.stats.reposts || 0);
    acc[category].totalEngagement += engagement;
    acc[category].postCount += 1;
    return acc;
  }, {} as Record<string, { totalEngagement: number; postCount: number }>);

  const categoryChartData = Object.entries(categoryPerformance)
    .map(([category, data]) => ({
      category,
      'Engagement': data.totalEngagement,
      'Avg. Eng. per Post': Math.round(data.totalEngagement / data.postCount),
    }))
    .sort((a, b) => b.Engagement - a.Engagement);

  // Chart B: Engagement Timeline
  const engagementTimeline = posts.reduce((acc, post) => {
    const date = format(parseISO(post.posted_at), 'yyyy-MM-dd');
    const engagement = (post.stats.total_reactions || 0) + (post.stats.comments || 0) + (post.stats.reposts || 0);

    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += engagement;
    return acc;
  }, {} as Record<string, number>);

  const timelineData = Object.entries(engagementTimeline)
    .map(([date, engagement]) => ({
      date,
      engagement,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Analytics from all VC companies (last 30 days)
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Posts Analyzed */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                Total Posts Analyzed
              </p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                {totalPosts}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Total Engagement */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                Total Engagement
              </p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                {totalEngagement.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Likes + Comments + Reposts
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Avg Engagement per Post */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                Avg. Engagement / Post
              </p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                {avgEngagement}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
                Top Category
              </p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                {topCategory}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Highest total engagement
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <AnalyticsCharts categoryChartData={categoryChartData} timelineData={timelineData} />
    </div>
  );
}
