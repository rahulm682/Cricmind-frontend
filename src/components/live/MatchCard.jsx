import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const MatchCard = ({ match }) => {
  const team1 = match.teamInfo?.[0]?.name || match.teams?.[0] || 'TBD';
  const team2 = match.teamInfo?.[1]?.name || match.teams?.[1] || 'TBD';

  const team1Img = match.teamInfo?.[0]?.img;
  const team2Img = match.teamInfo?.[1]?.img;

  const isLive = match.matchStarted && !match.matchEnded;

  const getScoreDisplay = (teamName) => {
    if (!match.score || match.score.length === 0) {
      return <span className="text-xs text-slate-600 font-medium whitespace-nowrap">Yet to bat</span>;
    }

    const teamScores = match.score.filter(s =>
      s.inning.toLowerCase().includes(teamName.toLowerCase())
    );

    if (teamScores.length === 0) {
      return <span className="text-xs text-slate-600 font-medium whitespace-nowrap">Yet to bat</span>;
    }

    return teamScores.map((s, index) => (
      <div key={index} className="text-right leading-tight whitespace-nowrap mb-0.5 last:mb-0">
        <span className="font-bold text-slate-200 text-sm">{s.r}/{s.w}</span>
        <span className="text-xs text-slate-500 ml-1.5">({s.o} ov)</span>
      </div>
    ));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors group flex flex-col h-full overflow-hidden relative w-full">
      <div className="flex justify-between items-center mb-5 shrink-0">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider border border-slate-700">
          {match.matchType || 'Match'}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 animate-pulse tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> LIVE
          </span>
        ) : match.matchEnded ? (
          <span className="text-[10px] font-bold text-slate-500 tracking-wider">FINISHED</span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 tracking-wider">
            <Clock size={12} /> UPCOMING
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-slate-400 mb-5 line-clamp-1 shrink-0" title={match.name}>
        {match.name}
      </h3>

      <div className="space-y-4 flex-1 flex flex-col justify-center min-w-0 w-full">

        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {team1Img ? (
              <img src={team1Img} alt={team1} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 p-0.5 shrink-0" />
            ) : (
              <div className="w-8 h-8 shrink-0 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                {team1.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-slate-200 truncate block" title={team1}>{team1}</span>
          </div>
          <div className="flex flex-col items-end justify-center shrink-0">
            {getScoreDisplay(team1)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {team2Img ? (
              <img src={team2Img} alt={team2} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 p-0.5 shrink-0" />
            ) : (
              <div className="w-8 h-8 shrink-0 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                {team2.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className="font-semibold text-slate-200 truncate block" title={team2}>{team2}</span>
          </div>
          <div className="flex flex-col items-end justify-center shrink-0">
            {getScoreDisplay(team2)}
          </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 shrink-0">
        <p className={`text-sm font-medium leading-snug line-clamp-2 ${match.status.toLowerCase().includes('won') ? 'text-emerald-400' : 'text-slate-300'}`}>
          {match.status}
        </p>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 truncate" title={match.venue}>
          <MapPin size={12} className="shrink-0" /> {match.venue}
        </p>
      </div>
    </div>
  );
};

export default MatchCard;
