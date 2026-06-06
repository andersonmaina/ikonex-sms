import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CreateAssessmentModal } from '../components/CreateAssessmentModal';

interface Assessment {
  id: string;
  title: string;
  type: string;
  max_score: number;
  date: string;
  stream_id: string;
  subject_id: string;
  class_streams?: {
    name: string;
    code: string;
  };
  subjects?: any;
}

const API_URL = import.meta.env.VITE_API_URL;

const fetchAssessments = async (): Promise<Assessment[]> => {
  const { data } = await axios.get(`${API_URL}/api/grades/assessments`);
  return data.data;
};

// Component for entering grades for a specific assessment
const GradeEntryForm = ({ assessment, onBack }: { assessment: Assessment, onBack: () => void }) => {
  const queryClient = useQueryClient();
  const [scores, setScores] = useState<Record<string, string>>({});

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students', assessment.stream_id, assessment.subject_id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/students`);
      if (!assessment.stream_id) {
        if (assessment.subjects?.subject_assignments) {
          const assignedStreamIds = assessment.subjects.subject_assignments.map((a: any) => a.stream_id);
          return data.data.filter((s: any) => assignedStreamIds.includes(s.stream_id));
        }
        return data.data;
      }
      return data.data.filter((s: any) => s.stream_id === assessment.stream_id);
    }
  });

  const { data: existingGrades, isLoading: isLoadingGrades } = useQuery({
    queryKey: ['grades', assessment.id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/grades/assessments/${assessment.id}/scores`);
      return data.data;
    },
    enabled: !!assessment.id,
  });

  React.useEffect(() => {
    if (existingGrades) {
      const initialScores: Record<string, string> = {};
      existingGrades.forEach((grade: any) => {
        initialScores[grade.student_id] = grade.score.toString();
      });
      setScores(initialScores);
    }
  }, [existingGrades]);

  const mutation = useMutation({
    mutationFn: async (payloads: { student_id: string, score: number }[]) => {
      await Promise.all(payloads.map(payload => 
        axios.post(`${API_URL}/api/grades/scores`, {
          student_id: payload.student_id,
          assessment_id: assessment.id,
          score: payload.score
        })
      ));
    },
    onSuccess: () => {
       alert("Grades saved successfully!");
       queryClient.invalidateQueries({ queryKey: ['grades', assessment.id] });
    },
    onError: (err: any) => {
       alert(`Error saving grades: ${err.response?.data?.error || err.message}`);
    }
  });

  const handleSave = () => {
    const payloads: { student_id: string, score: number }[] = [];
    Object.entries(scores).forEach(([studentId, scoreStr]) => {
      const score = parseFloat(scoreStr);
      if (!isNaN(score)) {
        payloads.push({ student_id: studentId, score });
      }
    });
    
    if (payloads.length > 0) {
      mutation.mutate(payloads);
    } else {
      alert("No valid scores to save.");
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm w-full mt-lg">
      <div className="flex items-center gap-sm mb-lg">
        <button onClick={onBack} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h3 className="font-headline-md text-primary">{assessment.title}</h3>
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">
            {assessment.class_streams?.name || 'All Streams'} • Max Score: {assessment.max_score}
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={mutation.isPending}
          className="ml-auto bg-primary text-on-primary px-lg py-2 rounded-lg font-label-md flex items-center gap-xs hover:bg-primary-container transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">save</span>
          {mutation.isPending ? 'Saving...' : 'Save Grades'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-y border-outline-variant text-label-md text-on-surface-variant uppercase">
              <th className="px-md py-sm">Student</th>
              <th className="px-md py-sm">ID</th>
              <th className="px-md py-sm text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {isLoadingStudents || isLoadingGrades ? (
               <tr><td colSpan={3} className="p-xl text-center">Loading data...</td></tr>
            ) : students?.length === 0 ? (
               <tr><td colSpan={3} className="p-xl text-center text-on-surface-variant">No students found in this stream.</td></tr>
            ) : (
              students?.map((student: any) => (
                <tr key={student.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-md py-md font-bold text-on-surface">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-md py-md font-mono text-sm text-outline">{student.admission_number}</td>
                  <td className="px-md py-md text-right">
                    <input 
                      type="number"
                      min="0"
                      max={assessment.max_score}
                      value={scores[student.id] || ''}
                      onChange={(e) => setScores(prev => ({ ...prev, [student.id]: e.target.value }))}
                      className="w-24 px-sm py-1 bg-surface-container border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-right font-bold text-primary"
                      placeholder="--"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Assessments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const { data: assessments, isLoading, isError } = useQuery({
    queryKey: ['assessments'],
    queryFn: fetchAssessments,
  });

  return (
    <div className="p-lg flex flex-col gap-lg overflow-y-auto w-full max-w-[1440px] mx-auto">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-md mt-xl">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Assessments & Data Entry</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-sm">
            Create assessment tasks and securely enter grades for student cohorts. Data automatically recalculates GPAs upon saving.
          </p>
        </div>
        {!selectedAssessment && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-on-primary px-lg py-3 rounded-lg flex items-center gap-sm font-label-md text-label-md font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            NEW ASSESSMENT
          </button>
        )}
      </section>

      {selectedAssessment ? (
        <GradeEntryForm assessment={selectedAssessment} onBack={() => setSelectedAssessment(null)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-lg">
          {isLoading ? (
            <div className="col-span-3 text-center p-xl">
              <span className="material-symbols-outlined animate-spin text-primary text-3xl">autorenew</span>
            </div>
          ) : isError ? (
            <div className="col-span-3 bg-error-container text-error p-md rounded-lg">Failed to load assessments.</div>
          ) : assessments?.length === 0 ? (
            <div className="col-span-3 text-center p-xl bg-surface-container border border-dashed border-outline-variant rounded-xl text-on-surface-variant">
              No assessments created. Click "NEW ASSESSMENT" to begin grading.
            </div>
          ) : (
            assessments?.map((a) => (
              <div 
                key={a.id} 
                onClick={() => setSelectedAssessment(a)}
                className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl hover:shadow-md hover:border-primary/50 cursor-pointer transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-md">
                  <span className="bg-primary-container/30 text-primary px-sm py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {a.type}
                  </span>
                  <span className="text-[12px] text-outline font-mono">{a.date}</span>
                </div>
                <h3 className="font-headline-md text-primary mb-xs">{a.title}</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  {a.class_streams?.name || 'All Streams'}
                </p>
                <p className="text-on-surface-variant text-sm flex items-center gap-xs mt-1 mb-2">
                  <span className="material-symbols-outlined text-[16px]">book</span>
                  {a.subjects?.name || 'General'}
                </p>
                <div className="mt-auto pt-md border-t border-outline-variant flex justify-between items-center group-hover:text-primary transition-colors">
                  <span className="text-sm font-bold text-outline">Max Score: {a.max_score}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <CreateAssessmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Assessments;
