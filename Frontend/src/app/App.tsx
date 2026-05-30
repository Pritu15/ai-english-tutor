import { useState, useEffect } from 'react';
import { BookOpen, Brain, Target, Mic, Headphones, FileText, Sparkles, ArrowRight, Clock, CheckCircle2, X, TrendingUp, User, Trophy, Flame, BarChart3, ArrowLeft, GraduationCap, Lightbulb, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

type Topic = 'grammar' | 'vocabulary' | 'speaking' | 'writing' | 'listening' | 'reading';
type Screen = 'auth' | 'home' | 'grammar-subtopics' | 'quiz' | 'summary' | 'learning' | 'profile';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface MistakeRecord {
  question: Question;
  userAnswer: number;
}

interface FlashCard {
  title: string;
  rule: string;
  example: string;
  tip: string;
}

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [screen, setScreen] = useState<Screen>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedGrammarTopics, setSelectedGrammarTopics] = useState<string[]>([]);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [quizStarted, setQuizStarted] = useState(false);

  // Learning phase state
  const [currentCard, setCurrentCard] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Profile / stats (mocked but updated after assessments)
  const [completedAssessments, setCompletedAssessments] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScreen('home');
  };

  const topics = [
    { id: 'grammar' as Topic, name: 'Grammar', icon: BookOpen, color: 'from-purple-500 to-violet-600' },
    { id: 'vocabulary' as Topic, name: 'Vocabulary', icon: Brain, color: 'from-cyan-500 to-blue-600' },
    { id: 'speaking' as Topic, name: 'Speaking', icon: Mic, color: 'from-pink-500 to-rose-600' },
    { id: 'listening' as Topic, name: 'Listening', icon: Headphones, color: 'from-emerald-500 to-green-600' },
    { id: 'reading' as Topic, name: 'Reading', icon: FileText, color: 'from-amber-500 to-orange-600' },
    { id: 'writing' as Topic, name: 'Writing', icon: Target, color: 'from-indigo-500 to-purple-600' },
  ];

  const grammarSubTopics = [
    { id: 'all', name: 'All Grammar Topics', description: 'Comprehensive grammar assessment' },
    { id: 'tenses', name: 'Tenses', description: 'Present, Past, Future & Perfect tenses' },
    { id: 'articles', name: 'Articles', description: 'A, An, The usage' },
    { id: 'prepositions', name: 'Prepositions', description: 'In, On, At, By, etc.' },
    { id: 'conditionals', name: 'Conditionals', description: 'If clauses & hypothetical situations' },
    { id: 'passive-voice', name: 'Passive Voice', description: 'Active to passive transformations' },
    { id: 'modals', name: 'Modal Verbs', description: 'Can, Could, Should, Must, etc.' },
    { id: 'reported-speech', name: 'Reported Speech', description: 'Direct & indirect speech' },
  ];

  const quizQuestions: Question[] = [
    {
      id: 1,
      question: 'Which sentence is grammatically correct?',
      options: ["She don't like pizza", "She doesn't likes pizza", "She doesn't like pizza", 'She not like pizza'],
      correctAnswer: 2,
      explanation: 'With third-person singular subjects (she/he/it), use "doesn\'t" + base form of the verb.'
    },
    {
      id: 2,
      question: 'Choose the correct form: "I _____ to London three times."',
      options: ['have been', 'have went', 'has been', 'was'],
      correctAnswer: 0,
      explanation: 'Present perfect ("have been") is used for experiences up to now. "Went" is past simple and cannot follow "have".'
    },
    {
      id: 3,
      question: 'What is the passive form of "They are building a new hospital"?',
      options: ['A new hospital is building by them', 'A new hospital is being built', 'A new hospital has been built', 'A new hospital was built'],
      correctAnswer: 1,
      explanation: 'Present continuous passive = is/are + being + past participle.'
    },
    {
      id: 4,
      question: 'Fill in the blank: "If I _____ rich, I would travel the world."',
      options: ['am', 'was', 'were', 'will be'],
      correctAnswer: 2,
      explanation: 'In second conditional (hypothetical), use "were" for all subjects in the if-clause.'
    },
    {
      id: 5,
      question: 'Which preposition is correct? "She arrived _____ the airport at 6 PM."',
      options: ['in', 'at', 'on', 'by'],
      correctAnswer: 1,
      explanation: 'Use "at" with specific points or locations like airports, stations, and addresses.'
    }
  ];

  const flashCards: FlashCard[] = [
    {
      title: 'Third Person Singular',
      rule: 'With he / she / it, add -s to the verb in positive sentences and use "does/doesn\'t" in questions and negatives.',
      example: 'She doesn\'t like pizza. ✓\nShe don\'t like pizza. ✗',
      tip: 'If the subject is one person/thing (not I or you), the verb usually ends in -s.'
    },
    {
      title: 'Present Perfect Tense',
      rule: 'Use have/has + past participle to talk about experiences and actions that happened at an unspecified time.',
      example: 'I have been to London three times.\nShe has finished her homework.',
      tip: 'Use past participle (been, gone, done) — never the past simple (went, did).'
    },
    {
      title: 'Passive Voice',
      rule: 'Passive = form of "to be" + past participle. Use it when the action matters more than who did it.',
      example: 'Active: They are building a hospital.\nPassive: A hospital is being built.',
      tip: 'Match the tense of "to be" with the tense of the original sentence.'
    },
    {
      title: 'Second Conditional',
      rule: 'Use "If + past simple, would + base verb" for hypothetical or unreal situations in the present/future.',
      example: 'If I were rich, I would travel the world.',
      tip: 'Always use "were" (not "was") in the if-clause — it\'s the subjunctive form.'
    },
    {
      title: 'Prepositions of Place',
      rule: 'AT = specific points (airport, door). IN = enclosed spaces (room, country). ON = surfaces (table, street).',
      example: 'She arrived at the airport.\nThe book is on the table.\nHe lives in Paris.',
      tip: 'Think small → big: AT a point, ON a line/surface, IN a 3D space.'
    },
  ];

  const selectTopic = (topicId: Topic) => setSelectedTopic(topicId);

  const toggleGrammarTopic = (topicId: string) => {
    if (topicId === 'all') {
      setSelectedGrammarTopics(['all']);
    } else {
      setSelectedGrammarTopics(prev => {
        const filtered = prev.filter(t => t !== 'all');
        return filtered.includes(topicId) ? filtered.filter(t => t !== topicId) : [...filtered, topicId];
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setMistakes([]);
    setTimeLeft(900);
  };

  const startAssessment = () => {
    resetQuiz();
    if (selectedTopic === 'grammar') {
      setScreen('grammar-subtopics');
    } else {
      setScreen('quiz');
      setQuizStarted(true);
    }
  };

  const startQuizFromGrammar = () => {
    if (selectedGrammarTopics.length === 0) return;
    resetQuiz();
    setScreen('quiz');
    setQuizStarted(true);
  };

  const finishQuiz = (finalScore: number, finalMistakes: MistakeRecord[]) => {
    setQuizStarted(false);
    setCompletedAssessments(c => c + 1);
    setTotalCorrect(c => c + finalScore);
    setTotalQuestions(c => c + quizQuestions.length);
    setScreen('summary');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    const q = quizQuestions[currentQuestion];
    const isCorrect = answerIndex === q.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    const newMistakes = isCorrect ? mistakes : [...mistakes, { question: q, userAnswer: answerIndex }];

    if (isCorrect) setScore(newScore);
    else setMistakes(newMistakes);

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(newScore, newMistakes);
      }
    }, 1000);
  };

  const goHome = () => {
    setSelectedTopic(null);
    setSelectedGrammarTopics([]);
    setScreen('home');
  };

  const startLearning = () => {
    setCurrentCard(0);
    setCardFlipped(false);
    setScreen('learning');
  };

  useEffect(() => {
    if (!quizStarted || screen !== 'quiz') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, screen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const BgDecor = () => (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" style={{ animation: 'pulse 3s ease-in-out infinite 1.5s' }} />
    </>
  );

  const ProfileButton = () => (
    <button
      onClick={() => setScreen('profile')}
      className="group flex items-center gap-3 bg-card/80 backdrop-blur-xl border border-border hover:border-primary/50 rounded-2xl pl-2 pr-4 py-2 transition-all hover:scale-105"
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-semibold text-white">
        {(name || email || 'L')[0]?.toUpperCase()}
      </div>
      <div className="text-left hidden sm:block">
        <div className="text-sm font-semibold leading-none">{name || 'Learner'}</div>
        <div className="text-xs text-muted-foreground mt-1">View profile</div>
      </div>
    </button>
  );

  // ===== HOME =====
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BgDecor />
        <div className="absolute top-6 right-6 z-20">
          <ProfileButton />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Adaptive AI Tutor
                </h1>
              </div>
              <p className="text-xl text-foreground/80 mb-2">Choose Your Learning Path</p>
              <p className="text-muted-foreground">Select a topic to begin your pre-assessment</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {topics.map((topic) => {
                const Icon = topic.icon;
                const isSelected = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => selectTopic(topic.id)}
                    className={`relative group bg-card border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                      isSelected ? 'border-primary shadow-lg shadow-primary/25' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div className={`w-14 h-14 bg-gradient-to-br ${topic.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{topic.name}</h3>
                    <div className={`w-12 h-1 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted'} transition-colors`} />
                  </button>
                );
              })}
            </div>

            {selectedTopic ? (
              <div className="flex justify-center">
                <button
                  onClick={startAssessment}
                  className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-4 px-12 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 flex items-center gap-3"
                >
                  Start Pre-Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Select a topic to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== GRAMMAR SUBTOPICS =====
  if (screen === 'grammar-subtopics') {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BgDecor />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4 bg-card border border-border rounded-2xl px-6 py-3">
                <BookOpen className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">Grammar Topics</h1>
              </div>
              <p className="text-muted-foreground text-lg">Choose all topics or select specific areas to focus on</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {grammarSubTopics.map((topic) => {
                const isSelected = selectedGrammarTopics.includes(topic.id);
                const isAll = topic.id === 'all';
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleGrammarTopic(topic.id)}
                    className={`relative group bg-card border-2 rounded-2xl p-5 transition-all duration-300 hover:scale-105 text-left ${
                      isSelected
                        ? isAll ? 'border-accent shadow-lg shadow-accent/25' : 'border-primary shadow-lg shadow-primary/25'
                        : 'border-border hover:border-primary/50'
                    } ${isAll ? 'md:col-span-2 lg:col-span-4' : ''}`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className={`w-6 h-6 ${isAll ? 'bg-accent' : 'bg-primary'} rounded-full flex items-center justify-center`}>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                    <h3 className={`font-semibold mb-2 ${isAll ? 'text-xl' : 'text-base'}`}>{topic.name}</h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => setScreen('home')} className="bg-secondary hover:bg-secondary/80 text-foreground py-3 px-8 rounded-xl font-medium transition-all duration-200 hover:scale-105">
                Back
              </button>
              {selectedGrammarTopics.length > 0 && (
                <button onClick={startQuizFromGrammar} className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-3 px-10 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 flex items-center gap-3">
                  Start Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== QUIZ =====
  if (screen === 'quiz') {
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    const currentQ = quizQuestions[currentQuestion];

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BgDecor />
        <div className="relative z-10 min-h-screen px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-mono text-lg font-semibold">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Question <span className="text-foreground font-semibold">{currentQuestion + 1}</span> of {quizQuestions.length}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">Score:</div>
                  <div className="bg-accent/20 text-accent px-4 py-2 rounded-lg font-semibold">
                    {score}/{quizQuestions.length}
                  </div>
                </div>
              </div>
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 mb-6 shadow-2xl shadow-primary/5">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium mb-4">
                  <span>{selectedTopic ? selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1) : 'Quiz'}</span>
                </div>
                <h2 className="text-2xl font-semibold leading-relaxed">{currentQ.question}</h2>
              </div>

              <div className="space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQ.correctAnswer;
                  const showResult = selectedAnswer !== null;

                  let buttonClass = 'bg-secondary hover:bg-secondary/80 border-border hover:border-primary/50';
                  if (showResult) {
                    if (isSelected && isCorrect) buttonClass = 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/25';
                    else if (isSelected && !isCorrect) buttonClass = 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/25';
                    else if (isCorrect) buttonClass = 'bg-emerald-500/20 border-emerald-500';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-5 border-2 rounded-xl transition-all duration-300 hover:scale-[1.01] ${buttonClass} ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-all ${
                            showResult
                              ? isCorrect ? 'bg-emerald-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'
                              : 'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-base">{option}</span>
                        </div>
                        {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                        {showResult && isSelected && !isCorrect && <X className="w-6 h-6 text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedAnswer === null && (
              <div className="text-center text-muted-foreground" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                Select your answer to continue
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== SUMMARY =====
  if (screen === 'summary') {
    const total = quizQuestions.length;
    const percent = Math.round((score / total) * 100);
    const isMaster = score === total;
    const gapTopics = Array.from(new Set(mistakes.map(m => {
      const q = m.question.question.toLowerCase();
      if (q.includes('passive')) return 'Passive Voice';
      if (q.includes('if ')) return 'Conditionals';
      if (q.includes('been') || q.includes('have ')) return 'Present Perfect';
      if (q.includes('preposition') || q.includes('arrived')) return 'Prepositions';
      return 'Subject-Verb Agreement';
    })));

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BgDecor />
        <div className="relative z-10 min-h-screen px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center ${isMaster ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-primary to-accent'}`}>
                {isMaster ? <Trophy className="w-10 h-10 text-white" /> : <Target className="w-10 h-10 text-white" />}
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {isMaster ? "You're a Master!" : 'Assessment Complete'}
              </h1>
              <p className="text-muted-foreground text-lg">
                {isMaster
                  ? 'Perfect score! You\'ve demonstrated full mastery of this topic.'
                  : `We've identified your knowledge gaps. Let's strengthen them together.`}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="text-xs text-muted-foreground mb-2">Score</div>
                <div className="text-3xl font-bold text-primary">{score}/{total}</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="text-xs text-muted-foreground mb-2">Accuracy</div>
                <div className="text-3xl font-bold text-accent">{percent}%</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="text-xs text-muted-foreground mb-2">Mistakes</div>
                <div className="text-3xl font-bold text-rose-400">{mistakes.length}</div>
              </div>
            </div>

            {!isMaster && (
              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Identified Knowledge Gaps</h2>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {gapTopics.map(t => (
                    <span key={t} className="bg-accent/15 text-accent border border-accent/30 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Review your mistakes:</div>
                  {mistakes.map((m, i) => (
                    <div key={i} className="bg-secondary/50 border border-border rounded-xl p-4">
                      <div className="text-sm font-medium mb-3">{m.question.question}</div>
                      <div className="flex flex-col gap-1.5 text-sm mb-3">
                        <div className="flex items-center gap-2 text-rose-400">
                          <X className="w-4 h-4 flex-shrink-0" />
                          <span>Your answer: {m.question.options[m.userAnswer]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span>Correct: {m.question.options[m.question.correctAnswer]}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground bg-background/60 border border-border rounded-lg p-3">
                        💡 {m.question.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={goHome} className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground py-3 px-8 rounded-xl font-medium transition-all hover:scale-105">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
              <button onClick={startLearning} className="group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white py-3 px-10 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                <GraduationCap className="w-5 h-5" />
                Start Learning Phase
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LEARNING (flash cards) =====
  if (screen === 'learning') {
    const card = flashCards[currentCard];
    const progress = ((currentCard + 1) / flashCards.length) * 100;

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BgDecor />
        <div className="relative z-10 min-h-screen px-6 py-10 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <button onClick={goHome} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Home</span>
              </button>
              <div className="inline-flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
                <GraduationCap className="w-5 h-5 text-accent" />
                <span className="font-semibold">Learning Phase</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Card <span className="text-foreground font-semibold">{currentCard + 1}</span> / {flashCards.length}
              </div>
            </div>

            <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-8">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>

            <div
              onClick={() => setCardFlipped(f => !f)}
              className="relative bg-card border border-border rounded-3xl p-10 min-h-[420px] cursor-pointer shadow-2xl shadow-primary/10 hover:border-primary/50 transition-all"
            >
              <div className="absolute top-5 right-5 flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-lg">
                <RotateCw className="w-3.5 h-3.5" />
                {cardFlipped ? 'Front' : 'Tap to flip'}
              </div>

              {!cardFlipped ? (
                <div className="flex flex-col items-center justify-center text-center h-full pt-12">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-accent mb-3 font-semibold">Concept</div>
                  <h2 className="text-3xl font-bold mb-6">{card.title}</h2>
                  <p className="text-foreground/80 text-lg leading-relaxed max-w-xl">{card.rule}</p>
                </div>
              ) : (
                <div className="pt-12 space-y-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-accent mb-2 font-semibold">Example</div>
                    <pre className="font-mono text-base bg-secondary/50 border border-border rounded-xl p-5 whitespace-pre-wrap">{card.example}</pre>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-primary mb-2 font-semibold">Quick Tip</div>
                    <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 text-foreground/90">
                      💡 {card.tip}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => { setCurrentCard(c => Math.max(0, c - 1)); setCardFlipped(false); }}
                disabled={currentCard === 0}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed text-foreground py-3 px-6 rounded-xl font-medium transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex gap-2">
                {flashCards.map((_, i) => (
                  <div key={i} className={`h-2 rounded-full transition-all ${i === currentCard ? 'w-8 bg-primary' : 'w-2 bg-muted'}`} />
                ))}
              </div>

              {currentCard < flashCards.length - 1 ? (
                <button
                  onClick={() => { setCurrentCard(c => c + 1); setCardFlipped(false); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-white py-3 px-6 rounded-xl font-medium transition-all"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={goHome}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  Finish
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== PROFILE =====
  if (screen === 'profile') {
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const initial = (name || email || 'L')[0]?.toUpperCase();

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <BgDecor />
        <div className="relative z-10 min-h-screen px-6 py-10">
          <div className="max-w-4xl mx-auto">
            <button onClick={goHome} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

            <div className="bg-card border border-border rounded-3xl p-8 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white">
                  {initial}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{name || 'Learner'}</h1>
                  <p className="text-muted-foreground">{email || 'learner@example.com'}</p>
                  <div className="inline-flex items-center gap-2 mt-3 bg-accent/15 text-accent border border-accent/30 px-3 py-1 rounded-lg text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Adaptive Learner
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">{completedAssessments}</div>
                <div className="text-xs text-muted-foreground mt-1">Assessments</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-accent" />
                </div>
                <div className="text-2xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground mt-1">Overall Accuracy</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold">{totalCorrect}</div>
                <div className="text-xs text-muted-foreground mt-1">Correct Answers</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-2xl font-bold">{Math.max(1, completedAssessments)}</div>
                <div className="text-xs text-muted-foreground mt-1">Day Streak</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Skill Progress</h2>
              </div>
              <div className="space-y-4">
                {topics.map((t, i) => {
                  const Icon = t.icon;
                  const pct = [accuracy, 45, 30, 20, 60, 15][i] || 0;
                  return (
                    <div key={t.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{t.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${t.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-semibold">Account</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Member since</div>
                  <div className="font-medium">May 2026</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Plan</div>
                  <div className="font-medium">Free</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Target Exam</div>
                  <div className="font-medium">IELTS</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Level</div>
                  <div className="font-medium">Intermediate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== AUTH =====
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-background to-cyan-900/30" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" style={{ animation: 'pulse 3s ease-in-out infinite 1.5s' }} />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:block space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Adaptive AI Tutor
              </h1>
            </div>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Your personal AI-powered English learning platform that adapts to your unique strengths, weaknesses, and learning pace.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Personalized Learning Paths</h3>
                <p className="text-sm text-muted-foreground">AI creates custom lesson plans based on your assessment results</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-Time Adaptation</h3>
                <p className="text-sm text-muted-foreground">Difficulty adjusts automatically as you improve</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Exam Preparation</h3>
                <p className="text-sm text-muted-foreground">IELTS, TOEFL, GRE, SAT and more</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-primary/5">
            <div className="flex gap-2 mb-8 bg-secondary p-1 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isLogin ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  !isLogin ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button type="button" className="text-primary hover:text-primary/80">Forgot password?</button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              {!isLogin && (
                <p className="text-xs text-muted-foreground text-center">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
