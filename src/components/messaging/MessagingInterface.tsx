
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define message type
interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  updated_at: string;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}

// Define conversation type to match the database return type
interface Conversation {
  id: string;
  other_user_id: string;
  full_name: string;
  avatar_url: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const MessagingInterface = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get('recipient');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentConversation, setCurrentConversation] = useState<string | null>(recipientId);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on component mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    }
  }, [currentConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to new messages
    const channel = supabase
      .channel('new-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        const newMessage = payload.new as Message;
        
        // Add new message to the messages list if it's in the current conversation
        if (newMessage.sender_id === currentConversation) {
          setMessages(prev => [...prev, newMessage]);
          markMessageAsRead(newMessage.id);
        }
        
        // Update conversations list
        fetchConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentConversation]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get the most recent message for each conversation using the RPC function
      const { data, error } = await supabase
        .rpc('get_user_conversations', { 
          input_user_id: user.id
        });
        
      if (error) throw error;
      
      if (data) {
        // Cast the data to our Conversation interface
        setConversations(data as Conversation[]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('receiver_id', user.id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const fetchMessages = async (recipientId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Mark messages as read
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', recipientId)
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      
      if (updateError) {
        console.error('Error marking messages as read:', updateError);
      }
      
      // Get messages between current user and recipient
      const { data, error } = await supabase
        .from('messages')
        .select(`*`)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        // Handle missing sender profile data
        const processedMessages = data.map(msg => {
          // Get sender name and avatar from either user profile or conversations list
          const senderName = msg.sender_id === user.id 
            ? profile?.full_name || 'You' 
            : conversations.find(c => c.other_user_id === msg.sender_id)?.full_name || 'User';
          
          const senderAvatar = msg.sender_id === user.id 
            ? profile?.avatar_url || '' 
            : conversations.find(c => c.other_user_id === msg.sender_id)?.avatar_url || '';
          
          // Create a properly typed message with sender info
          const enhancedMsg: Message = {
            ...msg as Message,
            sender: {
              full_name: senderName,
              avatar_url: senderAvatar
            }
          };
          
          return enhancedMsg;
        });
        
        setMessages(processedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !currentConversation || !newMessage.trim()) return;
    
    try {
      const messageData = {
        sender_id: user.id,
        receiver_id: currentConversation,
        content: newMessage.trim(),
        is_read: false
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        // Add sender profile info to the new message
        const newMsg: Message = {
          ...data[0] as Message,
          sender: {
            full_name: profile?.full_name || 'You',
            avatar_url: profile?.avatar_url || ''
          }
        };
        
        // Add to messages list
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update conversations list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    }
  };

  // Filter conversations based on search term and active tab
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm ? 
      conv.full_name.toLowerCase().includes(searchTerm.toLowerCase()) : 
      true;
      
    const matchesTab = activeTab === 'unread' ? 
      conv.unread_count > 0 : 
      true;
      
    return matchesSearch && matchesTab;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Conversations list */}
      <Card className="col-span-1 md:col-span-4">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg">Messages</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="mt-2" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {filteredConversations.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                {isLoading ? 'Loading conversations...' : 'No conversations found'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.other_user_id}
                    className={`px-4 py-3 cursor-pointer ${
                      currentConversation === conv.other_user_id ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setCurrentConversation(conv.other_user_id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={conv.avatar_url || ''} alt={conv.full_name} />
                        <AvatarFallback>{conv.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate">{conv.full_name}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(conv.last_message_time).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                          {conv.unread_count > 0 && (
                            <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-medium text-white bg-primary rounded-full">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Chat area */}
      <Card className="col-span-1 md:col-span-8">
        <CardContent className="p-0 h-[600px] flex flex-col">
          {!currentConversation ? (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div>
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b flex items-center">
                {conversations.find(c => c.other_user_id === currentConversation) ? (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage 
                        src={conversations.find(c => c.other_user_id === currentConversation)?.avatar_url || ''} 
                        alt={conversations.find(c => c.other_user_id === currentConversation)?.full_name || ''} 
                      />
                      <AvatarFallback>
                        {(conversations.find(c => c.other_user_id === currentConversation)?.full_name || '?').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">
                        {conversations.find(c => c.other_user_id === currentConversation)?.full_name}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">New Conversation</h3>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-10 text-sm text-muted-foreground">
                      {isLoading ? 'Loading messages...' : 'No messages yet. Send the first message!'}
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div className="flex items-end space-x-2">
                          {message.sender_id !== user?.id && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.sender?.avatar_url || ''} alt={message.sender?.full_name || ''} />
                              <AvatarFallback>{message.sender?.full_name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-md px-4 py-2 rounded-lg text-sm ${
                              message.sender_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {message.content}
                            <div className="text-xs mt-1 opacity-70">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingInterface;
