
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  user_id: string;
  content: string;
  type: 'message' | 'connection' | 'opportunity' | 'system';
  is_read: boolean;
  created_at: string;
  metadata: any;
}

const NotificationsPopover = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('new-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show toast for new notification
        toast({
          title: "New Notification",
          description: newNotification.content,
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id?: string) => {
    if (!user) return;
    
    try {
      if (id) {
        // Mark single notification as read
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .eq('user_id', user.id);
          
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
      } else {
        // Mark all as read
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false);
          
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        );
      }
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      markAsRead();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'connection':
        return '🔗';
      case 'opportunity':
        return '💼';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" 
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 border-b flex items-center justify-between">
          <h4 className="font-medium">Notifications</h4>
          {notifications.some(n => !n.is_read) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-auto py-1" 
              onClick={() => markAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 relative ${notification.is_read ? '' : 'bg-primary/5'}`}
                >
                  <div className="flex gap-3">
                    <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
