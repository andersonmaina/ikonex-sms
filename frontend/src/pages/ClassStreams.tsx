import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GlassCard } from '../components/ui/GlassCard';
import { CreateStreamModal } from '../components/CreateStreamModal';

interface ClassStream {
  id: string;
  name: string;
  code: string;
  capacity: number;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const fetchStreams = async (): Promise<ClassStream[]> => {
  const { data } = await axios.get(`${API_URL}/api/class-streams`);
  return data.data;
};

const createStream = async (newStream: { name: string; code: string; capacity: number }) => {
  const { data } = await axios.post(`${API_URL}/api/class-streams`, newStream);
  return data.data;
};

const ClassStreams = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: streams, isLoading, isError } = useQuery({
    queryKey: ['classStreams'],
    queryFn: fetchStreams,
  });

  const mutation = useMutation({
    mutationFn: createStream,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classStreams'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      alert(`Error creating stream: ${err.response?.data?.error || err.message}`);
    }
  });

  return (
    <div className="p-xl max-w-[1440px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary mb-xs">Class Streams</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            Organize and manage academic sections for the current session.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary px-lg py-md rounded-lg flex items-center gap-sm font-label-md text-label-md hover:bg-primary-container transition-colors shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
          Create New Stream
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
        <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant flex items-center gap-md">
          <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">grid_view</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-label-sm font-label-sm uppercase tracking-wider">Total Streams</p>
            <p className="text-headline-md font-headline-md font-bold text-primary">{streams?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Streams List */}
      {isLoading ? (
        <div className="flex justify-center p-xl">
          <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
        </div>
      ) : isError ? (
        <div className="text-error bg-error-container p-md rounded-lg">Failed to load class streams. Is the backend running?</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {streams?.map((stream) => (
            <GlassCard key={stream.id} className="hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-sm opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]">edit</span></button>
              </div>
              <div className="flex items-start gap-md mb-md">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold text-headline-md">
                  {stream.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">{stream.name}</h3>
                  <p className="text-label-md text-on-surface-variant uppercase tracking-wider">{stream.code}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/50">
                 <div className="flex items-center gap-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span className="font-label-md">Cap: {stream.capacity}</span>
                 </div>
              </div>
            </GlassCard>
          ))}

          {/* Empty State / Add New Button styled as card */}
          <button onClick={() => setIsModalOpen(true)} className="bg-surface border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-md p-lg hover:border-primary hover:bg-primary-container/5 transition-all group min-h-[160px]">
             <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-2xl">add</span>
             </div>
             <p className="font-headline-md text-primary text-center">Add New Stream</p>
          </button>
        </div>
      )}

      <CreateStreamModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
      />
    </div>
  );
};

export default ClassStreams;
