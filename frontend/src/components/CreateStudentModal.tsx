import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: any;
}

const API_URL = import.meta.env.VITE_API_URL;

const fetchStreams = async () => {
  const { data } = await axios.get(`${API_URL}/api/class-streams`);
  return data.data;
};

const saveStudent = async ({ id, ...studentData }: any) => {
  if (id) {
    const { data } = await axios.put(`${API_URL}/api/students/${id}`, studentData);
    return data.data;
  }
  const { data } = await axios.post(`${API_URL}/api/students`, studentData);
  return data.data;
};

export const CreateStudentModal = ({ isOpen, onClose, studentToEdit }: CreateStudentModalProps) => {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = React.useState(studentToEdit?.first_name || '');
  const [lastName, setLastName] = React.useState(studentToEdit?.last_name || '');
  const [admissionNum, setAdmissionNum] = React.useState(studentToEdit?.admission_number || '');
  const [streamId, setStreamId] = React.useState(studentToEdit?.stream_id || '');
  const [dob, setDob] = React.useState(studentToEdit?.dob || '');
  const [status, setStatus] = React.useState(studentToEdit?.status || 'ACTIVE');

  React.useEffect(() => {
    if (isOpen) {
      setFirstName(studentToEdit?.first_name || '');
      setLastName(studentToEdit?.last_name || '');
      setAdmissionNum(studentToEdit?.admission_number || '');
      setStreamId(studentToEdit?.stream_id || '');
      setDob(studentToEdit?.dob || '');
      setStatus(studentToEdit?.status || 'ACTIVE');
    }
  }, [isOpen, studentToEdit]);

  const { data: streams, isLoading: isLoadingStreams } = useQuery({
    queryKey: ['classStreams'],
    queryFn: fetchStreams,
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: saveStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onClose();
    },
    onError: (err: any) => {
      alert(`Error registering student: ${err.response?.data?.error || err.message}`);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: studentToEdit?.id,
      first_name: firstName,
      last_name: lastName,
      admission_number: admissionNum,
      stream_id: streamId || null,
      dob: dob || null,
      status: status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {studentToEdit ? 'Edit Student' : 'Register Student'}
          </h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container/20">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">First Name</label>
              <input 
                required
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Julian" 
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
              />
            </div>
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">Last Name</label>
              <input 
                required
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Alexander" 
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Admission Number</label>
            <input 
              required
              type="text" 
              value={admissionNum}
              onChange={(e) => setAdmissionNum(e.target.value)}
              placeholder="e.g. STU-2024-0891" 
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md uppercase"
            />
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Assign to Class Stream</label>
            <select
              value={streamId}
              onChange={(e) => setStreamId(e.target.value)}
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            >
              <option value="">Select a Stream (Optional)</option>
              {streams?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Date of Birth</label>
            <input 
              type="date" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md text-on-surface"
            />
          </div>
          
          {studentToEdit && (
            <div className="col-span-2">
              <label className="block text-label-md font-bold text-on-surface-variant mb-sm">Student Status</label>
              <div className="flex items-center gap-md">
                <button
                  type="button"
                  onClick={() => setStatus('ACTIVE')}
                  className={`flex-1 py-sm rounded-lg font-label-md border transition-all ${
                    status === 'ACTIVE' 
                      ? 'bg-secondary-container/30 border-secondary text-secondary font-bold' 
                      : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('INACTIVE')}
                  className={`flex-1 py-sm rounded-lg font-label-md border transition-all ${
                    status === 'INACTIVE' 
                      ? 'bg-error-container/30 border-error text-error font-bold' 
                      : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          )}
          
          <div className="pt-md border-t border-outline-variant flex justify-end gap-sm">
            <button 
              type="button" 
              onClick={onClose}
              className="px-lg py-2 rounded-lg font-label-md text-primary hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending || isLoadingStreams}
              className="px-lg py-2 rounded-lg font-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {mutation.isPending && <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>}
              {studentToEdit ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
