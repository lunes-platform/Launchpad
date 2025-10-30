import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MessageSquare,
  Send,
  Users,
  Heart,
  Share2,
  Settings,
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  Star,
  Bookmark,
  MoreVertical,
  Calendar,
  Tag,
} from 'lucide-react';
import { Card, Button } from '@launchpad/shared-ui';
import { Badge } from '../components/ui/Badge';

interface AMAData {
  id: string;
  title: string;
  description: string;
  host: {
    name: string;
    avatar: string;
    role: string;
    company?: string;
  };
  project: {
    name: string;
    logo: string;
    category: string;
  };
  scheduledDate: string;
  duration: number;
  status: 'live' | 'upcoming' | 'completed';
  participants: number;
  videoUrl: string;
  tags: string[];
  price: number;
  currency: string;
  rating?: number;
  views: number;
  likes: number;
  language: string;
}

interface Question {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVip?: boolean;
  };
  message: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isAnswered: boolean;
  isHighlighted: boolean;
}

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    isVip?: boolean;
    isModerator?: boolean;
  };
  message: string;
  timestamp: string;
  type: 'message' | 'question' | 'system';
}

// Mock data - em produção viria da API
const mockAMA: AMAData = {
  id: '2',
  title: 'NFTs e Arte Digital: Revolução Criativa',
  description: 'Explorando o impacto dos NFTs no mercado de arte, casos de sucesso e tendências futuras.',
  host: {
    name: 'Ana Martins',
    avatar: '/src/assets/avatar-female.svg',
    role: 'NFT Artist',
    company: 'Digital Art Studio'
  },
  project: {
    name: 'NFT Marketplace',
    logo: '/src/assets/nft-logo.svg',
    category: 'NFT'
  },
  scheduledDate: '2024-02-12T20:30:00Z',
  duration: 60,
  status: 'live',
  participants: 156,
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  tags: ['NFT', 'Arte Digital', 'Criatividade'],
  price: 25,
  currency: 'LUNES',
  rating: 4.8,
  views: 890,
  likes: 67,
  language: 'Português'
};

const mockQuestions: Question[] = [
  {
    id: '1',
    user: {
      name: 'João Silva',
      avatar: '/src/assets/avatar-placeholder.svg',
      isVip: true
    },
    message: 'Qual é o futuro dos NFTs no mercado brasileiro? Vocês acreditam que haverá regulamentação específica?',
    timestamp: '2024-02-12T20:35:00Z',
    likes: 15,
    isLiked: false,
    isAnswered: false,
    isHighlighted: true
  },
  {
    id: '2',
    user: {
      name: 'Maria Santos',
      avatar: '/src/assets/avatar-female.svg'
    },
    message: 'Como avaliar se um projeto NFT tem potencial de valorização a longo prazo?',
    timestamp: '2024-02-12T20:33:00Z',
    likes: 8,
    isLiked: true,
    isAnswered: true,
    isHighlighted: false
  },
  {
    id: '3',
    user: {
      name: 'Carlos Oliveira',
      avatar: '/src/assets/avatar-male.svg'
    },
    message: 'Quais são os principais riscos ao investir em NFTs que os iniciantes devem conhecer?',
    timestamp: '2024-02-12T20:31:00Z',
    likes: 12,
    isLiked: false,
    isAnswered: false,
    isHighlighted: false
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    user: {
      name: 'Ana Martins',
      avatar: '/src/assets/avatar-female.svg',
      isModerator: true
    },
    message: 'Olá pessoal! Bem-vindos à nossa AMA sobre NFTs e Arte Digital!',
    timestamp: '2024-02-12T20:30:00Z',
    type: 'message'
  },
  {
    id: '2',
    user: {
      name: 'Pedro Costa',
      avatar: '/src/assets/avatar-placeholder.svg'
    },
    message: 'Muito animado para essa conversa! 🚀',
    timestamp: '2024-02-12T20:30:30Z',
    type: 'message'
  },
  {
    id: '3',
    user: {
      name: 'Sistema',
      avatar: '',
      isModerator: true
    },
    message: 'Lembrem-se de fazer suas perguntas na aba "Perguntas" para que possam ser respondidas!',
    timestamp: '2024-02-12T20:31:00Z',
    type: 'system'
  }
];

export function AMAWatchPage() {
  const navigate = useNavigate();
  const [ama] = useState<AMAData>(mockAMA);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [activeTab, setActiveTab] = useState<'chat' | 'questions'>('chat');
  const [newQuestion, setNewQuestion] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleLikeQuestion = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, isLiked: !q.isLiked, likes: q.isLiked ? q.likes - 1 : q.likes + 1 }
        : q
    ));
  };

  const handleSendQuestion = () => {
    if (!newQuestion.trim() || newQuestion.length > 500) return;

    const question: Question = {
      id: Date.now().toString(),
      user: {
        name: 'Você',
        avatar: '/src/assets/avatar-placeholder.svg',
        isVip: false
      },
      message: newQuestion.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      isAnswered: false,
      isHighlighted: false
    };

    setQuestions(prev => [question, ...prev]);
    setNewQuestion('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: 'Você',
        avatar: '/src/assets/avatar-placeholder.svg'
      },
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-grafite-900">
      {/* Header */}
      <div className="bg-white dark:bg-grafite-800 border-b border-gray-200 dark:border-grafite-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-100 text-red-800 animate-pulse">
                  • AO VIVO
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>{ama.participants} assistindo</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player e Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <iframe
                  ref={videoRef}
                  src={ama.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Settings className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Informações da AMA */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {ama.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {ama.description}
                  </p>
                </div>

                {/* Host e Project Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={ama.host.avatar}
                      alt={ama.host.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {ama.host.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ama.host.role} {ama.host.company && `• ${ama.host.company}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={ama.project.logo}
                      alt={ama.project.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {ama.project.name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {ama.project.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {ama.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatTime(ama.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(ama.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{ama.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{ama.likes} likes</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat e Perguntas */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-grafite-700">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'chat'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Chat ({chatMessages.length})
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'questions'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Perguntas ({questions.length})
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'chat' ? (
                  <div className="h-full flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex gap-2">
                          {message.user.avatar && (
                            <img
                              src={message.user.avatar}
                              alt={message.user.name}
                              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${
                                message.user.isModerator 
                                  ? 'text-red-600' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {message.user.name}
                              </span>
                              {message.user.isModerator && (
                                <Badge className="bg-red-100 text-red-800 text-xs px-1 py-0">
                                  MOD
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              message.type === 'system'
                                ? 'text-blue-600 italic'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {message.message}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-gray-200 dark:border-grafite-700 p-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Digite sua mensagem..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          size="sm"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* Questions List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                          <MessageSquare className="w-12 h-12 text-gray-400 mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Nenhuma pergunta ainda
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Seja o primeiro a fazer uma pergunta para o host!
                          </p>
                        </div>
                      ) : (
                        questions.map((question) => (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm overflow-hidden ${
                              question.isHighlighted
                                ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20'
                                : question.isAnswered
                                ? 'border-green-300 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
                                : 'border-gray-200 dark:border-grafite-600 bg-white dark:bg-grafite-700 hover:border-gray-300 dark:hover:border-grafite-500'
                            }`}
                          >
                            {/* Question Header */}
                            <div className="flex items-start gap-2 mb-2">
                              <div className="flex-shrink-0">
                                <img
                                  src={question.user.avatar}
                                  alt={question.user.name}
                                  className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200 dark:ring-grafite-600"
                                  onError={(e) => {
                                    e.currentTarget.src = '/src/assets/avatar-placeholder.svg';
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                    {question.user.name}
                                  </span>
                                  {question.user.isVip && (
                                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[10px] px-1.5 py-0 font-medium">
                                      VIP
                                    </Badge>
                                  )}
                                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                    {formatTime(question.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Question Content */}
                            <div className="mb-3">
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                                {question.message}
                              </p>
                            </div>

                            {/* Question Actions and Status */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <button
                                onClick={() => handleLikeQuestion(question.id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                                  question.isLiked
                                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-grafite-600'
                                }`}
                              >
                                <ThumbsUp className={`w-3 h-3 ${question.isLiked ? 'fill-current' : ''}`} />
                                <span>{question.likes}</span>
                              </button>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                {question.isAnswered && (
                                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] px-1.5 py-0.5 font-medium">
                                    ✓ Respondida
                                  </Badge>
                                )}
                                {question.isHighlighted && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-[10px] px-1.5 py-0.5 font-medium">
                                    ⭐ Destacada
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Question Input */}
                    <div className="border-t border-gray-200 dark:border-grafite-700 bg-gray-50 dark:bg-grafite-800">
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="relative">
                            <textarea
                              value={newQuestion}
                              onChange={(e) => setNewQuestion(e.target.value)}
                              placeholder="Faça sua pergunta para o host..."
                              rows={3}
                              maxLength={500}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-grafite-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                              {newQuestion.length}/500
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              💡 Dica: Perguntas claras e específicas têm mais chances de serem respondidas
                            </div>
                            <Button
                              onClick={handleSendQuestion}
                              disabled={!newQuestion.trim() || newQuestion.length > 500}
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Enviar Pergunta
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AMAWatchPage;