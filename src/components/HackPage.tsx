import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { clearHackMessages } from '../services/maintenanceService';
import { Copy, Send, Code, Terminal, Trash2, Download, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface HackMessage {
  id: string;
  content: string;
  created_at: string;
  language?: string;
}

export default function HackPage() {
  const [messages, setMessages] = useState<HackMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('text');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const programmingLanguages = [
    'text', 'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp', 
    'html', 'css', 'sql', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'json', 'xml'
  ];

  useEffect(() => {
    fetchMessages();
    const cleanup = subscribeToMessages();
    
    return cleanup;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching hack messages...');
      const { data, error } = await supabase
        .from('hack_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched messages:', data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages. Make sure the database table exists.');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    console.log('Setting up real-time subscription...');
    const channel = supabase
      .channel('hack_messages_realtime')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'hack_messages' },
        (payload) => {
          console.log('New message received:', payload.new);
          const newMessage = payload.new as HackMessage;
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'hack_messages' },
        (payload) => {
          console.log('Message deleted:', payload.old);
          fetchMessages(); // Refresh all messages when any is deleted
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription...');
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      console.log('Sending message:', { content: newMessage, language: selectedLanguage });
      const { error } = await supabase
        .from('hack_messages')
        .insert([{
          content: newMessage,
          language: selectedLanguage
        }]);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      setNewMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      toast.success('Code shared successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to share code. Make sure the database table exists.');
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const clearAllMessages = async () => {
    if (!confirm('Are you sure you want to clear all hack messages? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Clearing all hack messages...');
      const result = await clearHackMessages();
      
      if (result.success) {
        setMessages([]);
        toast.success(`Cleared ${result.messagesDeleted} messages successfully!`);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error clearing messages:', error);
      // Fallback to direct database deletion if service fails
      try {
        const { error: directError } = await supabase
          .from('hack_messages')
          .delete()
          .neq('id', '');

        if (directError) throw directError;
        setMessages([]);
        toast.success('All messages cleared successfully!');
      } catch (fallbackError) {
        console.error('Fallback clear also failed:', fallbackError);
        toast.error('Failed to clear messages. Please try again.');
      }
    }
  };

  const addTestMessage = async () => {
    try {
      const testCode = `// Test message
console.log("Hello from Hack Page!");
function testFunction() {
    return "Database connection working!";
}`;
      
      const { error } = await supabase
        .from('hack_messages')
        .insert([{
          content: testCode,
          language: 'javascript'
        }]);

      if (error) throw error;
      toast.success('Test message added!');
    } catch (error) {
      console.error('Error adding test message:', error);
      toast.error('Failed to add test message. Check database setup.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = newMessage.substring(0, start) + '    ' + newMessage.substring(end);
      setNewMessage(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
  };

  const downloadAsFile = (content: string, language: string) => {
    const extensions: { [key: string]: string } = {
      javascript: 'js', typescript: 'ts', python: 'py', java: 'java', 
      cpp: 'cpp', c: 'c', csharp: 'cs', html: 'html', css: 'css',
      sql: 'sql', php: 'php', ruby: 'rb', go: 'go', rust: 'rs',
      swift: 'swift', kotlin: 'kt', json: 'json', xml: 'xml'
    };
    
    const extension = extensions[language] || 'txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code_${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      toast.error('File too large. Maximum size is 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setNewMessage(content);
      
      // Try to detect language from file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const languageMap: { [key: string]: string } = {
        js: 'javascript', ts: 'typescript', py: 'python', java: 'java',
        cpp: 'cpp', c: 'c', cs: 'csharp', html: 'html', css: 'css',
        sql: 'sql', php: 'php', rb: 'ruby', go: 'go', rs: 'rust',
        swift: 'swift', kt: 'kotlin', json: 'json', xml: 'xml'
      };
      if (extension && languageMap[extension]) {
        setSelectedLanguage(languageMap[extension]);
      }
      
      toast.success('File loaded into editor');
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 text-green-400 font-mono flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-green-600 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Terminal className="h-6 w-6 text-green-400" />
            <h1 className="text-xl font-bold">HACK_TRANSFER_PROTOCOL</h1>
            <Code className="h-5 w-5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-300">
              Ctrl+Shift+H | Anonymous Code Share | Auto-clears daily at 12:00 AM
            </span>
            <button
              onClick={addTestMessage}
              className="p-2 bg-blue-900 hover:bg-blue-800 rounded transition-colors text-xs"
              title="Add test message"
            >
              TEST
            </button>
            <button
              onClick={clearAllMessages}
              className="p-2 bg-red-900 hover:bg-red-800 rounded transition-colors"
              title="Clear all hack messages"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-green-600 mt-8">
            <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">SECURE CODE TRANSFER INITIALIZED</p>
            <p className="text-sm opacity-75">Share code snippets instantly between devices</p>
            <p className="text-xs mt-2 opacity-50">Press Ctrl+Enter to send • Tab for indentation</p>
            <div className="mt-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
              <p className="text-yellow-400 text-sm mb-2">⚠️ No messages found</p>
              <p className="text-yellow-300 text-xs mb-3">
                If this is your first time, make sure to set up the database table.
              </p>
              <button
                onClick={addTestMessage}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                Add Test Message
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="bg-black rounded-lg border border-green-600 overflow-hidden">
              <div className="bg-green-900 bg-opacity-30 px-4 py-2 border-b border-green-600 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-green-300 text-sm font-semibold">
                    {message.language?.toUpperCase() || 'TEXT'}
                  </span>
                  <span className="text-green-500 text-xs">
                    {formatTimestamp(message.created_at)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="p-1 bg-green-800 hover:bg-green-700 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => downloadAsFile(message.content, message.language || 'text')}
                    className="p-1 bg-blue-800 hover:bg-blue-700 rounded transition-colors"
                    title="Download as file"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap break-words text-green-400 bg-gray-900">
                <code className="text-green-400">{message.content}</code>
              </pre>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-green-600 bg-black p-4 flex-shrink-0">
        <div className="flex items-center space-x-2 mb-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-gray-800 border border-green-600 text-green-400 px-3 py-1 rounded text-sm focus:outline-none focus:border-green-400"
          >
            {programmingLanguages.map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.js,.ts,.py,.java,.cpp,.c,.cs,.html,.css,.sql,.php,.rb,.go,.rs,.swift,.kt,.json,.xml"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-blue-800 hover:bg-blue-700 rounded transition-colors"
            title="Upload file"
          >
            <Upload className="h-4 w-4" />
          </button>
          
          <span className="text-green-500 text-xs">
            Ctrl+Enter to send • Tab for indentation
          </span>
        </div>
        
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Paste your code here... (Ctrl+Enter to send)"
            className="flex-1 bg-gray-800 border border-green-600 text-green-400 p-3 rounded resize-none focus:outline-none focus:border-green-400 font-mono text-sm min-h-[100px] max-h-[200px] overflow-y-auto"
            style={{ height: 'auto' }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-green-800 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded transition-colors flex items-center space-x-2 self-end"
          >
            <Send className="h-4 w-4" />
            <span>TRANSMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
}