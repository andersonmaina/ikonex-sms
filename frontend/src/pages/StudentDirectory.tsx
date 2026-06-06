import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
  status?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const fetchStudents = async (): Promise<Student[]> => {
  const { data } = await axios.get(`${API_URL}/api/students`);
  return data.data;
};

const fetchStreams = async () => {
  const { data } = await axios.get(`${API_URL}/api/class-streams`);
  return data.data;
};

const deleteStudentApi = async (id: string) => {
  await axios.delete(`${API_URL}/api/students/${id}`);
};

const StudentDirectory = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStreamId, setFilterStreamId] = useState('');
  const [studentToEdit, setStudentToEdit] = useState<Student | undefined>(undefined);

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const { data: streams } = useQuery({
    queryKey: ['classStreams'],
    queryFn: fetchStreams,
  });

  const filteredStudents = students?.filter(student => {
    if (filterStreamId && student.stream_id !== filterStreamId) return false;
    return true;
  }) || [];

  const deleteMutation = useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (err: any) => {
      alert(`Error deleting student: ${err.response?.data?.error || err.message}`);
    }
  });

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

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
        <div className="flex gap-sm items-center">

          <button 
          onClick={() => {
            setStudentToEdit(undefined);
            setIsModalOpen(true);
          }}
          className="bg-primary text-on-primary px-lg py-3 rounded-lg font-label-md text-label-md flex items-center gap-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
        >
          <span className="material-symbols-outlined">person_add</span>
          Register Student
        </button>
        </div>
      </div>

      {/* Filters & Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
        <div className="glass-card p-md rounded-xl col-span-3 flex flex-wrap items-center gap-md">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Filters:</span>
          <div className="flex-1 min-w-[150px]">
            <select 
              value={filterStreamId}
              onChange={(e) => setFilterStreamId(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-2 font-body-md text-body-md focus:border-primary outline-none"
            >
              <option value="">All Class Streams</option>
              {streams?.map((stream: any) => (
                <option key={stream.id} value={stream.id}>
                  {stream.name} ({stream.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-2 font-body-md text-body-md focus:border-primary outline-none">
              <option value="">Status: All</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="glass-card p-md rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-on-surface-variant font-label-sm text-label-sm">TOTAL STUDENTS</span>
            <span className="text-headline-md font-bold text-primary">{filteredStudents.length}</span>
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
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center text-on-surface-variant font-label-md">No students found for this stream.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
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
                      {student.status === 'INACTIVE' ? (
                        <span className="px-md py-1 rounded-full bg-error-container/30 text-error text-label-sm font-bold border border-error/50">INACTIVE</span>
                      ) : (
                        <span className="px-md py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-label-sm font-bold border border-secondary-container/50">ACTIVE</span>
                      )}
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex justify-end gap-xs opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link to={`/students/${student.id}`} className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors" title="View Profile">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </Link>
                        <button onClick={() => handleEdit(student)} className="p-2 hover:bg-surface-container rounded-lg text-primary transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors" title="Delete">
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
        onClose={() => {
          setIsModalOpen(false);
          setStudentToEdit(undefined);
        }}
        studentToEdit={studentToEdit}
      />
    </div>
  );
};

export default StudentDirectory;
