import React, { useState, useEffect } from 'react';
import { Search, User, Target, Activity, Trophy, Loader2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { API_BASE_URL } from '../../config';
import { useGetPlayerProfileQuery } from '../../services/cricketApi';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, className = "" }) => (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start justify-between ${className}`}>
        <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-200">{value}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon size={20} />
        </div>
    </div>
);


const PlayerProfile = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [activePlayer, setActivePlayer] = useState('MS Dhoni');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { data: playerData, isLoading, error } = useGetPlayerProfileQuery(activePlayer);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

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
                console.error("Failed to fetch suggestions:", err);
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
        if (query.trim()) {
            setActivePlayer(query.trim());
        }
    };

    return (
        <div className="h-full flex flex-col overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-700">
            <div className="max-w-6xl mx-auto w-full space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-200 flex items-center gap-2">
                            <User className="text-blue-500" />
                            Player Intelligence
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">Deep statistical analysis and historical matchups.</p>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="relative w-full md:w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                            placeholder="Search player (e.g., Kohli, Bumrah)..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                        <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                        <button type="submit" className="hidden" />

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                {suggestions.map((name, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelectSuggestion(name)}
                                        className="px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400 cursor-pointer transition-colors border-b border-slate-700/50 last:border-0 flex items-center gap-2"
                                    >
                                        <User size={14} className="text-slate-500" />
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                </div>

                {isLoading ? (
                    <div className="animate-pulse space-y-8 w-full">
                        <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center gap-3">
                            <div className="h-4 w-24 bg-slate-800 rounded"></div>
                            <div className="h-8 w-64 bg-slate-800 rounded"></div>
                        </div>

                        <div>
                            <div className="h-6 w-48 bg-slate-800 rounded mb-4"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={`bat-${i}`} className="h-28 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2">
                                        <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
                                        <div className="h-6 w-3/4 bg-slate-800 rounded mt-1"></div>
                                        <div className="h-3 w-1/3 bg-slate-800 rounded mt-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="h-6 w-48 bg-slate-800 rounded mb-4"></div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={`bowl-${i}`} className="h-28 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2">
                                        <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
                                        <div className="h-6 w-3/4 bg-slate-800 rounded mt-1"></div>
                                        <div className="h-3 w-1/3 bg-slate-800 rounded mt-auto"></div>
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
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Analysis Failed</h3>
                        <p className="text-slate-400 max-w-md">
                            {error?.data?.error || "Network error. Please check your connection."}
                        </p>
                    </div>
                ) : playerData ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-2xl shadow-lg">
                            <div>
                                <div className="text-blue-500 font-semibold text-sm tracking-widest uppercase mb-1 flex items-center gap-2">
                                    <Activity size={14} /> {playerData.role}
                                </div>
                                <h2 className="text-4xl font-black text-slate-100">{playerData.name}</h2>
                            </div>
                        </div>

                        {playerData.batting && (
                            <div>
                                <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-2">Career Batting Metrics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard
                                        title="Matches (Innings)"
                                        value={playerData.batting.innings}
                                        icon={Activity}
                                        colorClass="bg-slate-500/10 text-slate-400"
                                    />
                                    <StatCard
                                        title="Total Runs"
                                        value={playerData.batting.runs}
                                        icon={Target}
                                        colorClass="bg-emerald-500/10 text-emerald-500"
                                    />
                                    <StatCard
                                        title="Highest Score"
                                        value={playerData.batting.highest_score}
                                        icon={Trophy}
                                        colorClass="bg-amber-500/10 text-amber-500"
                                    />
                                    <StatCard
                                        title="Average"
                                        value={playerData.batting.average}
                                        subtitle="Runs per dismissal"
                                        icon={Activity}
                                        colorClass="bg-purple-500/10 text-purple-500"
                                    />
                                    <StatCard
                                        title="Strike Rate"
                                        value={playerData.batting.strike_rate}
                                        subtitle="Runs per 100 balls"
                                        icon={Activity}
                                        colorClass="bg-blue-500/10 text-blue-500"
                                    />
                                    <StatCard
                                        title="50s / 100s"
                                        value={`${playerData.batting.fifties} / ${playerData.batting.hundreds}`}
                                        subtitle="Career Milestones"
                                        icon={Trophy}
                                        colorClass="bg-amber-500/10 text-amber-500"
                                    />
                                    <StatCard
                                        title="Boundaries"
                                        value={`${playerData.batting.fours} / ${playerData.batting.sixes}`}
                                        subtitle="Fours / Sixes"
                                        icon={Target}
                                        colorClass="bg-pink-500/10 text-pink-500"
                                    />
                                </div>
                            </div>
                        )}

                        {playerData.bowling && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-2">Career Bowling Metrics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <StatCard
                                        title="Matches (Innings)"
                                        value={playerData.bowling.innings}
                                        icon={Activity}
                                        colorClass="bg-slate-500/10 text-slate-400"
                                    />
                                    <StatCard
                                        title="Wickets"
                                        value={playerData.bowling.wickets}
                                        icon={Target}
                                        colorClass="bg-red-500/10 text-red-500"
                                    />
                                    <StatCard
                                        title="Best Bowling"
                                        value={playerData.bowling.best_figure}
                                        subtitle="Wickets/Runs"
                                        icon={Trophy}
                                        colorClass="bg-amber-500/10 text-amber-500"
                                    />
                                    <StatCard
                                        title="Economy"
                                        value={playerData.bowling.economy}
                                        subtitle="Runs per over"
                                        icon={Activity}
                                        colorClass="bg-orange-500/10 text-orange-500"
                                    />
                                    <StatCard
                                        title="Average"
                                        value={playerData.bowling.average}
                                        subtitle="Runs per wicket"
                                        icon={Activity}
                                        colorClass="bg-pink-500/10 text-pink-500"
                                    />
                                    <StatCard
                                        title="Strike Rate"
                                        value={playerData.bowling.strike_rate}
                                        subtitle="Balls per wicket"
                                        icon={Activity}
                                        colorClass="bg-indigo-500/10 text-indigo-500"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            {playerData.batting_splits && playerData.batting_splits.length > 0 && (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-slate-300 mb-6">Runs by Opponent</h3>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={playerData.batting_splits.slice(0, 8)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <XAxis dataKey="team" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                                                <Bar dataKey="runs" fill="#10b981" radius={[4, 4, 0, 0]} name="Total Runs" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {playerData.bowling_splits && playerData.bowling_splits.length > 0 && (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-slate-300 mb-6">Wickets by Opponent</h3>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={playerData.bowling_splits.slice(0, 8)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <XAxis dataKey="team" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                                                <Bar dataKey="wickets" fill="#ef4444" radius={[4, 4, 0, 0]} name="Wickets" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PlayerProfile;
