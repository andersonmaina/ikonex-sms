import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ClassStreams from '../pages/ClassStreams';
import StudentDirectory from '../pages/StudentDirectory';
import StudentProfile from '../pages/StudentProfile';
import Subjects from '../pages/Subjects';
import NotFound from '../pages/NotFound';
import Layout from '../components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'class-streams',
        element: <ClassStreams />,
      },
      {
        path: 'students',
        element: <StudentDirectory />,
      },
      {
        path: 'students/:id',
        element: <StudentProfile />,
      },
      {
        path: 'subjects',
        element: <Subjects />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
