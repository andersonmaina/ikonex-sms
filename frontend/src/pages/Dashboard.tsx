import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['overviewStats'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/analytics/overview`);
      return data.data;
    }
  });

  return (
    <div className="space-y-lg max-w-[1440px] mx-auto w-full">
      {/* Welcome Section */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Academic Overview</h2>
          <p className="text-on-surface-variant font-body-lg">Welcome</p>
        </div>
        <div className="flex gap-sm items-center">
          <button
            onClick={() => queryClient.invalidateQueries()}
            className="p-3 text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-lg flex items-center justify-center shadow-sm h-full"
            title="Refresh Data"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
          <button className="bg-primary text-on-primary px-lg py-3 rounded-lg font-label-md flex items-center gap-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
            <span className="material-symbols-outlined">add</span>
            Generate Report
          </button>
        </div>
      </section>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl">
        {/* Total Students */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-40 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-headline-md">group</span>
            </div>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Total Students</p>
            <h3 className="font-headline-xl text-headline-xl text-primary">
              {isLoading ? '...' : stats?.totalStudents || 0}
            </h3>
          </div>
        </div>

        {/* Active Streams */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-40 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-headline-md">hub</span>
            </div>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Active Class Streams</p>
            <h3 className="font-headline-xl text-headline-xl text-primary">
              {isLoading ? '...' : stats?.activeStreams || 0}
            </h3>
          </div>
        </div>

        {/* Average GPA */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between h-40 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
              <span className="material-symbols-outlined text-headline-md text-primary">star</span>
            </div>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">School Average GPA (Est.)</p>
            <h3 className="font-headline-xl text-headline-xl text-primary">
              {isLoading ? '...' : stats?.averageGPA || '0.0'}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
