import React, { useState, useEffect } from 'react';
import { Search, User, Target, Activity, Trophy, Loader2, AlertCircle, Zap, Shield, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../../config';
import { useGetPlayerProfileQuery } from '../../services/cricketApi';


const StatCard = ({ title, value, subtitle, icon: Icon, accentClass, glowClass }) => (
    <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between gap-3 overflow-hidden group hover:border-slate-700 transition-colors duration-150">
        <div className={`absolute top-0 inset-x-0 h-[2px] ${accentClass} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

        <div className="min-w-0">
            <p className="text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">{title}</p>
            <h3 className="text-2xl font-black text-slate-100 leading-none">{value ?? '—'}</h3>
            {subtitle && <p className="text-xs text-slate-600 mt-1.5 leading-snug">{subtitle}</p>}
        </div>

        <div className={`shrink-0 p-2.5 rounded-lg ${glowClass} border transition-colors`}>
            <Icon size={17} />
        </div>
    </div>
);


const SectionHeading = ({ label, icon: Icon, iconClass }) => (
    <div className="flex items-center gap-2.5 mb-5">
        <div className={`p-1.5 rounded-md ${iconClass}`}>
            <Icon size={14} />
        </div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{label}</h3>
        <div className="flex-1 h-px bg-slate-800" />
    </div>
);


const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
            <p className="text-slate-400 mb-1">{label}</p>
            <p className="font-bold text-slate-100">{payload[0].value}</p>
        </div>
    );
};


const SkeletonGrid = ({ count, cols = 'grid-cols-2 md:grid-cols-4' }) => (
    <div className={`grid ${cols} gap-4`}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3 animate-pulse">
                <div className="h-2.5 w-1/2 bg-slate-800 rounded" />
                <div className="h-7 w-3/4 bg-slate-800 rounded mt-1" />
                <div className="h-2.5 w-1/3 bg-slate-800 rounded mt-auto" />
            </div>
        ))}
    </div>
);


const PlayerProfile = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [activePlayer, setActivePlayer] = useState('MS Dhoni');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { data: playerData, isLoading, error } = useGetPlayerProfileQuery(activePlayer);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 2) return;
            if (debouncedQuery.toLowerCase() === activePlayer.toLowerCase()) {
                setShowSuggestions(false);
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/cricket/player-search/?q=${encodeURIComponent(debouncedQuery)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
            }
        };
        fetchSuggestions();
    }, [debouncedQuery, activePlayer]);

    const handleSelectSuggestion = (playerName) => {
        setQuery(playerName);
        setActivePlayer(playerName);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    useEffect(() => {
        const handleClickOutside = () => setShowSuggestions(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) setActivePlayer(query.trim());
    };

    const battingCards = playerData?.batting ? [
        { title: 'Innings', value: playerData.batting.innings, icon: Activity, accentClass: 'bg-slate-400', glowClass: 'bg-slate-500/10 text-slate-400 border-slate-700/60' },
        { title: 'Total runs', value: playerData.batting.runs, icon: Target, accentClass: 'bg-emerald-500', glowClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-700/40' },
        { title: 'Highest score', value: playerData.batting.highest_score, icon: Trophy, accentClass: 'bg-amber-500', glowClass: 'bg-amber-500/10 text-amber-500 border-amber-700/40' },
        { title: 'Average', value: playerData.batting.average, subtitle: 'Runs per dismissal', icon: TrendingUp, accentClass: 'bg-purple-500', glowClass: 'bg-purple-500/10 text-purple-400 border-purple-700/40' },
        { title: 'Strike rate', value: playerData.batting.strike_rate, subtitle: 'Runs per 100 balls', icon: Zap, accentClass: 'bg-sky-500', glowClass: 'bg-sky-500/10 text-sky-400 border-sky-700/40' },
        { title: '50s / 100s', value: `${playerData.batting.fifties} / ${playerData.batting.hundreds}`, subtitle: 'Career milestones', icon: Trophy, accentClass: 'bg-amber-500', glowClass: 'bg-amber-500/10 text-amber-500 border-amber-700/40' },
        { title: 'Fours / Sixes', value: `${playerData.batting.fours} / ${playerData.batting.sixes}`, subtitle: 'Boundaries', icon: Target, accentClass: 'bg-pink-500', glowClass: 'bg-pink-500/10 text-pink-400 border-pink-700/40' },
    ] : [];

    const bowlingCards = playerData?.bowling ? [
        { title: 'Innings', value: playerData.bowling.innings, icon: Activity, accentClass: 'bg-slate-400', glowClass: 'bg-slate-500/10 text-slate-400 border-slate-700/60' },
        { title: 'Wickets', value: playerData.bowling.wickets, icon: Target, accentClass: 'bg-red-500', glowClass: 'bg-red-500/10 text-red-500 border-red-700/40' },
        { title: 'Best bowling', value: playerData.bowling.best_figure, subtitle: 'Wickets / runs', icon: Trophy, accentClass: 'bg-amber-500', glowClass: 'bg-amber-500/10 text-amber-500 border-amber-700/40' },
        { title: 'Economy', value: playerData.bowling.economy, subtitle: 'Runs per over', icon: Activity, accentClass: 'bg-orange-500', glowClass: 'bg-orange-500/10 text-orange-400 border-orange-700/40' },
        { title: 'Average', value: playerData.bowling.average, subtitle: 'Runs per wicket', icon: TrendingUp, accentClass: 'bg-pink-500', glowClass: 'bg-pink-500/10 text-pink-400 border-pink-700/40' },
        { title: 'Strike rate', value: playerData.bowling.strike_rate, subtitle: 'Balls per wicket', icon: Zap, accentClass: 'bg-indigo-500', glowClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-700/40' },
    ] : [];

    return (
        <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="max-w-6xl mx-auto w-full space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                                <User size={18} className="text-emerald-400" />
                            </div>
                            Player Intelligence
                        </h1>
                        <p className="text-slate-500 mt-1.5 text-sm">Deep statistical analysis and historical matchups.</p>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="relative w-full md:w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                            placeholder="Search player (e.g. Kohli, Bumrah)..."
                            className="
                w-full bg-slate-900 border border-slate-800 rounded-lg
                pl-10 pr-4 py-2.5
                text-sm text-slate-200 placeholder:text-slate-600
                focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30
                hover:border-slate-700
                transition-all duration-200
              "
                        />
                        <button type="submit" className="hidden" />

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                {suggestions.map((name, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelectSuggestion(name)}
                                        className="
                      flex items-center gap-2.5 px-4 py-3
                      text-sm text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80
                      cursor-pointer transition-colors duration-100
                      border-b border-slate-800 last:border-0
                    "
                                    >
                                        <User size={13} className="text-slate-600 shrink-0" />
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                </div>

                {isLoading ? (
                    <div className="space-y-8 animate-pulse">
                        <div className="h-32 bg-slate-900 border border-slate-800 rounded-2xl" />
                        <SkeletonGrid count={7} cols="grid-cols-2 md:grid-cols-4" />
                        <SkeletonGrid count={6} cols="grid-cols-2 md:grid-cols-3" />
                    </div>

                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                            <AlertCircle size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-300 mb-2">Analysis failed</h3>
                        <p className="text-slate-500 text-sm max-w-sm">
                            {error?.data?.error || 'Network error. Please check your connection.'}
                        </p>
                    </div>

                ) : playerData ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="relative overflow-hidden flex items-center justify-between p-7 bg-slate-900 border border-slate-800 rounded-2xl">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-emerald-500/4 rounded-full blur-2xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                                        {playerData.role}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-black text-slate-100 leading-tight">
                                    {playerData.name}
                                </h2>
                            </div>

                            <div className="hidden md:flex relative z-10 items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/8 border border-emerald-500/20">
                                <Shield size={28} className="text-emerald-500/40" />
                            </div>
                        </div>

                        {battingCards.length > 0 && (
                            <div>
                                <SectionHeading label="Career batting" icon={Target} iconClass="bg-emerald-500/10 text-emerald-500" />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {battingCards.map((card) => (
                                        <StatCard key={card.title} {...card} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {bowlingCards.length > 0 && (
                            <div>
                                <SectionHeading label="Career bowling" icon={Activity} iconClass="bg-red-500/10 text-red-500" />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {bowlingCards.map((card) => (
                                        <StatCard key={card.title} {...card} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {(playerData.batting_splits?.length > 0 || playerData.bowling_splits?.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {playerData.batting_splits?.length > 0 && (
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                        <SectionHeading label="Runs by opponent" icon={TrendingUp} iconClass="bg-emerald-500/10 text-emerald-500" />
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={playerData.batting_splits.slice(0, 8)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                    <XAxis dataKey="team" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(30,41,59,0.6)' }} />
                                                    <Bar dataKey="runs" fill="#10b981" radius={[4, 4, 0, 0]} name="Total runs" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}

                                {playerData.bowling_splits?.length > 0 && (
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                        <SectionHeading label="Wickets by opponent" icon={Target} iconClass="bg-red-500/10 text-red-500" />
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={playerData.bowling_splits.slice(0, 8)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                    <XAxis dataKey="team" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(30,41,59,0.6)' }} />
                                                    <Bar dataKey="wickets" fill="#ef4444" radius={[4, 4, 0, 0]} name="Wickets" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                ) : null}

            </div>
        </div>
    );
};

export default PlayerProfile;
