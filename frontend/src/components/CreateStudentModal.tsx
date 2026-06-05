import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchStreams = async () => {
  const { data } = await axios.get(`${API_URL}/api/class-streams`);
  return data.data;
};

const createStudent = async (newStudent: any) => {
  const { data } = await axios.post(`${API_URL}/api/students`, newStudent);
  return data.data;
};

export const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [admissionNum, setAdmissionNum] = useState('');
  const [streamId, setStreamId] = useState('');
  const [dob, setDob] = useState('');

  const { data: streams, isLoading: isLoadingStreams } = useQuery({
    queryKey: ['classStreams'],
    queryFn: fetchStreams,
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // Reset form
      setFirstName('');
      setLastName('');
      setAdmissionNum('');
      setStreamId('');
      setDob('');
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
      first_name: firstName,
      last_name: lastName,
      admission_number: admissionNum,
      stream_id: streamId || null,
      dob: dob || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">Register Student</h2>
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
              disabled={mutation.isPending || isLoadingStreams}
              className="px-lg py-2 rounded-lg font-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {mutation.isPending && <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>}
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
