import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ClassStreams from '../pages/ClassStreams';
import StreamDetails from '../pages/StreamDetails';
import StudentDirectory from '../pages/StudentDirectory';
import StudentProfile from '../pages/StudentProfile';
import Subjects from '../pages/Subjects';
import Assessments from '../pages/Assessments';
import Analytics from '../pages/Analytics';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Layout from '../components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/class-streams',
        element: <ClassStreams />,
      },
      {
        path: '/class-streams/:id',
        element: <StreamDetails />,
      },
      {
        path: '/students',
        element: <StudentDirectory />,
      },
      {
        path: '/students/:id',
        element: <StudentProfile />,
      },
      {
        path: '/subjects',
        element: <Subjects />,
      },
      {
        path: '/assessments',
        element: <Assessments />,
      },
      {
        path: '/analytics',
        element: <Analytics />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
