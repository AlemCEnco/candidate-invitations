import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ChannelSelection from './pages/ChannelSelection';
import TemplateSelection from './pages/TemplateSelection';
import SmsChannel from './pages/SmsChannel';
import WhatsappChannel from './pages/WhatsappChannel';
import EmailChannel from './pages/EmailChannel';
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
      },
			{
				path: 'sms-canal',
				element: <SmsChannel />
			},
			{
				path: 'email-canal',
				element: <EmailChannel />
			},
			{
				path: 'whatsapp-canal',
				element: <WhatsappChannel />
			},
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
