import React from 'react';
import { Activity, Loader2, AlertCircle, Clock, Trophy } from 'lucide-react';
import MatchCard from './MatchCard';
import { useGetLiveMatchesQuery } from '../../services/cricketApi';

const LiveMatches = () => {
  const {
    data: matches = [],
    isLoading,
    error
  } = useGetLiveMatchesQuery(undefined, {
    pollingInterval: 60000
  });

  const sortedMatches = [...matches].sort((a, b) => new Date(b.dateTimeGMT) - new Date(a.dateTimeGMT));
  const liveGames = sortedMatches.filter(m => m.matchStarted && !m.matchEnded);
  const upcomingGames = sortedMatches.filter(m => !m.matchStarted && !m.matchEnded);
  const pastGames = sortedMatches.filter(m => m.matchEnded);

  return (
    <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-700">
      <div className="max-w-7xl mx-auto w-full space-y-10">

        <div>
          <h1 className="text-3xl font-bold text-slate-200 flex items-center gap-2">
            <Activity className="text-red-500 animate-pulse" />
            Live Match Center
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time scores, schedules, and recent results from around the world.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-slate-400">Connecting to global stadiums...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Connection Lost</h3>
            <p className="text-slate-400 max-w-md">
              {error.data?.error || "Network error connecting to the match server."}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 space-y-12 pb-10">

            <div>
              <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Live Now
              </h2>
              {liveGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {liveGames.map(match => <MatchCard key={match.id} match={match} />)}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 italic">
                  No matches are currently live.
                </div>
              )}
            </div>

            {upcomingGames.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Clock size={20} className="text-blue-400" />
                  Upcoming Matches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {upcomingGames.sort((a, b) => new Date(a.dateTimeGMT) - new Date(b.dateTimeGMT)).map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {pastGames.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Trophy size={20} className="text-amber-500" />
                  Recent Results
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pastGames.map(match => <MatchCard key={match.id} match={match} />)}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
