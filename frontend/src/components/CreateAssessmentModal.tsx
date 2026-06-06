import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

const createAssessment = async (newAssessment: any) => {
  if (newAssessment.stream_id === '') {
    newAssessment.stream_id = null;
  }
  const { data } = await axios.post(`${API_URL}/api/grades/assessments`, newAssessment);
  return data.data;
};

export const CreateAssessmentModal: React.FC<CreateAssessmentModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Exam');
  const [maxScore, setMaxScore] = useState('70');
  const [streamId, setStreamId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState('');

  const { data: streams } = useQuery({
    queryKey: ['classStreams'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/class-streams`);
      return data.data;
    },
    enabled: isOpen,
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/subjects`);
      return data.data;
    },
    enabled: isOpen,
  });

  const filteredStreams = subjectId 
    ? streams?.filter((stream: any) => {
        const subj = subjects?.find((s: any) => s.id === subjectId);
        return subj?.subject_assignments?.some((a: any) => a.class_streams.id === stream.id);
      })
    : streams;

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSubjectId(sId);
    setStreamId(''); // reset stream when subject changes
    if (sId) {
      const subj = subjects?.find((s: any) => s.id === sId);
      if (subj && subj.exam_type && subj.exam_type !== 'Both') {
        setType(subj.exam_type);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      setTitle('');
      setType('Exam');
      setMaxScore('100');
      setStreamId('');
      setSubjectId('');
      setDate('');
      onClose();
    },
    onError: (err: any) => {
      alert(`Error creating assessment: ${err.response?.data?.error || err.message}`);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title,
      type,
      max_score: parseInt(maxScore) || 100,
      stream_id: streamId || null,
      subject_id: subjectId || null,
      date
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">Create Assessment</h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container/20">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Assessment Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Term 1 Midterm Mathematics" 
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">Type</label>
              <select 
                value={type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setType(newType);
                  setMaxScore(newType === 'Exam' ? '70' : '30');
                }}
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
              >
                <option value="Exam">Exam</option>
                <option value="CAT">CAT</option>
              </select>
            </div>
            <div>
              <label className="block text-label-md font-bold text-on-surface-variant mb-1">Maximum Score</label>
              <input 
                required
                type="number"
                min="1" 
                value={maxScore}
                readOnly
                className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg bg-gray-100 cursor-not-allowed opacity-70 outline-none transition-all font-body-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Subject</label>
            <select
              required
              value={subjectId}
              onChange={handleSubjectChange}
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            >
              <option value="">Select a Subject</option>
              {subjects?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Target Class Stream</label>
            <select
              value={streamId}
              onChange={(e) => setStreamId(e.target.value)}
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
              disabled={!subjectId}
            >
              <option value="">{subjectId ? 'All Assigned Streams' : 'Select a Subject first'}</option>
              {filteredStreams?.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Date</label>
            <input 
              required
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
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
              disabled={mutation.isPending}
              className="px-lg py-2 rounded-lg font-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {mutation.isPending && <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
