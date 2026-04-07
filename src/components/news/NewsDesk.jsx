import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink, Loader2, Newspaper, AlertCircle, RefreshCw, Rss } from 'lucide-react';
import { useGetNewsQuery } from '../../services/cricketApi';


const QUICK_TOPICS = ['Cricket', 'IPL', 'India', 'Test Cricket', 'T20 World Cup'];


const ArticleSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col animate-pulse">
    <div className="h-40 bg-slate-800 w-full shrink-0" />
    <div className="p-4 flex flex-col gap-3 flex-1">
      <div className="h-2.5 w-1/4 bg-slate-800 rounded" />
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-slate-800 rounded" />
        <div className="h-3.5 w-4/5 bg-slate-800 rounded" />
      </div>
      <div className="space-y-1.5 mt-1">
        <div className="h-3 w-full bg-slate-800 rounded" />
        <div className="h-3 w-5/6 bg-slate-800 rounded" />
        <div className="h-3 w-3/4 bg-slate-800 rounded" />
      </div>
      <div className="h-3 w-1/3 bg-slate-800 rounded mt-auto" />
    </div>
  </div>
);


const BriefingSkeleton = () => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-4 h-4 bg-slate-800 rounded" />
      <div className="h-3.5 w-48 bg-slate-800 rounded" />
    </div>
    <div className="space-y-2.5">
      <div className="h-3 w-full bg-slate-800 rounded" />
      <div className="h-3 w-5/6 bg-slate-800 rounded" />
      <div className="h-3 w-4/5 bg-slate-800 rounded" />
      <div className="h-3 w-full bg-slate-800 rounded" />
      <div className="h-3 w-3/4 bg-slate-800 rounded" />
    </div>
  </div>
);


const ArticleCard = ({ article, index }) => (
  <a
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-200 h-full"
    style={{ animationDelay: `${index * 40}ms` }}
  >
    {article.image_url ? (
      <img
        src={article.image_url}
        alt={article.title}
        className="w-full h-40 object-cover border-b border-slate-800 shrink-0"
      />
    ) : (
      <div className="w-full h-40 bg-slate-800/60 flex items-center justify-center border-b border-slate-800 shrink-0">
        <Newspaper size={28} className="text-slate-700" />
      </div>
    )}

    <div className="p-4 flex flex-col flex-1 gap-2.5">
      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
        {article.source}
      </span>

      <h3 className="text-slate-200 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors duration-150">
        {article.title}
      </h3>

      {article.description && (
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 flex-1">
          {article.description}
        </p>
      )}

      <div className="mt-auto pt-2 flex items-center gap-1 text-xs font-medium text-slate-600 group-hover:text-emerald-400 transition-colors duration-150">
        Read full article
        <ExternalLink size={11} className="ml-0.5" />
      </div>
    </div>
  </a>
);


const NewsDesk = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('cricket');

  const { data: newsData, isLoading, isFetching, error, refetch } = useGetNewsQuery(activeQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setActiveQuery(query.trim());
  };

  const handleQuickTopic = (topic) => {
    setQuery(topic);
    setActiveQuery(topic);
  };

  const showLoading = isLoading || isFetching;

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="max-w-6xl mx-auto w-full space-y-8">

        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                  <Rss size={18} className="text-emerald-400" />
                </div>
                News Desk
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm">
                Real-time cricket news with AI-powered briefings.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="relative w-full md:w-96 group"
            >
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors duration-200 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search players, teams, matches..."
                className="
                  w-full bg-slate-900 border border-slate-800 rounded-lg
                  pl-10 pr-12 py-2.5
                  text-sm text-slate-200 placeholder:text-slate-600
                  focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30
                  hover:border-slate-700
                  transition-all duration-200
                "
              />
              <button
                type="submit"
                disabled={!query.trim() || showLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-0 text-emerald-500 transition-all duration-150"
              >
                {showLoading
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Search size={13} />
                }
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mr-1">
              Quick search
            </span>
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => handleQuickTopic(topic)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                  ${activeQuery.toLowerCase() === topic.toLowerCase()
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                  }
                `}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {showLoading ? (
          <div className="space-y-8">
            <BriefingSkeleton />
            <div>
              <div className="h-4 w-28 bg-slate-800 rounded mb-5 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
              </div>
            </div>
          </div>

        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-5 border border-red-500/20">
              <AlertCircle size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">Search failed</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              {error?.data?.error || 'Network error. Please check your connection to the server.'}
            </p>
            <button
              onClick={() => { setActiveQuery('cricket'); setQuery(''); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all duration-150"
            >
              <RefreshCw size={14} />
              Return to top headlines
            </button>
          </div>

        ) : newsData ? (
          <div className="space-y-8 animate-in fade-in duration-400">

            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900 shadow-lg shadow-emerald-900/5">

              <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-emerald-400 to-emerald-700 rounded-r-full" />

              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-emerald-500/60 via-emerald-400/30 to-transparent" />

              <div className="px-7 py-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 text-xs uppercase tracking-widest">
                  <Sparkles size={14} className="shrink-0" />
                  AI Executive Briefing
                  <span className="text-emerald-600/80 font-medium normal-case tracking-normal">
                    — {newsData.query}
                  </span>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line space-y-2">
                  {newsData.ai_summary}
                </div>
              </div>
            </div>

            {newsData.articles?.length > 0 && (
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700">
                    <Newspaper size={13} className="text-slate-400" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Top sources
                  </h2>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-800 border border-slate-700/60 rounded-full px-2 py-0.5">
                    {newsData.articles.length}
                  </span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {newsData.articles.map((article, index) => (
                    <ArticleCard key={index} article={article} index={index} />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : null}

      </div>
    </div>
  );
};

export default NewsDesk;
