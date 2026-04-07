import React, { useState, useMemo } from 'react';
import { Activity, Loader2, AlertCircle, Clock, Trophy, Radio, RefreshCw, Filter } from 'lucide-react';
import MatchCard from './MatchCard';
import { useGetLiveMatchesQuery } from '../../services/cricketApi';

const getLeagueName = (matchName) => {
  if (!matchName) return 'Other Matches';
  const parts = matchName.split(',');
  if (parts.length > 1) {
    let leaguePart = parts[parts.length - 1].trim();
    leaguePart = leaguePart.replace(/\s\d{4}$/, '');
    return leaguePart;
  }
  return 'Other Matches';
};

const SectionHeading = ({ icon: Icon, label, iconClass, count }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div className={`p-1.5 rounded-md ${iconClass}`}>
      <Icon size={14} />
    </div>
    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{label}</h2>
    {count != null && (
      <span className="text-xs font-semibold text-slate-600 bg-slate-800 border border-slate-700/60 rounded-full px-2 py-0.5">
        {count}
      </span>
    )}
    <div className="flex-1 h-px bg-slate-800" />
  </div>
);

const MatchGrid = ({ matches }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {matches.map(match => (
      <MatchCard key={match.id} match={match} />
    ))}
  </div>
);

const EmptySection = ({ message }) => (
  <div className="py-10 text-center bg-slate-900/40 border border-slate-800/60 rounded-xl">
    <p className="text-sm text-slate-600 italic">{message}</p>
  </div>
);

const MatchSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-56 flex flex-col gap-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-5 w-14 bg-slate-800 rounded-full" />
      <div className="h-4 w-10 bg-slate-800 rounded" />
    </div>
    <div className="h-3.5 w-3/4 bg-slate-800 rounded" />
    <div className="flex-1 space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="h-3.5 w-20 bg-slate-800 rounded" />
        </div>
        <div className="h-3.5 w-16 bg-slate-800 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="h-3.5 w-24 bg-slate-800 rounded" />
        </div>
        <div className="h-3.5 w-12 bg-slate-800 rounded" />
      </div>
    </div>
    <div className="border-t border-slate-800 pt-3 space-y-2">
      <div className="h-3 w-full bg-slate-800 rounded" />
      <div className="h-3 w-2/3 bg-slate-800 rounded" />
    </div>
  </div>
);

const LiveMatches = () => {
  const [selectedLeague, setSelectedLeague] = useState('All');

  const {
    data: matches = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetLiveMatchesQuery(undefined, {
    pollingInterval: 60000,
  });

  const availableLeagues = useMemo(() => {
    const leagues = new Set();
    matches.forEach(m => leagues.add(getLeagueName(m.name)));
    return ['All', ...Array.from(leagues).sort()];
  }, [matches]);

  const filteredMatches = matches.filter(m =>
    selectedLeague === 'All' || getLeagueName(m.name) === selectedLeague
  );

  const sortedMatches = [...filteredMatches].sort((a, b) => new Date(b.dateTimeGMT) - new Date(a.dateTimeGMT));
  const liveGames = sortedMatches.filter(m => m.matchStarted && !m.matchEnded);
  const upcomingGames = sortedMatches.filter(m => !m.matchStarted && !m.matchEnded).sort((a, b) => new Date(a.dateTimeGMT) - new Date(b.dateTimeGMT));
  const pastGames = sortedMatches.filter(m => m.matchEnded);

  const isInitialLoading = isLoading && matches.length === 0;

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="max-w-7xl mx-auto w-full space-y-8">

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <Radio size={18} className="text-red-400" />
              </div>
              Live Match Center
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Real-time scores, schedules, and recent results from around the world.
            </p>
          </div>

          {!isInitialLoading && !error && (
            <button
              onClick={refetch}
              disabled={isFetching}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-150 shrink-0 mt-1 disabled:opacity-50"
            >
              <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>

        {!isInitialLoading && !error && availableLeagues.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <Filter size={16} className="text-slate-500 shrink-0" />
            {availableLeagues.map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${selectedLeague === league
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-300'
                  }`}
              >
                {league}
              </button>
            ))}
          </div>
        )}

        {isInitialLoading ? (
          <div className="space-y-10 pt-4">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 bg-slate-800 rounded-md animate-pulse" />
                <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <MatchSkeleton key={i} />)}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-5 border border-red-500/20">
              <AlertCircle size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">Connection lost</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              {error?.data?.error || 'Network error connecting to the match server.'}
            </p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all duration-150"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-12 pb-10 animate-in fade-in duration-500">
            {(selectedLeague === 'All' || liveGames.length > 0) && (
              <div>
                <SectionHeading icon={Activity} label="Live now" iconClass="bg-red-500/10 text-red-400 border border-red-500/20" count={liveGames.length} />
                {liveGames.length > 0 ? <MatchGrid matches={liveGames} /> : <EmptySection message="No live matches in this category." />}
              </div>
            )}

            {upcomingGames.length > 0 && (
              <div>
                <SectionHeading icon={Clock} label="Upcoming matches" iconClass="bg-sky-500/10 text-sky-400 border border-sky-500/20" count={upcomingGames.length} />
                <MatchGrid matches={upcomingGames} />
              </div>
            )}

            {pastGames.length > 0 && (
              <div>
                <SectionHeading icon={Trophy} label="Recent results" iconClass="bg-amber-500/10 text-amber-400 border border-amber-500/20" count={pastGames.length} />
                <MatchGrid matches={pastGames} />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default LiveMatches;