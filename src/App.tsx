import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ChannelSelection from './pages/ChannelSelection';
import TemplateSelection from './pages/TemplateSelection';
import ChannelForm from './pages/ChannelForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
			{
				path: 'seleccion-canales',
				element: <ChannelSelection />,
			},
			{
				path: '/seleccion-canales/:id',
				element: <ChannelForm />
			},
      {
        path: 'seleccion-plantilla',
        element: <TemplateSelection />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
