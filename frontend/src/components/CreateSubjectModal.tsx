import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: any;
}

const API_URL = import.meta.env.VITE_API_URL;

const fetchStreams = async () => {
  const { data } = await axios.get(`${API_URL}/api/class-streams`);
  return data.data;
};

const saveSubject = async ({ id, ...subjectData }: any) => {
  if (id) {
    const { data } = await axios.put(`${API_URL}/api/subjects/${id}`, subjectData);
    return data.data;
  }
  const { data } = await axios.post(`${API_URL}/api/subjects`, subjectData);
  return data.data;
};

export const CreateSubjectModal = ({ isOpen, onClose, subjectToEdit }: CreateSubjectModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = React.useState(subjectToEdit?.name || '');
  const [code, setCode] = React.useState(subjectToEdit?.code || '');
  const [department, setDepartment] = React.useState(subjectToEdit?.department || '');
  const [examType, setExamType] = React.useState(subjectToEdit?.exam_type || 'Both');
  const [selectedStreams, setSelectedStreams] = React.useState<string[]>(
    subjectToEdit?.subject_assignments?.map((a: any) => a.class_streams.id) || []
  );

  React.useEffect(() => {
    if (isOpen) {
      setName(subjectToEdit?.name || '');
      setCode(subjectToEdit?.code || '');
      setDepartment(subjectToEdit?.department || '');
      setExamType(subjectToEdit?.exam_type || 'Both');
      setSelectedStreams(subjectToEdit?.subject_assignments?.map((a: any) => a.class_streams.id) || []);
    }
  }, [isOpen, subjectToEdit]);

  const { data: streams, isLoading: isLoadingStreams } = useQuery({
    queryKey: ['classStreams'],
    queryFn: fetchStreams,
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: saveSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      onClose();
    },
    onError: (err: any) => {
      alert(`Error saving subject: ${err.response?.data?.error || err.message}`);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: subjectToEdit?.id,
      name,
      code,
      department,
      exam_type: examType,
      stream_ids: selectedStreams
    });
  };

  const toggleStream = (streamId: string) => {
    setSelectedStreams(prev => 
      prev.includes(streamId) 
        ? prev.filter(id => id !== streamId)
        : [...prev, streamId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container/20">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">Subject Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced Mathematics" 
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
              />
            </div>
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">Subject Code</label>
              <input 
                required
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MATH-401" 
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">Department</label>
              <input 
                type="text" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Sciences" 
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
              />
            </div>
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">Exam Type</label>
              <select 
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
              >
                <option value="Both">Both (CAT & Exam)</option>
                <option value="CAT">CAT Only</option>
                <option value="Exam">Exam Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Assign to Streams</label>
            <div className="flex flex-wrap gap-sm max-h-32 overflow-y-auto p-sm bg-surface-container-low border border-outline-variant rounded-lg">
              {isLoadingStreams ? (
                 <span className="text-on-surface-variant text-sm">Loading streams...</span>
              ) : streams?.length === 0 ? (
                 <span className="text-on-surface-variant text-sm">No streams available. Create a stream first.</span>
              ) : (
                streams?.map((stream: any) => (
                  <button
                    key={stream.id}
                    type="button"
                    onClick={() => toggleStream(stream.id)}
                    className={`px-sm py-1 rounded-full border text-[11px] font-bold transition-colors ${
                      selectedStreams.includes(stream.id)
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface text-on-surface-variant border-outline-variant hover:border-primary/50'
                    }`}
                  >
                    {stream.name} ({stream.code})
                  </button>
                ))
              )}
            </div>
          </div>
          
          <div className="pt-md mt-lg border-t border-outline-variant flex justify-end gap-sm">
            <button 
              type="button" 
              onClick={onClose}
              className="px-lg py-2 rounded-lg font-label-md text-primary hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={mutation.isPending}
              className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-md font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center min-w-[120px]"
            >
              {mutation.isPending ? (
                <span className="material-symbols-outlined animate-spin">autorenew</span>
              ) : (
                subjectToEdit ? 'SAVE CHANGES' : 'CREATE SUBJECT'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
