import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink, Loader2, Newspaper, AlertCircle } from 'lucide-react';
import { useGetNewsQuery } from '../../services/cricketApi';

const NewsDesk = () => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('cricket');

  const {
    data: newsData,
    isLoading,
    isFetching,
    error
  } = useGetNewsQuery(activeQuery);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveQuery(query.trim());
    }
  };

  const showLoading = isLoading || isFetching;

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-700">
      <div className="max-w-6xl mx-auto w-full space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-200 flex items-center gap-2">
              <Newspaper className="text-emerald-500" />
              Live News Hub
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Real-time updates and AI briefings.</p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players, teams, matches..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <button type="submit" className="hidden" />
          </form>
        </div>

        {showLoading ? (
          <div className="animate-pulse space-y-8 w-full">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 h-40 flex flex-col gap-4">
              <div className="h-5 w-48 bg-slate-800 rounded"></div>
              <div className="space-y-2 mt-2">
                <div className="h-4 w-full bg-slate-800 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
                <div className="h-4 w-4/6 bg-slate-800 rounded"></div>
              </div>
            </div>

            <div>
              <div className="h-6 w-32 bg-slate-800 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-[340px] flex flex-col overflow-hidden">
                    <div className="h-40 bg-slate-800 w-full"></div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <div className="h-3 w-1/4 bg-slate-800 rounded"></div>
                      <div className="h-4 w-full bg-slate-800 rounded"></div>
                      <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
                      <div className="h-3 w-full bg-slate-800 rounded mt-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Search Failed</h3>
            <p className="text-slate-400 max-w-md">
              {error?.data?.error || "Network error. Please check your connection to the server."}
            </p>
            <button
              onClick={() => {
                setActiveQuery('cricket');
                setQuery('');
              }}
              className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            >
              Return to Top Headlines
            </button>
          </div>
        ) : newsData ? (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg shadow-emerald-900/10">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4 uppercase tracking-wider text-sm">
                <Sparkles size={18} />
                AI Executive Briefing: {newsData.query}
              </div>
              <div className="text-slate-300 space-y-3 whitespace-pre-line leading-relaxed">
                {newsData.ai_summary}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-2">Top Sources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.articles.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-colors h-full"
                  >
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} className="w-full h-40 object-cover border-b border-slate-800" />
                    ) : (
                      <div className="w-full h-40 bg-slate-800 flex items-center justify-center border-b border-slate-800">
                        <Newspaper size={32} className="text-slate-600" />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-xs text-emerald-500 font-medium mb-2">{article.source}</div>
                      <h3 className="text-slate-200 font-semibold text-sm mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-3 mb-4 flex-1">
                        {article.description}
                      </p>
                      <div className="mt-auto flex items-center justify-end text-xs text-slate-500 group-hover:text-emerald-400">
                        Read Full Article <ExternalLink size={12} className="ml-1" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
};

export default NewsDesk;
