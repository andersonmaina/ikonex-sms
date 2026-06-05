import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ClassStreams from '../pages/ClassStreams';
import StudentDirectory from '../pages/StudentDirectory';
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
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
