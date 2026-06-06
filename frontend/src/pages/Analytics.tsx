import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Analytics = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const streamId = searchParams.get('streamId') || '';
  const subjectId = searchParams.get('subjectId') || '';

  const updateParams = (newParams: Record<string, string>) => {
    const params = Object.fromEntries(searchParams.entries());
    Object.assign(params, newParams);
    Object.keys(params).forEach(k => {
      if (!params[k]) delete params[k];
    });
    setSearchParams(params);
  };

  const { data: streams } = useQuery({
    queryKey: ['classStreams'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/class-streams`);
      return data.data;
    }
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/subjects`);
      return data.data;
    }
  });

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', streamId, subjectId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/analytics/class-performance`, {
        params: { streamId, subjectId }
      });
      return data.data;
    }
  });

  return (
    <div className="p-lg lg:p-xl space-y-xl max-w-[1440px] mx-auto w-full">
      {/* Page Header & Class Selector */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Class Performance Analytics</h2>
          <p className="text-on-surface-variant text-body-lg">Detailed insight into student academic performance across cohorts.</p>
        </div>
        <div className="flex gap-sm items-center">
          <button
            onClick={() => queryClient.invalidateQueries()}
            className="p-3 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-lg flex items-center justify-center shadow-sm h-full"
            title="Refresh Data"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <div className="relative">
            <select 
              value={subjectId}
              onChange={(e) => updateParams({ subjectId: e.target.value })}
              className="appearance-none flex items-center gap-sm px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md font-semibold text-primary shadow-sm hover:bg-surface-container-low transition-colors pr-10"
            >
              <option value="">All Subjects</option>
              {subjects?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
          </div>

          <div className="relative">
            <select 
              value={streamId}
              onChange={(e) => updateParams({ streamId: e.target.value })}
              className="appearance-none flex items-center gap-sm px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md font-semibold text-primary shadow-sm hover:bg-surface-container-low transition-colors pr-10"
            >
              <option value="">All Streams</option>
              {streams?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary">expand_more</span>
          </div>
          <button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary rounded-lg text-body-md font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined">download</span> Export Report
          </button>
        </div>
      </section>

      {/* Key Metrics (Bento Grid Style) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-lg">
        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(26,54,93,0.08)] flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="text-on-surface-variant font-label-md uppercase tracking-wider">Average Score</div>
          <div className="flex items-baseline gap-sm z-10">
            <span className="text-headline-xl font-bold text-primary">{isLoading ? '...' : `${analytics?.avgScore}%`}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">school</span>
          </div>
        </div>

        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(26,54,93,0.08)] flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="text-on-surface-variant font-label-md uppercase tracking-wider">Passed Assessments</div>
          <div className="flex items-baseline gap-sm z-10">
            <span className="text-headline-xl font-bold text-primary">{isLoading ? '...' : analytics?.passed}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">verified</span>
          </div>
        </div>

        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(26,54,93,0.08)] flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="text-on-surface-variant font-label-md uppercase tracking-wider">Failed Assessments</div>
          <div className="flex items-baseline gap-sm z-10">
            <span className="text-headline-xl font-bold text-error">{isLoading ? '...' : analytics?.failed}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">warning</span>
          </div>
        </div>

        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(26,54,93,0.08)] flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="text-on-surface-variant font-label-md uppercase tracking-wider">Total Assessments</div>
          <div className="flex flex-col z-10">
            <span className="text-headline-xl font-bold text-primary">{isLoading ? '...' : analytics?.totalAssessments}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]">library_books</span>
          </div>
        </div>
      </section>

      {/* Analytics Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Grade Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white p-lg rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(26,54,93,0.08)] flex flex-col">
          <div className="flex justify-between items-center mb-xl">
            <h3 className="font-headline-md text-headline-md text-primary">Grade Distribution</h3>
          </div>
          <div className="flex-1 flex items-end justify-around px-md min-h-[300px] gap-lg">
            {['A', 'B', 'C', 'D', 'F'].map(grade => {
              const count = analytics?.distribution?.[grade] || 0;
              const total = (analytics?.passed || 0) + (analytics?.failed || 0);
              const height = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={grade} className="flex-1 flex flex-col items-center group">
                  <div className="w-full flex items-end justify-center gap-xs h-[250px]">
                    <div 
                      className={`w-full max-w-[48px] rounded-t-lg transition-all duration-1000 ${grade === 'F' ? 'bg-error' : 'bg-primary'}`}
                      style={{ height: `${height}%` }}
                      title={`${count} grades`}
                    ></div>
                  </div>
                  <span className="mt-md font-label-md text-on-surface-variant group-hover:text-primary transition-colors font-bold text-lg">{grade}</span>
                  <span className="text-xs text-outline">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-[0_4px_12px_rgba(26,54,93,0.08)]">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-md text-headline-md text-primary">Insights</h3>
            <button className="p-1 rounded hover:bg-surface-container text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>
          </div>
          <div className="space-y-md">
            <div className="flex gap-md items-start p-md bg-error-container/20 rounded-lg border border-error-container">
              <span className="material-symbols-outlined text-error mt-0.5">warning</span>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Intervention Required</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {analytics?.failed || 0} grades fall below the 40% passing threshold. Remedial sessions are highly recommended.
                </p>
              </div>
            </div>

            <div className="flex gap-md items-start p-md bg-secondary-container/20 rounded-lg border border-secondary-container">
              <span className="material-symbols-outlined text-secondary mt-0.5">trending_up</span>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Strong Performance</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {analytics?.distribution?.A || 0} students achieved an A grade (&gt;70%) across all assessments.
                </p>
              </div>
            </div>
            
            <button className="w-full py-sm mt-md font-label-md text-primary border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
              View Detailed Action Plan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
