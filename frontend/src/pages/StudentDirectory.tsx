import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CreateStudentModal } from '../components/CreateStudentModal';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
  stream_id: string;
  dob: string;
  class_streams?: {
    id: string;
    name: string;
    code: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchStudents = async (): Promise<Student[]> => {
  const { data } = await axios.get(`${API_URL}/api/students`);
  return data.data;
};

const StudentDirectory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: students, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  return (
    <div className="p-xl max-w-[1440px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary mb-xs">Student Directory</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            Manage and monitor academic progress for enrolled students.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary px-lg py-3 rounded-lg font-label-md text-label-md flex items-center gap-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
        >
          <span className="material-symbols-outlined">person_add</span>
          Register Student
        </button>
      </div>

      {/* Filters & Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
        <div className="glass-card p-md rounded-xl col-span-3 flex flex-wrap items-center gap-md">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Filters:</span>
          <div className="flex-1 min-w-[150px]">
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-2 font-body-md text-body-md focus:border-primary outline-none">
              <option value="">All Class Streams</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-2 font-body-md text-body-md focus:border-primary outline-none">
              <option value="">Status: All</option>
              <option value="active">Active</option>
            </select>
          </div>
          <button className="flex items-center gap-xs text-primary font-label-md text-label-md px-md py-2 hover:bg-primary-container/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Advanced Filters
          </button>
        </div>

        <div className="glass-card p-md rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-label-sm text-label-sm">TOTAL STUDENTS</span>
            <span className="text-headline-md font-bold text-primary">{students?.length || 0}</span>
          </div>
          <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-lg py-md font-label-md text-label-md text-primary font-bold">STUDENT NAME</th>
                <th className="px-lg py-md font-label-md text-label-md text-primary font-bold">STUDENT ID</th>
                <th className="px-lg py-md font-label-md text-label-md text-primary font-bold">CLASS STREAM</th>
                <th className="px-lg py-md font-label-md text-label-md text-primary font-bold">STATUS</th>
                <th className="px-lg py-md font-label-md text-label-md text-primary font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center">
                    <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                  </td>
                </tr>
              ) : students?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center text-on-surface-variant">
                    No students registered yet. Click "Register Student" to begin.
                  </td>
                </tr>
              ) : (
                students?.map((student) => (
                  <tr key={student.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold uppercase">
                          {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-bold text-on-surface">{student.first_name} {student.last_name}</p>
                          <p className="text-[11px] text-on-surface-variant">{student.first_name.toLowerCase()}.{student.last_name.toLowerCase()}@ikonex.edu</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <code className="font-mono text-label-md bg-surface-container px-2 py-1 rounded">{student.admission_number}</code>
                    </td>
                    <td className="px-lg py-md">
                      <span className="font-body-md text-body-md">{student.class_streams?.name || 'Unassigned'}</span>
                    </td>
                    <td className="px-lg py-md">
                      <span className="px-md py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-label-sm font-bold border border-secondary-container/50">ACTIVE</span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex justify-end gap-xs opacity-40 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors" title="View Profile">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button className="p-2 hover:bg-surface-container rounded-lg text-primary transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StudentDirectory;
