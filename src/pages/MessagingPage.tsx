
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const MessagingPage = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <Card>
          <CardContent className="p-0 sm:p-6">
            <MessagingInterface />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MessagingPage;
