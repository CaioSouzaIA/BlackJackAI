import React, { useState, useCallback, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import logo from './assets/logo.png'; // Importação da logo
import background from './assets/background.png'; // Importação do background
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cwuxqvbiypddzggpisvy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dXhxdmJpeXBkZHpnZ3Bpc3Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NjUxMjEsImV4cCI6MjA1NzU0MTEyMX0.vjgX0Wx2nnkABRHpbfuceU6pNllCZMjdr0MgDxE-a5o';
const supabase = createClient(supabaseUrl, supabaseKey);

const resources = {
  en: {
    translation: {
      "Acesse aqui": "Access here",
      "Email": "Email",
      "Senha": "Password",
      "Entrar": "Login",
      "Escolha o Modo": "Choose the Mode",
      "Modo PRO": "PRO Mode",
      "Últimas 15 cartas:": "Last 15 cards:",
      "Reiniciar Contagem": "Reset Count",
      "CARTAS": "CARDS",
      "CONTAGEM": "COUNT",
      "MUITO FAVORÁVEL": "VERY FAVORABLE",
      "FAVORÁVEL": "FAVORABLE",
      "NEUTRO": "NEUTRAL",
      "DESFAVORÁVEL": "UNFAVORABLE",
      "MUITO DESFAVORÁVEL": "VERY UNFAVORABLE",
      "Chance de Vitória": "Winning Chance",
      "Chance de Vitória na Rodada": "Winning Chance in Round",
      "Sugestão de Jogada": "Suggested Play",
      "Sua Mão": "Your Hand",
      "Mão do Dealer": "Dealer's Hand",
      "Reiniciar Mãos": "Reset Hands",
      "Selecione suas cartas abaixo": "Select your cards below",
      "Selecione a carta do dealer": "Select dealer's card",
      "Parar (Stand)": "Stand",
      "Pedir Carta (Hit)": "Hit",
      "Dobrar (Double Down)": "Double Down",
      "Rachar (Split)": "Split",
      "Aguardando cartas": "Waiting for cards"
    },
  },
  es: {
    translation: {
      "Acesse aqui": "Accede aquí",
      "Email": "Correo electrónico",
      "Senha": "Contraseña",
      "Entrar": "Ingresar",
      "Escolha o Modo": "Elige el Modo",
      "Modo PRO": "Modo PRO",
      "Últimas 15 cartas:": "Últimas 15 cartas:",
      "Reiniciar Contagem": "Reiniciar Conteo",
      "CARTAS": "CARTAS",
      "CONTAGEM": "CONTEO",
      "MUITO FAVORÁVEL": "MUY FAVORABLE",
      "FAVORÁVEL": "FAVORABLE",
      "NEUTRO": "NEUTRAL",
      "DESFAVORÁVEL": "DESFAVORABLE",
      "MUITO DESFAVORÁVEL": "MUY DESFAVORABLE",
      "Chance de Vitória": "Probabilidad de Ganar",
      "Chance de Vitória na Rodada": "Probabilidad de Ganar en la Ronda",
      "Sugestão de Jogada": "Jugada Sugerida",
      "Sua Mão": "Tu Mano",
      "Mão do Dealer": "Mano del Dealer",
      "Reiniciar Mãos": "Reiniciar Manos",
      "Selecione suas cartas abaixo": "Selecciona tus cartas abajo",
      "Selecione a carta do dealer": "Selecciona la carta del dealer",
      "Parar (Stand)": "Plantarse",
      "Pedir Carta (Hit)": "Pedir Carta",
      "Dobrar (Double Down)": "Doblar Apuesta",
      "Rachar (Split)": "Dividir",
      "Aguardando cartas": "Esperando cartas"
    },
  },
  pt: {
    translation: {
      "Acesse aqui": "Acesse aqui",
      "Email": "Email",
      "Senha": "Senha",
      "Entrar": "Entrar",
      "Escolha o Modo": "Escolha o Modo",
      "Modo PRO": "Modo PRO",
      "Últimas 15 cartas:": "Últimas 15 cartas:",
      "Reiniciar Contagem": "Reiniciar Contagem",
      "CARTAS": "CARTAS",
      "CONTAGEM": "CONTAGEM",
      "MUITO FAVORÁVEL": "MUITO FAVORÁVEL",
      "FAVORÁVEL": "FAVORÁVEL",
      "NEUTRO": "NEUTRO",
      "DESFAVORÁVEL": "DESFAVORÁVEL",
      "MUITO DESFAVORÁVEL": "MUITO DESFAVORÁVEL",
      "Chance de Vitória": "Chance de Vitória",
      "Chance de Vitória na Rodada": "Chance de Vitória na Rodada",
      "Sugestão de Jogada": "Sugestão de Jogada",
      "Sua Mão": "Sua Mão",
      "Mão do Dealer": "Mão do Dealer",
      "Reiniciar Mãos": "Reiniciar Mãos",
      "Selecione suas cartas abaixo": "Selecione suas cartas abaixo",
      "Selecione a carta do dealer": "Selecione a carta do dealer",
      "Parar (Stand)": "Parar (Stand)",
      "Pedir Carta (Hit)": "Pedir Carta (Hit)",
      "Dobrar (Double Down)": "Dobrar (Double Down)",
      "Rachar (Split)": "Rachar (Split)",
      "Aguardando cartas": "Aguardando cartas"
    },
  },
};

// Inicialização do i18next
i18n.use(initReactI18next).init({
  resources,
  lng: 'pt', // Idioma padrão: Português-Brasil
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

const TOTAL_DECKS = 8;
const CARDS_PER_DECK = 52;
const CARDS_PER_SUIT = 13;
const CARDS_PER_VALUE = 32; // 4 cartas por baralho * 8 baralhos

// Função para obter o valor da carta na contagem Hi-Lo
const getCardValue = (card) => {
  const value = card % CARDS_PER_SUIT + 1;
  if (value >= 2 && value <= 6) return 1;
  if (value >= 10 || value === 1) return -1;
  return 0;
};

// Função para determinar a cor do status
const getStatusColor = (status) => {
  switch (status) {
    case "MUITO FAVORÁVEL": return "bg-green-600";
    case "FAVORÁVEL": return "bg-green-400";
    case "NEUTRO": return "bg-yellow-400";
    case "DESFAVORÁVEL": return "bg-orange-500";
    case "MUITO DESFAVORÁVEL": return "bg-red-500";
    default: return "bg-yellow-400";
  }
};

// Função para determinar a porcentagem de vitória
const getWinPercentage = (status) => {
  // Baseado em estudos de vantagem do jogador vs contagem verdadeira
  // Fonte: https://www.blackjackapprenticeship.com/card-counting/
  
  switch (status) {
    case "MUITO FAVORÁVEL": return "55-58%"; // Contagem +5 ou mais
    case "FAVORÁVEL": return "52-55%";       // Contagem +3 a +4
    case "NEUTRO": return "49-52%";          // Contagem 0
    case "DESFAVORÁVEL": return "46-49%";    // Contagem -3 a -4
    case "MUITO DESFAVORÁVEL": return "43-46%"; // Contagem -5 ou menos
    default: return "49-52%";
  }
};

// Função para obter o valor da mão do jogador
const getHandValue = (hand, cardValues) => {
  if (!hand.length) return 0;
  
  let value = 0;
  let aces = 0;
  
  for (const cardIndex of hand) {
    const cardValue = cardIndex % 13 + 1;
    
    if (cardValue === 1) {
      // Ás
      value += 11;
      aces++;
    } else if (cardValue >= 10) {
      // 10, J, Q, K
      value += 10;
    } else {
      // 2-9
      value += cardValue;
    }
  }
  
  // Ajuste para Ases (A pode valer 1 ou 11)
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
};

// Função para obter o valor da carta do dealer
const getDealerCardValue = (dealerHand, cardValues) => {
  if (!dealerHand.length) return 0;
  
  const cardIndex = dealerHand[0];
  const cardValue = cardIndex % 13 + 1;
  
  if (cardValue === 1) {
    // Ás
    return 11;
  } else if (cardValue >= 10) {
    // 10, J, Q, K
    return 10;
  } else {
    // 2-9
    return cardValue;
  }
};

// Função para verificar se a mão tem um par
const hasPair = (hand) => {
  if (hand.length !== 2) return false;
  
  const card1Value = hand[0] % 13 + 1;
  const card2Value = hand[1] % 13 + 1;
  
  // Para pares, consideramos se os valores de carta são iguais
  // Se for 10, J, Q, K (todos valem 10), verificamos se ambos são exatamente o mesmo valor
  if ((card1Value >= 10 && card2Value >= 10) && card1Value !== card2Value) {
    return false;
  }
  
  return card1Value === card2Value;
};

// Função para obter a sugestão baseada na tabela de estratégia
const getBlackjackSuggestion = (playerHand, dealerHand, cardValues) => {
  if (!playerHand.length || !dealerHand.length) return null;
  
  const playerValue = getHandValue(playerHand, cardValues);
  const dealerValue = getDealerCardValue(dealerHand, cardValues);
  
  // Converter o valor da carta do dealer para o índice da coluna na tabela
  let dealerColumn;
  if (dealerValue === 11) {
    dealerColumn = 9; // Ás (última coluna)
  } else {
    dealerColumn = dealerValue - 2; // 2 a 10 (subtrair 2 para obter índice 0-8)
  }
  
  // Verificar se é um par
  if (hasPair(playerHand)) {
    const pairValue = playerHand[0] % 13 + 1;
    
    // Pares
    if (pairValue === 1) return "R"; // AA
    if (pairValue === 8) return "R"; // 88
    if (pairValue === 10 || pairValue >= 11) return "P"; // 10 10, JJ, QQ, KK
    if (pairValue === 9) {
      if (dealerColumn === 6 || dealerColumn >= 8) return "P"; // 99 vs 7, 10, A
      return "R"; // 99 vs outros valores
    }
    if (pairValue === 7) {
      if (dealerColumn >= 7) return "C"; // 77 vs 8+
      return "R"; // 77 vs outros valores
    }
    if (pairValue === 6) {
      if (dealerColumn >= 6) return "C"; // 66 vs 7+
      return "R"; // 66 vs outros valores
    }
    if (pairValue === 5) {
      if (dealerColumn >= 8) return "C"; // 55 vs 10, A
      return "D"; // 55 vs outros valores
    }
    if (pairValue === 4) return "C"; // 44
    if (pairValue === 3 || pairValue === 2) {
      if (dealerColumn >= 7) return "C"; // 33, 22 vs 8+
      return "R"; // 33, 22 vs outros valores
    }
  }
  
  // Mão suave (com um Ás contado como 11)
  const hasAce = playerHand.some(cardIndex => (cardIndex % 13 + 1) === 1);
  if (hasAce && playerValue <= 21 && playerValue - 10 <= 10) {
    const softValue = playerValue - 11; // Valor sem contar o Ás como 11
    
    if (softValue >= 8) return "P"; // A8, A9, A10
    if (softValue === 7) {
      if (dealerColumn >= 7) return "C"; // A7 vs 8+
      if (dealerColumn >= 2 && dealerColumn <= 5) return "D"; // A7 vs 3-6
      return "P"; // A7 vs 2, 7
    }
    if (softValue === 6) {
      if (dealerColumn >= 6) return "C"; // A6 vs 7+
      return "D"; // A6 vs 2-6
    }
    if (softValue === 5 || softValue === 4) {
      if (dealerColumn >= 6) return "C"; // A5, A4 vs 7+
      if (dealerColumn >= 2) return "D"; // A5, A4 vs 3-6
      return "C"; // A5, A4 vs 2
    }
    if (softValue === 3 || softValue === 2) {
      if (dealerColumn >= 6) return "C"; // A3, A2 vs 7+
      if (dealerColumn >= 3) return "D"; // A3, A2 vs 4-6
      return "C"; // A3, A2 vs 2-3
    }
  }
  
  // Mão dura (sem Ás ou com Ás contado como 1)
  if (playerValue >= 17) return "P"; // 17+
  if (playerValue >= 13 && playerValue <= 16) {
    if (dealerColumn >= 6) return "C"; // 13-16 vs 7+
    return "P"; // 13-16 vs 2-6
  }
  if (playerValue === 12) {
    if (dealerColumn <= 2 || dealerColumn >= 6) return "C"; // 12 vs 2-3, 7+
    return "P"; // 12 vs 4-6
  }
  if (playerValue === 11) {
    if (dealerColumn === 9) return "C"; // 11 vs A
    return "D"; // 11 vs todos os outros
  }
  if (playerValue === 10) {
    if (dealerColumn >= 8) return "C"; // 10 vs 10, A
    return "D"; // 10 vs 2-9
  }
  if (playerValue === 9) {
    if (dealerColumn <= 1 || dealerColumn >= 6) return "C"; // 9 vs 2, 7+
    return "D"; // 9 vs 3-6
  }
  
  // 5-8
  return "C";
};

// Função para converter a sigla da sugestão para texto completo
const getSuggestionText = (suggestion, t) => {
  switch (suggestion) {
    case "P": return t("Parar (Stand)");
    case "C": return t("Pedir Carta (Hit)");
    case "D": return t("Dobrar (Double Down)");
    case "R": return t("Rachar (Split)");
    default: return t("Aguardando cartas");
  }
};

// Função para calcular a probabilidade de vitória baseada na mão atual
const calculateWinProbability = (playerHand, dealerHand, cardValues) => {
  if (!playerHand.length || !dealerHand.length) return "0%";
  
  const playerValue = getHandValue(playerHand, cardValues);
  const dealerValue = getDealerCardValue(dealerHand, cardValues);
  
  // Probabilidades aproximadas baseadas em simulações
  if (playerValue === 21) {
    if (dealerValue === 11) return "85%"; // Blackjack vs Ás (dealer pode ter blackjack também)
    return "90%"; // Blackjack vs outra carta
  }
  
  if (playerValue >= 19) {
    if (dealerValue >= 10) return "65%";
    return "75%";
  }
  
  if (playerValue >= 17) {
    if (dealerValue >= 10) return "50%";
    if (dealerValue >= 7) return "60%";
    return "70%";
  }
  
  if (playerValue >= 13) {
    if (dealerValue >= 10) return "35%";
    if (dealerValue >= 7) return "45%";
    return "60%";
  }
  
  if (playerValue >= 11) {
    if (dealerValue >= 10) return "40%";
    if (dealerValue >= 7) return "50%";
    return "55%";
  }
  
  // Mãos fracas
  if (dealerValue >= 10) return "30%";
  if (dealerValue >= 7) return "35%";
  return "45%";
};

// Componente para exibir uma carta
const CardDisplay = ({ value, onClick, remaining }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-lg shadow-lg w-24 h-36 flex flex-col relative m-2 border-2 ${
      remaining <= 0 ? "border-red-500 bg-gray-200" : "border-gray-200"
    }`}
    disabled={remaining <= 0}
  >
    {/* Valor restante da carta */}
    <div className="absolute top-1 right-2 text-sm text-gray-600">{remaining}</div>
    <div className="flex-1 flex items-center justify-center">
      <span className="text-4xl font-bold">{value}</span>
    </div>
  </button>
);

// Componente para mostrar uma carta selecionada na mão
const HandCardDisplay = ({ value, onRemove }) => (
  <div className="bg-white rounded-lg shadow-lg w-20 h-32 flex flex-col relative m-2 border-2 border-gray-300">
    <button 
      onClick={onRemove} 
      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
    >
      ×
    </button>
    <div className="flex-1 flex items-center justify-center">
      <span className="text-3xl font-bold">{value}</span>
    </div>
  </div>
);

// Componente para selecionar carta para a mão
const HandCardSelector = ({ onSelectCard, cardValues, remainingCards }) => (
  <div className="grid grid-cols-4 gap-1 mt-2">
    {cardValues.map((value, i) => (
      <button
        key={i}
        onClick={() => remainingCards[i] > 0 && onSelectCard(i)}
        className={`px-2 py-1 rounded-md text-lg ${
          remainingCards[i] > 0 
            ? "bg-blue-100 hover:bg-blue-200" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        disabled={remainingCards[i] <= 0}
      >
        {value}
      </button>
    ))}
  </div>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Verifica se existe uma sessão ativa
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setCurrentUser(session.user);
      }
    };
    
    checkSession();
    
    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setIsLoggedIn(true);
          setCurrentUser(session.user);
        }
        if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setCurrentUser(null);
          setSelectedMode(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedMode(null);
  };

  const handleModeSelection = (mode) => {
    setSelectedMode(mode);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (selectedMode === null) {
    return <ModeSelectionScreen onModeSelect={handleModeSelection} onLogout={handleLogout} user={currentUser} />;
  }

  return <BlackjackApp onLogout={handleLogout} user={currentUser} />;
};

// Tela de Login
const LoginScreen = ({ onLogin }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t, i18n } = useTranslation();

  const validateLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      
      if (error) throw error;
      
      onLogin(data.user);
    } catch (error) {
      console.error('Erro de login:', error);
      setErrorMessage(t('Email ou senha inválidos. Tente novamente.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateLogin();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  // Obter o idioma atual e a bandeira correspondente
  const currentLanguage = i18n.language;
  const languageFlags = {
    pt: "🇧🇷 Português",
    en: "🇺🇸 English",
    es: "🇪🇸 Español",
  };
  const currentFlag = languageFlags[currentLanguage] || "🌐 Idioma";

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Botão de Seleção de Idioma */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
          className="bg-white text-gray-700 hover:text-gray-900 font-bold py-2 px-4 rounded-full border border-gray-300 hover:border-gray-400 transition duration-300"
          style={{ borderRadius: '15px' }}
        >
          {currentFlag}
        </button>

        {/* Lista de Idiomas */}
        {isLanguageMenuOpen && (
          <div className="absolute top-12 right-4 bg-white rounded-lg shadow-lg p-2 z-10" style={{ width: '180px' }}>
            <button
              onClick={() => changeLanguage('pt')}
              className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded transition duration-300"
            >
              🇧🇷 Português
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded transition duration-300"
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded transition duration-300"
            >
              🇪🇸 Español
            </button>
          </div>
        )}
      </div>

      {/* Container Central */}
      <div className="flex flex-col items-center">
        {/* Logomarca */}
        <img
          src={logo}
          alt="Logo"
          className="w-full max-w-md h-auto mb-8"
        />

        {/* Área de Login */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('Acesse aqui')}</h1>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo de Email */}
            <div className="mb-4">
              <input
                type="email"
                placeholder={t('Email')}
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#7400ff] rounded-lg focus:outline-none focus:border-[#ff7400]"
                disabled={isLoading}
                required
              />
            </div>

            {/* Campo de Senha */}
            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('Senha')}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-2 border-2 border-[#7400ff] rounded-lg focus:outline-none focus:border-[#ff7400]"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              className="w-full bg-gradient-to-br from-[#7400ff] to-[#ff7400] text-white py-2 rounded-lg font-bold hover:opacity-90 transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw size={20} className="animate-spin mr-2" />
                  {t('Entrando...')}
                </div>
              ) : (
                t('Entrar')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Tela de Seleção de Modo
const ModeSelectionScreen = ({ onModeSelect, onLogout, user }) => {
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  // Obter o idioma atual e a bandeira correspondente
  const currentLanguage = i18n.language;
  const languageFlags = {
    pt: "🇧🇷 Português",
    en: "🇺🇸 English",
    es: "🇪🇸 Español",
  };
  const currentFlag = languageFlags[currentLanguage] || "🌐 Idioma";

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Botão de Seleção de Idioma */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onLogout}
          className="bg-red-500 text-white hover:bg-red-600 font-bold py-2 px-4 rounded-full transition duration-300"
        >
          {t('Sair')}
        </button>
        
        <button
          onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
          className="bg-white text-gray-700 hover:text-gray-900 font-bold py-2 px-4 rounded-full border border-gray-300 hover:border-gray-400 transition duration-300"
          style={{ borderRadius: '15px' }}
        >
          {currentFlag}
        </button>

        {/* Lista de Idiomas */}
        {isLanguageMenuOpen && (
          <div className="absolute top-12 right-4 bg-white rounded-lg shadow-lg p-2 z-10" style={{ width: '180px' }}>
            <button
              onClick={() => changeLanguage('pt')}
              className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded transition duration-300"
            >
              🇧🇷 Português
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded transition duration-300"
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className="flex items-center w-full py-2 px-4 hover:bg-gray-100 rounded transition duration-300"
            >
              🇪🇸 Español
            </button>
          </div>
        )}
      </div>

      {/* Container Central */}
      <div className="flex flex-col items-center">
        {/* Logomarca */}
        <img
          src={logo}
          alt="Logo"
          className="w-full max-w-md h-auto mb-8"
        />

        {/* Saudação ao usuário */}
        {user && (
          <div className="mb-4 text-white text-center bg-black bg-opacity-50 p-2 rounded-lg">
            {t('Olá')}, {user.email}!
          </div>
        )}

        {/* Área de Seleção de Modo */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">{t('Escolha o Modo')}</h1>

          <div className="flex flex-col gap-4">
            {/* Botão PRO */}
            <button
              onClick={() => onModeSelect('PRO')}
              className="w-full bg-gradient-to-br from-[#7400ff] to-[#ff7400] text-white py-2 rounded-lg font-bold hover:opacity-90 transition"
            >
              {t('Modo PRO')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blackjack App (Modo PRO, anteriormente AMATEUR)
const BlackjackApp = () => {
  const [count, setCount] = useState(0);
  const [cardHistory, setCardHistory] = useState([]);
  const [totalCards, setTotalCards] = useState(TOTAL_DECKS * CARDS_PER_DECK);
  const [remainingCards, setRemainingCards] = useState(() => {
    const cards = {};
    for (let i = 0; i < 13; i++) {
      cards[i] = CARDS_PER_VALUE;
    }
    return cards;
  });
  
  // Estados para as mãos do jogador e do dealer
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);

  const handleCardClick = useCallback((cardIndex) => {
    if (remainingCards[cardIndex] > 0) {
      updateCountAndHistory(cardIndex);
    }
  }, [remainingCards]);
  
  const updateCountAndHistory = (cardIndex) => {
    setCount((prev) => prev + getCardValue(cardIndex));
    setCardHistory((prev) => [cardIndex, ...prev].slice(0, 15));
    setRemainingCards((prev) => ({
      ...prev,
      [cardIndex]: prev[cardIndex] - 1,
    }));
    setTotalCards((prev) => prev - 1);
  };

  const reset = useCallback(() => {
    setCount(0);
    setCardHistory([]);
    setTotalCards(TOTAL_DECKS * CARDS_PER_DECK);
    setRemainingCards(() => {
      const cards = {};
      for (let i = 0; i < 13; i++) {
        cards[i] = CARDS_PER_VALUE;
      }
      return cards;
    });
    setPlayerHand([]);
    setDealerHand([]);
  }, []);
  
  const resetHands = useCallback(() => {
    setPlayerHand([]);
    setDealerHand([]);
  }, []);
  
  // Adicionar carta à mão do jogador
  const addCardToPlayerHand = useCallback((cardIndex) => {
    if (playerHand.length < 2 && remainingCards[cardIndex] > 0) {
      setPlayerHand(prev => [...prev, cardIndex]);
      updateCountAndHistory(cardIndex);
    }
  }, [playerHand, remainingCards]);
  
  // Adicionar carta à mão do dealer
  const addCardToDealerHand = useCallback((cardIndex) => {
    if (dealerHand.length < 1 && remainingCards[cardIndex] > 0) {
      setDealerHand(prev => [...prev, cardIndex]);
      updateCountAndHistory(cardIndex);
    }
  }, [dealerHand, remainingCards]);
  
  // Remover carta da mão do jogador
  const removeCardFromPlayerHand = useCallback((index) => {
    setPlayerHand(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  // Remover carta da mão do dealer
  const removeCardFromDealerHand = useCallback((index) => {
    setDealerHand(prev => prev.filter((_, i) => i !== index));
  }, []);

  const calculateOdds = useCallback(() => {
    // Calcular decks restantes e contagem real
    const decksRemaining = totalCards / CARDS_PER_DECK;
    const trueCount = count / decksRemaining;
  
    if (trueCount > 2) return "MUITO FAVORÁVEL";
    if (trueCount > 1) return "FAVORÁVEL";
    if (trueCount < -2) return "MUITO DESFAVORÁVEL";
    if (trueCount < -1) return "DESFAVORÁVEL";
    return "NEUTRO";
  }, [count, totalCards]);

  const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const { t } = useTranslation();
  const status = calculateOdds();
  
  // Obter sugestão de jogada baseada na estratégia básica
  const suggestion = getBlackjackSuggestion(playerHand, dealerHand, cardValues);
  const suggestionText = getSuggestionText(suggestion, t);
  
  // Calcular probabilidade de vitória na rodada
  const winProbability = calculateWinProbability(playerHand, dealerHand, cardValues);
  
  const getWinProbabilityColor = (probability) => {
    // Extrair apenas o número da string (por exemplo, "65%" -> 65)
    const value = parseInt(probability);
    
    if (value === 0) return "bg-gray-500"; // Zero fica cinza
    if (value > 50) return "bg-green-500"; // Maior que 50% fica verde
    if (value < 50) return "bg-red-500";   // Menor que 50% fica vermelho
    return "bg-yellow-400";
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center"
      style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-6xl mx-auto text-center flex">
        {/* Contador principal (70% da largura) */}
        <div className="w-7/10 mr-4">
          {/* Contador */}
          <div className="bg-green-700 rounded-xl p-8 border-4 border-white inline-block">
            <div className="flex justify-between mb-8">
              <div className="text-white">
                <div className="text-xl font-bold">{t('CARTAS')}</div>
                <div className="text-3xl">{totalCards}</div>
              </div>
              <div className="text-white text-center">
                <div className="text-xl font-bold">{t('CONTAGEM')}</div>
                <div className="text-3xl">{count}</div>
              </div>
              <div className="text-white text-center">
                <div className="text-xl font-bold">{t(status)}</div>
                <div className={`w-8 h-8 mx-auto mt-2 rounded border-2 border-white ${getStatusColor(status)}`} style={{ borderRadius: '5px' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-6">
              {cardValues.slice(0, 7).map((value, i) => (
                <CardDisplay
                  key={i}
                  value={value}
                  onClick={() => handleCardClick(i)}
                  remaining={remainingCards[i]}
                />
              ))}
            </div>
            <div className="grid grid-cols-6 gap-4">
              {cardValues.slice(7).map((value, i) => (
                <CardDisplay
                  key={i + 7}
                  value={value}
                  onClick={() => handleCardClick(i + 7)}
                  remaining={remainingCards[i + 7]}
                />
              ))}
            </div>
          </div>

          {/* Histórico e Porcentagem de Vitória - Agora com a mesma largura do contador */}
          <div className="mt-6 bg-white rounded-lg p-6">
            {/* Porcentagem de Vitória */}
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold mb-2">{t('Chance de Vitória')}</h3>
              <div className={`text-2xl font-bold ${getStatusColor(status)} py-2 px-4 rounded`}>
                {getWinPercentage(status)}
              </div>
            </div>
            
            {/* Chance de vitória na rodada */}
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold mb-2">{t('Chance de Vitória na Rodada')}</h3>
              <div className={`text-2xl font-bold ${getWinProbabilityColor(winProbability)} text-white py-2 px-4 rounded`}>
                {winProbability}
              </div>
            </div>
            
            {/* Sugestão de Jogada */}
            <div className="mb-4 text-center">
              <h3 className="text-lg font-bold mb-2">{t('Sugestão de Jogada')}</h3>
              <div className="text-2xl font-bold bg-purple-500 text-white py-2 px-4 rounded">
                {suggestionText}
              </div>
            </div>

            {/* Histórico */}
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">{t('Últimas 15 cartas:')}</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {cardHistory.map((cardIndex, i) => (
                  <div key={i} className="px-4 py-2 bg-gray-100 rounded-lg text-lg">
                    {cardValues[cardIndex]}
                  </div>
                ))}
              </div>
            </div>

            {/* Botão para Reiniciar Contagem */}
            <button
              onClick={reset}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center text-lg"
            >
              <RefreshCw size={20} className="mr-2" />
              {t('Reiniciar Contagem')}
            </button>
          </div>
        </div>
        
        {/* Área da mão do jogador e dealer (30% da largura) */}
        <div className="w-3/10">
          <div className="bg-green-700 rounded-xl p-6 border-4 border-white h-full flex flex-col justify-between">
            {/* Mão do Jogador */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{t('Sua Mão')}</h3>
              <div className="flex justify-center mb-2">
                {playerHand.length > 0 ? (
                  playerHand.map((cardIndex, i) => (
                    <HandCardDisplay 
                      key={i} 
                      value={cardValues[cardIndex]} 
                      onRemove={() => removeCardFromPlayerHand(i)} 
                    />
                  ))
                ) : (
                  <div className="bg-white bg-opacity-20 rounded-lg w-full h-32 flex items-center justify-center text-white border-2 border-white border-dashed">
                    <span>{playerHand.length === 0 ? t("Selecione suas cartas abaixo") : ""}</span>
                  </div>
                )}
              </div>
              <HandCardSelector 
                onSelectCard={addCardToPlayerHand} 
                cardValues={cardValues} 
                remainingCards={remainingCards} 
              />
            </div>
            
            {/* Mão do Dealer */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{t('Mão do Dealer')}</h3>
              <div className="flex justify-center mb-2">
                {dealerHand.length > 0 ? (
                  dealerHand.map((cardIndex, i) => (
                    <HandCardDisplay 
                      key={i} 
                      value={cardValues[cardIndex]} 
                      onRemove={() => removeCardFromDealerHand(i)} 
                    />
                  ))
                ) : (
                  <div className="bg-white bg-opacity-20 rounded-lg w-full h-32 flex items-center justify-center text-white border-2 border-white border-dashed">
                    <span>{dealerHand.length === 0 ? t("Selecione a carta do dealer") : ""}</span>
                  </div>
                )}
              </div>
              <HandCardSelector 
                onSelectCard={addCardToDealerHand} 
                cardValues={cardValues} 
                remainingCards={remainingCards}
              />
            </div>
            
            {/* Botão para Reiniciar Mãos */}
            <button
              onClick={resetHands}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center text-lg mt-auto"
            >
              <RefreshCw size={20} className="mr-2" />
              {t('Reiniciar Mãos')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;