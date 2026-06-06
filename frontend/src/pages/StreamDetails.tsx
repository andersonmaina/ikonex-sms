import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';

const API_URL = import.meta.env.VITE_API_URL;

const StreamDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch Stream Details
  const { data: stream, isLoading: isLoadingStream } = useQuery({
    queryKey: ['stream', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/class-streams/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  // Fetch Stream Students
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students', { streamId: id }],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/students`, {
        params: { streamId: id }
      });
      return data.data;
    },
    enabled: !!id,
  });

  // Fetch Stream Performance
  const { data: performance } = useQuery({
    queryKey: ['analytics', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/analytics/class-performance`, {
        params: { streamId: id }
      });
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoadingStream) {
    return <div className="p-xl text-center"><span className="material-symbols-outlined animate-spin text-primary">autorenew</span></div>;
  }

  if (!stream) {
    return <div className="p-xl text-center text-error">Stream not found.</div>;
  }

  return (
    <div className="p-lg lg:p-xl space-y-xl max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <Link to="/class-streams" className="text-primary hover:underline font-label-md flex items-center gap-xs mb-sm">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Streams
          </Link>
          <h2 className="font-headline-xl text-headline-xl text-primary">{stream.name}</h2>
          <p className="text-on-surface-variant text-body-lg uppercase tracking-wider">{stream.code}</p>
        </div>
        <Link 
          to={`/analytics?streamId=${stream.id}`}
          className="bg-primary text-on-primary px-lg py-sm rounded-lg flex items-center gap-sm font-label-md hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined">analytics</span>
          Detailed Analytics
        </Link>
      </section>

      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <GlassCard className="flex flex-col justify-between h-32">
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Members</p>
          <div className="flex items-baseline gap-xs">
            <h3 className="font-headline-xl text-headline-xl text-primary">{students?.length || 0}</h3>
            <span className="text-label-sm text-on-surface-variant">/ {stream.capacity} capacity</span>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col justify-between h-32">
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Average Score</p>
          <div className="flex items-baseline gap-xs">
            <h3 className="font-headline-xl text-headline-xl text-primary">{performance?.avgScore || 0}%</h3>
          </div>
        </GlassCard>
        <GlassCard className="flex flex-col justify-between h-32">
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Pass Rate</p>
          <div className="flex items-baseline gap-xs">
            <h3 className="font-headline-xl text-headline-xl text-primary">
              {performance && (performance.passed + performance.failed) > 0 
                ? Math.round((performance.passed / (performance.passed + performance.failed)) * 100) 
                : 0}%
            </h3>
          </div>
        </GlassCard>
      </section>

      {/* Members List */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-lg py-md border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-headline-md text-primary">Students in this Stream</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-label-md text-primary border-b border-outline-variant uppercase tracking-wider">
                <th className="px-lg py-4">Student Name</th>
                <th className="px-lg py-4">Admission #</th>
                <th className="px-lg py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoadingStudents ? (
                <tr><td colSpan={3} className="p-lg text-center">Loading students...</td></tr>
              ) : students?.length === 0 ? (
                <tr><td colSpan={3} className="p-lg text-center text-on-surface-variant">No students in this stream.</td></tr>
              ) : (
                students?.map((student: any) => (
                  <tr key={student.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md font-bold">{student.first_name} {student.last_name}</td>
                    <td className="px-lg py-md font-mono text-sm">{student.admission_number}</td>
                    <td className="px-lg py-md text-right">
                      <Link to={`/students/${student.id}`} className="text-primary hover:underline font-label-sm">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StreamDetails;
