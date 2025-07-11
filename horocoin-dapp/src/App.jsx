import React, { useState, useEffect } from 'react';
import { Star, Coins, Calendar, Wallet, CheckCircle, Sparkles, Globe } from 'lucide-react';
import { 
  createNetworkConfig, 
  SuiClientProvider, 
  WalletProvider,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  ConnectButton,
  useCurrentWallet
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

// Network configuration
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
});

const queryClient = new QueryClient();

// Sui configuration - Use environment variables with fallbacks
const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const TREASURY_ID = import.meta.env.VITE_TREASURY_ID;
const CLAIMS_ID = import.meta.env.VITE_CLAIMS_ID;
const PROGRESS_REGISTRY_ID = import.meta.env.VITE_PROGRESS_REGISTRY_ID;
const ADMIN_CAP_ID = import.meta.env.VITE_ADMIN_CAP_ID;

// Debug: Log the contract addresses
console.log('🔍 Contract addresses:', {
  PACKAGE_ID,
  TREASURY_ID, 
  CLAIMS_ID,
  PROGRESS_REGISTRY_ID,
  ADMIN_CAP_ID
});

// Language Support
const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇨🇴' },
  zh: { name: '中文', flag: '🇨🇳' },
  'zh-TR': { name: '繁體中文', flag: '🇹🇼' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  fr: { name: 'Français', flag: '🇫🇷' },
  pt: { name: 'Português', flag: '🇧🇷' } 
};

// Translations
const TRANSLATIONS = {
  en: {
    // Main UI
    dailyHoro: `Daily $HORO`,
    chooseZodiacSystem: `Choose Your Zodiac System`,
    chooseWesternZodiac: `Choose Your Western Zodiac Sign`,
    chooseChineseZodiac: `Choose Your Chinese Zodiac Sign`,
    western: `Western`,
    chinese: `Chinese`,
    weeklyProgress: `Weekly Progress`,
    todayVisitRecorded: `✓ Today's claim recorded!`,
    alreadyClaimedOnChain: `✅ Already claimed today (verified on blockchain)`,
    dailyReading: `Daily Reading`,
    dailyReward: `Daily $HORO Reward`,
    earnDailyHoro: `Earn {amount} $HORO today!`,
    todayRewardEarned: `✅ Today's {amount} $HORO earned!`,
    checkInToday: `Check-in & Earn $HORO`,
    checkingIn: `Earning $HORO...`,
    claiming: `Claiming...`,
    verifyingClaim: `Verifying claim status...`,
    streakBonus: `Streak Bonus`,
    daysStreak: `{days} day streak`,
    baseReward: `Base reward: {amount} $HORO`,
    bonusReward: `Streak bonus: +{amount} $HORO`,
    totalDailyReward: `Total today: {amount} $HORO`,
    blockchainTransaction: `This will create a blockchain transaction and transfer real $HORO tokens to your wallet!`,
    rewardsClaimedTitle: `✅ Rewards Claimed!`,
    rewardsClaimed: `You've already claimed your $HORO tokens this week.`,
    comeBackMonday: `Come back next Monday to start a new week!`,
    connectWalletButton: `Connect Wallet`,
    connectWallet: `Connect your wallet to automatically track your daily visits and claim $HORO rewards!`,
    connectSuietWallet: `Connect Wallet`,
    connectSuietWalletTitle: `Connect Wallet`,
    connectSuietPrompt: `Connect your wallet to automatically track your daily visits and claim $HORO rewards with cryptographic security!`,
    suietWalletSecure: `Secure wallet with message signing`,
    whySuiet: `Why Connect Wallet?`,
    suietBenefitSigning: `Supports cryptographic message signing`,
    suietBenefitSecurity: `Enhanced security for NFT airdrops`,
    suietBenefitFraud: `Prevents check-in fraud`,
    suietBenefitCompatibility: `Best compatibility with $HORO features`,
    dontHaveSuiet: `Don't have wallet?`,
    downloadSuiet: `Download Wallet →`,
    useSuietForSigning: `Please use your wallet for secure message signing`,
    autoSigning: `Automatically signing today's visit... ✨`,
    transitioningToZodiac: `Transitioning to zodiac selection...`,
    wallet: `Wallet`,
    
    // Loading States
    connecting: `Connecting...`,
    signing: `Signing...`,
    loading: `Loading...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 This app uses Sui Testnet`,
    testnetExplainer: `Testnet tokens have no real monetary value. This is a safe environment to learn and earn virtual $HORO tokens!`,
    learnMoreSuiet: `Learn how to install wallet`,
    needHelp: `Need help?`,
    
    // Gas Management
    gasLow: `⛽ Low Gas Balance`,
    gasNeeded: `Please add testnet SUI to your wallet for transactions`,
    getFreeGas: `Open Testnet Faucet`,
    gettingGas: `Opening faucet...`,
    gasSuccess: `✅ Free testnet SUI added to your wallet!`,
    gasError: `❌ Failed to open faucet. Please visit faucet.testnet.sui.io manually.`,
    gasBalance: `Gas Balance`,
    sufficientGas: `✅ Sufficient gas for transactions`,
    
    // Footer
    about: `About`,
    tokenomics: `Tokenomics`,
    help: `Help`,
    reset: `Reset`,
    
    // Claim Status Messages
    alreadyClaimedToday: `Already Claimed Today!`,
    alreadyClaimedMessage: `You've earned your daily $HORO! Come back tomorrow.`,
    nextClaimAvailable: `Next claim available: Tomorrow`,
    claimTodaysHoro: `🎁 Claim Today's $HORO`,
    missedDays: `Missed Days`,
    completedDays: `Completed Days`,
    claimedAmountToday: `Claimed {amount} $HORO today!`,
    completed: `Completed`,
    missed: `Missed`,
    available: `Available`,
    future: `Future`,
    
    // Network Status
    connected: `Connected`,
    connectionVerified: `Connection to Sui Testnet verified`,
    refreshStatus: `Refresh Status`,
    
    // Days of the Week
    sunday: `Sun`,
    monday: `Mon`, 
    tuesday: `Tue`,
    wednesday: `Wed`,
    thursday: `Thu`,
    friday: `Fri`,
    saturday: `Sat`,
    
    // Zodiac Signs
    aries: `aries`,
    taurus: `taurus`, 
    gemini: `gemini`,
    cancer: `cancer`,
    leo: `leo`,
    virgo: `virgo`,
    libra: `libra`,
    scorpio: `scorpio`,
    sagittarius: `sagittarius`,
    capricorn: `capricorn`,
    aquarius: `aquarius`,
    pisces: `pisces`,
    
    // Chinese Zodiac
    rat: `rat`,
    ox: `ox`,
    tiger: `tiger`, 
    rabbit: `rabbit`,
    dragon: `dragon`,
    snake: `snake`,
    horse: `horse`,
    goat: `goat`,
    monkey: `monkey`,
    rooster: `rooster`,
    dog: `dog`,
    pig: `pig`,
    
    // Elements
    water: `Water`,
    earth: `Earth`, 
    wood: `Wood`,
    fire: `Fire`,
    metal: `Metal`
  },
  es: {
    // Main UI
    dailyHoro: `$HORO Diario`,
    chooseZodiacSystem: `Elige Tu Sistema Zodiacal`,
    chooseWesternZodiac: `Elige Tu Signo Zodiacal Occidental`,
    chooseChineseZodiac: `Elige Tu Signo Zodiacal Chino`,
    western: `Occidental`,
    chinese: `Chino`,
    weeklyProgress: `Progreso Semanal`,
    todayVisitRecorded: `✓ ¡Reclamo de hoy registrado!`,
    alreadyClaimedOnChain: `✅ Ya reclamado hoy (verificado en blockchain)`,
    dailyReading: `Lectura Diaria`,
    dailyReward: `Recompensa $HORO Diaria`,
    earnDailyHoro: `¡Gana {amount} $HORO hoy!`,
    todayRewardEarned: `✅ ¡{amount} $HORO de hoy ganados!`,
    checkInToday: `Registrarse y Ganar $HORO`,
    checkingIn: `Ganando $HORO...`,
    claiming: `Reclamando...`,
    verifyingClaim: `Verificando estado del reclamo...`,
    streakBonus: `Bono de Racha`,
    daysStreak: `racha de {days} días`,
    baseReward: `Recompensa base: {amount} $HORO`,
    bonusReward: `Bono de racha: +{amount} $HORO`,
    totalDailyReward: `Total hoy: {amount} $HORO`,
    blockchainTransaction: `¡Esto creará una transacción blockchain y transferirá tokens $HORO reales a tu billetera!`,
    rewardsClaimedTitle: `✅ ¡Recompensas Reclamadas!`,
    rewardsClaimed: `Ya has reclamado tus tokens $HORO esta semana.`,
    comeBackMonday: `¡Vuelve el próximo lunes para comenzar una nueva semana!`,
    connectWalletButton: `Conectar Billetera`,
    connectWallet: `¡Conecta tu billetera para rastrear automáticamente tus visitas diarias y reclamar recompensas $HORO!`,
    connectSuietWallet: `Conectar Billetera`,
    connectSuietWalletTitle: `Conectar Billetera`,
    connectSuietPrompt: `¡Conecta tu billetera para rastrear automáticamente tus visitas diarias y reclamar recompensas $HORO con seguridad criptográfica!`,
    suietWalletSecure: `Billetera segura con firma de mensajes`,
    whySuiet: `¿Por qué Conectar Billetera?`,
    suietBenefitSigning: `Soporta firma criptográfica de mensajes`,
    suietBenefitSecurity: `Seguridad mejorada para airdrops de NFT`,
    suietBenefitFraud: `Previene fraude en el registro`,
    suietBenefitCompatibility: `Mejor compatibilidad con características $HORO`,
    dontHaveSuiet: `¿No tienes billetera?`,
    downloadSuiet: `Descargar Billetera →`,
    useSuietForSigning: `Por favor usa tu billetera para firma segura de mensajes`,
    autoSigning: `Firmando automáticamente la visita de hoy... ✨`,
    transitioningToZodiac: `Transicionando a selección zodiacal...`,
    wallet: `Billetera`,
    
    // Loading States
    connecting: `Conectando...`,
    signing: `Firmando...`,
    loading: `Cargando...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 Esta app usa Sui Testnet`,
    testnetExplainer: `Los tokens de testnet no tienen valor monetario real. ¡Este es un entorno seguro para aprender y ganar tokens $HORO virtuales!`,
    learnMoreSuiet: `Aprende cómo instalar billetera`,
    needHelp: `¿Necesitas ayuda?`,
    
    // Gas Management
    gasLow: `⛽ Saldo de Gas Bajo`,
    gasNeeded: `Por favor añade SUI de testnet a tu billetera para transacciones`,
    getFreeGas: `Abrir Faucet de Testnet`,
    gettingGas: `Abriendo faucet...`,
    gasSuccess: `✅ ¡SUI gratuito de testnet añadido a tu billetera!`,
    gasError: `❌ Error al abrir faucet. Por favor visita faucet.testnet.sui.io manualmente.`,
    gasBalance: `Saldo de Gas`,
    sufficientGas: `✅ Gas suficiente para transacciones`,
    
    // Footer
    about: `Acerca de`,
    tokenomics: `Tokenómica`,
    help: `Ayuda`,
    reset: `Reiniciar`,
    
    // Claim Status Messages
    alreadyClaimedToday: `¡Ya Reclamado Hoy!`,
    alreadyClaimedMessage: `¡Has ganado tu $HORO diario! Vuelve mañana.`,
    nextClaimAvailable: `Próximo reclamo disponible: Mañana`,
    claimTodaysHoro: `🎁 Reclamar $HORO de Hoy`,
    missedDays: `Días Perdidos`,
    completedDays: `Días Completados`,
    claimedAmountToday: `¡Reclamados {amount} $HORO hoy!`,
    completed: `Completado`,
    missed: `Perdido`,
    available: `Disponible`,
    future: `Futuro`,
    
    // Network Status
    connected: `Conectado`,
    connectionVerified: `Conexión a Sui Testnet verificada`,
    refreshStatus: `Actualizar Estado`,
    
    // Days of the Week
    sunday: `Dom`,
    monday: `Lun`, 
    tuesday: `Mar`,
    wednesday: `Mié`,
    thursday: `Jue`,
    friday: `Vie`,
    saturday: `Sáb`,
    
    // Zodiac Signs
    aries: `aries`,
    taurus: `tauro`, 
    gemini: `géminis`,
    cancer: `cáncer`,
    leo: `leo`,
    virgo: `virgo`,
    libra: `libra`,
    scorpio: `escorpio`,
    sagittarius: `sagitario`,
    capricorn: `capricornio`,
    aquarius: `acuario`,
    pisces: `piscis`,
    
    // Chinese Zodiac
    rat: `rata`,
    ox: `buey`,
    tiger: `tigre`, 
    rabbit: `conejo`,
    dragon: `dragón`,
    snake: `serpiente`,
    horse: `caballo`,
    goat: `cabra`,
    monkey: `mono`,
    rooster: `gallo`,
    dog: `perro`,
    pig: `cerdo`,
    
    // Elements
    water: `Agua`,
    earth: `Tierra`, 
    wood: `Madera`,
    fire: `Fuego`,
    metal: `Metal`
  },
  ru: {
    // Main UI
    dailyHoro: `Ежедневная $HORO`,
    chooseZodiacSystem: `Выберите Вашу Зодиакальную Систему`,
    chooseWesternZodiac: `Выберите Ваш Западный Знак Зодиака`,
    chooseChineseZodiac: `Выберите Ваш Китайский Знак Зодиака`,
    western: `Западный`,
    chinese: `Китайский`,
    weeklyProgress: `Недельный Прогресс`,
    todayVisitRecorded: `✓ Сегодняшнее требование записано!`,
    alreadyClaimedOnChain: `✅ Уже получено сегодня (проверено в блокчейне)`,
    dailyReading: `Ежедневное Чтение`,
    dailyReward: `Ежедневная Награда $HORO`,
    earnDailyHoro: `Заработайте {amount} $HORO сегодня!`,
    todayRewardEarned: `✅ Сегодняшние {amount} $HORO заработаны!`,
    checkInToday: `Отметиться и Заработать $HORO`,
    checkingIn: `Зарабатываем $HORO...`,
    claiming: `Получаем...`,
    verifyingClaim: `Проверяем статус получения...`,
    streakBonus: `Бонус за Серию`,
    daysStreak: `серия {days} дней`,
    baseReward: `Базовая награда: {amount} $HORO`,
    bonusReward: `Бонус за серию: +{amount} $HORO`,
    totalDailyReward: `Всего сегодня: {amount} $HORO`,
    blockchainTransaction: `Это создаст транзакцию в блокчейне и переведет настоящие токены $HORO в ваш кошелек!`,
    rewardsClaimedTitle: `✅ Награды Получены!`,
    rewardsClaimed: `Вы уже получили ваши токены $HORO на этой неделе.`,
    comeBackMonday: `Возвращайтесь в следующий понедельник, чтобы начать новую неделю!`,
    connectWalletButton: `Подключить Кошелек`,
    connectWallet: `Подключите ваш кошелек для автоматического отслеживания ежедневных посещений и получения наград $HORO!`,
    connectSuietWallet: `Подключить Кошелек`,
    connectSuietWalletTitle: `Подключить Кошелек`,
    connectSuietPrompt: `Подключите ваш кошелек для автоматического отслеживания ежедневных посещений и получения наград $HORO с криптографической безопасностью!`,
    suietWalletSecure: `Безопасный кошелек с подписью сообщений`,
    whySuiet: `Почему Подключить Кошелек?`,
    suietBenefitSigning: `Поддерживает криптографическую подпись сообщений`,
    suietBenefitSecurity: `Повышенная безопасность для NFT airdrop`,
    suietBenefitFraud: `Предотвращает мошенничество при регистрации`,
    suietBenefitCompatibility: `Лучшая совместимость с функциями $HORO`,
    dontHaveSuiet: `Нет кошелька?`,
    downloadSuiet: `Скачать Кошелек →`,
    useSuietForSigning: `Пожалуйста, используйте ваш кошелек для безопасной подписи сообщений`,
    autoSigning: `Автоматически подписываем сегодняшнее посещение... ✨`,
    transitioningToZodiac: `Переходим к выбору зодиака...`,
    wallet: `Кошелек`,
    
    // Loading States
    connecting: `Подключаемся...`,
    signing: `Подписываем...`,
    loading: `Загружаем...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 Это приложение использует Sui Testnet`,
    testnetExplainer: `Токены тестнета не имеют реальной денежной стоимости. Это безопасная среда для изучения и заработка виртуальных токенов $HORO!`,
    learnMoreSuiet: `Узнайте, как установить кошелек`,
    needHelp: `Нужна помощь?`,
    
    // Gas Management
    gasLow: `⛽ Низкий Баланс Газа`,
    gasNeeded: `Пожалуйста, добавьте тестнет SUI в ваш кошелек для транзакций`,
    getFreeGas: `Открыть Тестнет Кран`,
    gettingGas: `Открываем кран...`,
    gasSuccess: `✅ Бесплатный тестнет SUI добавлен в ваш кошелек!`,
    gasError: `❌ Не удалось открыть кран. Пожалуйста, посетите faucet.testnet.sui.io вручную.`,
    gasBalance: `Баланс Газа`,
    sufficientGas: `✅ Достаточно газа для транзакций`,
    
    // Footer
    about: `О проекте`,
    tokenomics: `Токеномика`,
    help: `Помощь`,
    reset: `Сброс`,
    
    // Claim Status Messages
    alreadyClaimedToday: `Уже Получено Сегодня!`,
    alreadyClaimedMessage: `Вы заработали свои ежедневные $HORO! Возвращайтесь завтра.`,
    nextClaimAvailable: `Следующее получение доступно: Завтра`,
    claimTodaysHoro: `🎁 Получить Сегодняшние $HORO`,
    missedDays: `Пропущенные Дни`,
    completedDays: `Завершенные Дни`,
    claimedAmountToday: `Получено {amount} $HORO сегодня!`,
    completed: `Завершено`,
    missed: `Пропущено`,
    available: `Доступно`,
    future: `Будущее`,
    
    // Network Status
    connected: `Подключен`,
    connectionVerified: `Подключение к Sui Testnet проверено`,
    refreshStatus: `Обновить Статус`,
    
    // Days of the Week
    sunday: `Вс`,
    monday: `Пн`, 
    tuesday: `Вт`,
    wednesday: `Ср`,
    thursday: `Чт`,
    friday: `Пт`,
    saturday: `Сб`,
    
    // Zodiac Signs
    aries: `овен`,
    taurus: `телец`, 
    gemini: `близнецы`,
    cancer: `рак`,
    leo: `лев`,
    virgo: `дева`,
    libra: `весы`,
    scorpio: `скорпион`,
    sagittarius: `стрелец`,
    capricorn: `козерог`,
    aquarius: `водолей`,
    pisces: `рыбы`,
    
    // Chinese Zodiac
    rat: `крыса`,
    ox: `бык`,
    tiger: `тигр`, 
    rabbit: `кролик`,
    dragon: `дракон`,
    snake: `змея`,
    horse: `лошадь`,
    goat: `коза`,
    monkey: `обезьяна`,
    rooster: `петух`,
    dog: `собака`,
    pig: `свинья`,
    
    // Elements
    water: `Вода`,
    earth: `Земля`, 
    wood: `Дерево`,
    fire: `Огонь`,
    metal: `Металл`
  },
  fr: {
    // Main UI
    dailyHoro: `$HORO Quotidien`,
    chooseZodiacSystem: `Choisissez Votre Système Zodiacal`,
    chooseWesternZodiac: `Choisissez Votre Signe Zodiacal Occidental`,
    chooseChineseZodiac: `Choisissez Votre Signe Zodiacal Chinois`,
    western: `Occidental`,
    chinese: `Chinois`,
    weeklyProgress: `Progrès Hebdomadaire`,
    todayVisitRecorded: `✓ Réclamation d'aujourd'hui enregistrée!`,
    alreadyClaimedOnChain: `✅ Déjà réclamé aujourd'hui (vérifié sur blockchain)`,
    dailyReading: `Lecture Quotidienne`,
    dailyReward: `Récompense $HORO Quotidienne`,
    earnDailyHoro: `Gagnez {amount} $HORO aujourd'hui!`,
    todayRewardEarned: `✅ {amount} $HORO d'aujourd'hui gagnés!`,
    checkInToday: `S'enregistrer et Gagner $HORO`,
    checkingIn: `Gagner $HORO...`,
    claiming: `Réclamation...`,
    verifyingClaim: `Vérification du statut de réclamation...`,
    streakBonus: `Bonus de Série`,
    daysStreak: `série de {days} jours`,
    baseReward: `Récompense de base: {amount} $HORO`,
    bonusReward: `Bonus de série: +{amount} $HORO`,
    totalDailyReward: `Total aujourd'hui: {amount} $HORO`,
    blockchainTransaction: `Ceci créera une transaction blockchain et transférera de vrais tokens $HORO vers votre portefeuille!`,
    rewardsClaimedTitle: `✅ Récompenses Réclamées!`,
    rewardsClaimed: `Vous avez déjà réclamé vos tokens $HORO cette semaine.`,
    comeBackMonday: `Revenez lundi prochain pour commencer une nouvelle semaine!`,
    connectWalletButton: `Connecter Portefeuille`,
    connectWallet: `Connectez votre portefeuille pour suivre automatiquement vos visites quotidiennes et réclamer les récompenses $HORO!`,
    connectSuietWallet: `Connecter Portefeuille`,
    connectSuietWalletTitle: `Connecter Portefeuille`,
    connectSuietPrompt: `Connectez votre portefeuille pour suivre automatiquement vos visites quotidiennes et réclamer les récompenses $HORO avec sécurité cryptographique!`,
    suietWalletSecure: `Portefeuille sécurisé avec signature de messages`,
    whySuiet: `Pourquoi Connecter Portefeuille?`,
    suietBenefitSigning: `Supporte la signature cryptographique de messages`,
    suietBenefitSecurity: `Sécurité renforcée pour les airdrops NFT`,
    suietBenefitFraud: `Prévient la fraude d'enregistrement`,
    suietBenefitCompatibility: `Meilleure compatibilité avec les fonctionnalités $HORO`,
    dontHaveSuiet: `Pas de portefeuille?`,
    downloadSuiet: `Télécharger Portefeuille →`,
    useSuietForSigning: `Veuillez utiliser votre portefeuille pour la signature sécurisée de messages`,
    autoSigning: `Signature automatique de la visite d'aujourd'hui... ✨`,
    transitioningToZodiac: `Transition vers la sélection zodiacale...`,
    wallet: `Portefeuille`,
    
    // Loading States
    connecting: `Connexion...`,
    signing: `Signature...`,
    loading: `Chargement...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 Cette app utilise Sui Testnet`,
    testnetExplainer: `Les tokens testnet n'ont aucune valeur monétaire réelle. C'est un environnement sûr pour apprendre et gagner des tokens $HORO virtuels!`,
    learnMoreSuiet: `Apprenez comment installer un portefeuille`,
    needHelp: `Besoin d'aide?`,
    
    // Gas Management
    gasLow: `⛽ Solde Gas Faible`,
    gasNeeded: `Veuillez ajouter du SUI testnet à votre portefeuille pour les transactions`,
    getFreeGas: `Ouvrir Robinet Testnet`,
    gettingGas: `Ouverture du robinet...`,
    gasSuccess: `✅ SUI testnet gratuit ajouté à votre portefeuille!`,
    gasError: `❌ Échec d'ouverture du robinet. Veuillez visiter faucet.testnet.sui.io manuellement.`,
    gasBalance: `Solde Gas`,
    sufficientGas: `✅ Gas suffisant pour les transactions`,
    
    // Footer
    about: `À propos`,
    tokenomics: `Tokenomique`,
    help: `Aide`,
    reset: `Réinitialiser`,
    
    // Claim Status Messages
    alreadyClaimedToday: `Déjà Réclamé Aujourd'hui!`,
    alreadyClaimedMessage: `Vous avez gagné votre $HORO quotidien! Revenez demain.`,
    nextClaimAvailable: `Prochaine réclamation disponible: Demain`,
    claimTodaysHoro: `🎁 Réclamer $HORO d'Aujourd'hui`,
    missedDays: `Jours Manqués`,
    completedDays: `Jours Complétés`,
    claimedAmountToday: `Réclamé {amount} $HORO aujourd'hui!`,
    completed: `Terminé`,
    missed: `Manqué`,
    available: `Disponible`,
    future: `Futur`,
    
    // Network Status
    connected: `Connecté`,
    connectionVerified: `Connexion à Sui Testnet vérifiée`,
    refreshStatus: `Actualiser le Statut`,
    
    // Days of the Week
    sunday: `Dim`,
    monday: `Lun`, 
    tuesday: `Mar`,
    wednesday: `Mer`,
    thursday: `Jeu`,
    friday: `Ven`,
    saturday: `Sam`,
    
    // Zodiac Signs
    aries: `bélier`,
    taurus: `taureau`, 
    gemini: `gémeaux`,
    cancer: `cancer`,
    leo: `lion`,
    virgo: `vierge`,
    libra: `balance`,
    scorpio: `scorpion`,
    sagittarius: `sagittaire`,
    capricorn: `capricorne`,
    aquarius: `verseau`,
    pisces: `poissons`,
    
    // Chinese Zodiac
    rat: `rat`,
    ox: `bœuf`,
    tiger: `tigre`, 
    rabbit: `lapin`,
    dragon: `dragon`,
    snake: `serpent`,
    horse: `cheval`,
    goat: `chèvre`,
    monkey: `singe`,
    rooster: `coq`,
    dog: `chien`,
    pig: `cochon`,
    
    // Elements
    water: `Eau`,
    earth: `Terre`, 
    wood: `Bois`,
    fire: `Feu`,
    metal: `Métal`
  },
  zh: {
    // Main UI
    dailyHoro: `每日 $HORO`,
    chooseZodiacSystem: `选择您的星座系统`,
    chooseWesternZodiac: `选择您的西方星座`,
    chooseChineseZodiac: `选择您的生肖`,
    western: `西方`,
    chinese: `中国`,
    weeklyProgress: `每周进度`,
    todayVisitRecorded: `✓ 今日签到已记录！`,
    alreadyClaimedOnChain: `✅ 今日已领取（区块链已验证）`,
    dailyReading: `每日阅读`,
    dailyReward: `每日$HORO奖励`,
    earnDailyHoro: `今天赚取{amount} $HORO！`,
    todayRewardEarned: `✅ 今天的{amount} $HORO已赚取！`,
    checkInToday: `签到并赚取$HORO`,
    checkingIn: `正在赚取$HORO...`,
    claiming: `正在领取...`,
    verifyingClaim: `正在验证领取状态...`,
    streakBonus: `连续奖励`,
    daysStreak: `{days}天连续`,
    baseReward: `基础奖励：{amount} $HORO`,
    bonusReward: `连续奖励：+{amount} $HORO`,
    totalDailyReward: `今日总计：{amount} $HORO`,
    blockchainTransaction: `这将创建一个区块链交易并将真实的$HORO代币转移到您的钱包！`,
    rewardsClaimedTitle: `✅ 奖励已领取！`,
    rewardsClaimed: `您已经领取了本周的$HORO代币。`,
    comeBackMonday: `下周一回来开始新的一周！`,
    connectWalletButton: `连接钱包`,
    connectWallet: `连接您的钱包以自动跟踪每日访问并领取$HORO奖励！`,
    connectSuietWallet: `连接钱包`,
    connectSuietWalletTitle: `连接钱包`,
    connectSuietPrompt: `连接您的钱包以自动跟踪每日访问并通过加密安全领取$HORO奖励！`,
    suietWalletSecure: `带有消息签名的安全钱包`,
    whySuiet: `为什么连接钱包？`,
    suietBenefitSigning: `支持加密消息签名`,
    suietBenefitSecurity: `增强NFT空投安全性`,
    suietBenefitFraud: `防止签到欺诈`,
    suietBenefitCompatibility: `与$HORO功能最佳兼容`,
    dontHaveSuiet: `没有钱包？`,
    downloadSuiet: `下载钱包 →`,
    useSuietForSigning: `请使用您的钱包进行安全消息签名`,
    autoSigning: `正在自动签署今日访问... ✨`,
    transitioningToZodiac: `正在转换到星座选择...`,
    wallet: `钱包`,
    
    // Loading States
    connecting: `连接中...`,
    signing: `签名中...`,
    loading: `加载中...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 此应用使用Sui测试网`,
    testnetExplainer: `测试网代币没有真实货币价值。这是一个安全的环境来学习和赚取虚拟$HORO代币！`,
    learnMoreSuiet: `了解如何安装钱包`,
    needHelp: `需要帮助？`,
    
    // Gas Management
    gasLow: `⛽ Gas余额不足`,
    gasNeeded: `请向您的钱包添加测试网SUI进行交易`,
    getFreeGas: `打开测试网水龙头`,
    gettingGas: `正在打开水龙头...`,
    gasSuccess: `✅ 免费测试网SUI已添加到您的钱包！`,
    gasError: `❌ 打开水龙头失败。请手动访问faucet.testnet.sui.io。`,
    gasBalance: `Gas余额`,
    sufficientGas: `✅ 交易Gas充足`,
    
    // Footer
    about: `关于`,
    tokenomics: `代币经济`,
    help: `帮助`,
    reset: `重置`,
    
    // Claim Status Messages
    alreadyClaimedToday: `今日已领取！`,
    alreadyClaimedMessage: `您已获得今日$HORO！明天再来。`,
    nextClaimAvailable: `下次领取时间：明天`,
    claimTodaysHoro: `🎁 领取今日$HORO`,
    missedDays: `错过的天数`,
    completedDays: `完成的天数`,
    claimedAmountToday: `今日已领取{amount} $HORO！`,
    completed: `已完成`,
    missed: `已错过`,
    available: `可用`,
    future: `未来`,
    
    // Network Status
    connected: `已连接`,
    connectionVerified: `Sui测试网连接已验证`,
    refreshStatus: `刷新状态`,
    
    // Days of the Week
    sunday: `周日`,
    monday: `周一`, 
    tuesday: `周二`,
    wednesday: `周三`,
    thursday: `周四`,
    friday: `周五`,
    saturday: `周六`,
    
    // Zodiac Signs
    aries: `白羊座`,
    taurus: `金牛座`, 
    gemini: `双子座`,
    cancer: `巨蟹座`,
    leo: `狮子座`,
    virgo: `处女座`,
    libra: `天秤座`,
    scorpio: `天蝎座`,
    sagittarius: `射手座`,
    capricorn: `摩羯座`,
    aquarius: `水瓶座`,
    pisces: `双鱼座`,
    
    // Chinese Zodiac
    rat: `鼠`,
    ox: `牛`,
    tiger: `虎`, 
    rabbit: `兔`,
    dragon: `龙`,
    snake: `蛇`,
    horse: `马`,
    goat: `羊`,
    monkey: `猴`,
    rooster: `鸡`,
    dog: `狗`,
    pig: `猪`,
    
    // Elements
    water: `水`,
    earth: `土`, 
    wood: `木`,
    fire: `火`,
    metal: `金`
  },
  'zh-TR': {
    // Main UI
    dailyHoro: `每日 $HORO`,
    chooseZodiacSystem: `選擇您的星座系統`,
    chooseWesternZodiac: `選擇您的西方星座`,
    chooseChineseZodiac: `選擇您的生肖`,
    western: `西方`,
    chinese: `中國`,
    weeklyProgress: `每週進度`,
    todayVisitRecorded: `✓ 今日簽到已記錄！`,
    alreadyClaimedOnChain: `✅ 今日已領取（區塊鏈已驗證）`,
    dailyReading: `每日閱讀`,
    dailyReward: `每日$HORO獎勵`,
    earnDailyHoro: `今天賺取{amount} $HORO！`,
    todayRewardEarned: `✅ 今天的{amount} $HORO已賺取！`,
    checkInToday: `簽到並賺取$HORO`,
    checkingIn: `正在賺取$HORO...`,
    claiming: `正在領取...`,
    verifyingClaim: `正在驗證領取狀態...`,
    streakBonus: `連續獎勵`,
    daysStreak: `{days}天連續`,
    baseReward: `基礎獎勵：{amount} $HORO`,
    bonusReward: `連續獎勵：+{amount} $HORO`,
    totalDailyReward: `今日總計：{amount} $HORO`,
    blockchainTransaction: `這將創建一個區塊鏈交易並將真實的$HORO代幣轉移到您的錢包！`,
    rewardsClaimedTitle: `✅ 獎勵已領取！`,
    rewardsClaimed: `您已經領取了本週的$HORO代幣。`,
    comeBackMonday: `下週一回來開始新的一週！`,
    connectWalletButton: `連接錢包`,
    connectWallet: `連接您的錢包以自動跟踪每日訪問並領取$HORO獎勵！`,
    connectSuietWallet: `連接錢包`,
    connectSuietWalletTitle: `連接錢包`,
    connectSuietPrompt: `連接您的錢包以自動跟踪每日訪問並通過加密安全領取$HORO獎勵！`,
    suietWalletSecure: `帶有消息簽名的安全錢包`,
    whySuiet: `為什麼連接錢包？`,
    suietBenefitSigning: `支持加密消息簽名`,
    suietBenefitSecurity: `增強NFT空投安全性`,
    suietBenefitFraud: `防止簽到欺詐`,
    suietBenefitCompatibility: `與$HORO功能最佳兼容`,
    dontHaveSuiet: `沒有錢包？`,
    downloadSuiet: `下載錢包 →`,
    useSuietForSigning: `請使用您的錢包進行安全消息簽名`,
    autoSigning: `正在自動簽署今日訪問... ✨`,
    transitioningToZodiac: `正在轉換到星座選擇...`,
    wallet: `錢包`,
    
    // Loading States
    connecting: `連接中...`,
    signing: `簽名中...`,
    loading: `加載中...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 此應用使用Sui測試網`,
    testnetExplainer: `測試網代幣沒有真實貨幣價值。這是一個安全的環境來學習和賺取虛擬$HORO代幣！`,
    learnMoreSuiet: `了解如何安裝錢包`,
    needHelp: `需要幫助？`,
    
    // Gas Management
    gasLow: `⛽ Gas餘額不足`,
    gasNeeded: `請向您的錢包添加測試網SUI進行交易`,
    getFreeGas: `打開測試網水龍頭`,
    gettingGas: `正在打開水龍頭...`,
    gasSuccess: `✅ 免費測試網SUI已添加到您的錢包！`,
    gasError: `❌ 打開水龍頭失敗。請手動訪問faucet.testnet.sui.io。`,
    gasBalance: `Gas餘額`,
    sufficientGas: `✅ 交易Gas充足`,
    
    // Footer
    about: `關於`,
    tokenomics: `代幣經濟`,
    help: `幫助`,
    reset: `重置`,
    
    // Claim Status Messages
    alreadyClaimedToday: `今日已領取！`,
    alreadyClaimedMessage: `您已獲得今日$HORO！明天再來。`,
    nextClaimAvailable: `下次領取時間：明天`,
    claimTodaysHoro: `🎁 領取今日$HORO`,
    missedDays: `錯過的天數`,
    completedDays: `完成的天數`,
    claimedAmountToday: `今日已領取{amount} $HORO！`,
    completed: `已完成`,
    missed: `已錯過`,
    available: `可用`,
    future: `未來`,
    
    // Network Status
    connected: `已連接`,
    connectionVerified: `Sui測試網連接已驗證`,
    refreshStatus: `刷新狀態`,
    
    // Days of the Week
    sunday: `週日`,
    monday: `週一`, 
    tuesday: `週二`,
    wednesday: `週三`,
    thursday: `週四`,
    friday: `週五`,
    saturday: `週六`,
    
    // Zodiac Signs
    aries: `牡羊座`,
    taurus: `金牛座`, 
    gemini: `雙子座`,
    cancer: `巨蟹座`,
    leo: `獅子座`,
    virgo: `處女座`,
    libra: `天秤座`,
    scorpio: `天蠍座`,
    sagittarius: `射手座`,
    capricorn: `摩羯座`,
    aquarius: `水瓶座`,
    pisces: `雙魚座`,
    
    // Chinese Zodiac
    rat: `鼠`,
    ox: `牛`,
    tiger: `虎`, 
    rabbit: `兔`,
    dragon: `龍`,
    snake: `蛇`,
    horse: `馬`,
    goat: `羊`,
    monkey: `猴`,
    rooster: `雞`,
    dog: `狗`,
    pig: `豬`,
    
    // Elements
    water: `水`,
    earth: `土`, 
    wood: `木`,
    fire: `火`,
    metal: `金`
  },
  pt: {
    // Main UI
    dailyHoro: `$HORO Diário`,
    chooseZodiacSystem: `Escolha Seu Sistema Zodiacal`,
    chooseWesternZodiac: `Escolha Seu Signo Zodiacal Ocidental`,
    chooseChineseZodiac: `Escolha Seu Signo Zodiacal Chinês`,
    western: `Ocidental`,
    chinese: `Chinês`,
    weeklyProgress: `Progresso Semanal`,
    todayVisitRecorded: `✓ Reivindicação de hoje registrada!`,
    alreadyClaimedOnChain: `✅ Já reivindicado hoje (verificado na blockchain)`,
    dailyReading: `Leitura Diária`,
    dailyReward: `Recompensa $HORO Diária`,
    earnDailyHoro: `Ganhe {amount} $HORO hoje!`,
    todayRewardEarned: `✅ {amount} $HORO de hoje ganhos!`,
    checkInToday: `Check-in e Ganhar $HORO`,
    checkingIn: `Ganhando $HORO...`,
    claiming: `Reivindicando...`,
    verifyingClaim: `Verificando status da reivindicação...`,
    streakBonus: `Bônus de Sequência`,
    daysStreak: `sequência de {days} dias`,
    baseReward: `Recompensa base: {amount} $HORO`,
    bonusReward: `Bônus de sequência: +{amount} $HORO`,
    totalDailyReward: `Total hoje: {amount} $HORO`,
    blockchainTransaction: `Isso criará uma transação blockchain e transferirá tokens $HORO reais para sua carteira!`,
    rewardsClaimedTitle: `✅ Recompensas Reivindicadas!`,
    rewardsClaimed: `Você já reivindicou seus tokens $HORO esta semana.`,
    comeBackMonday: `Volte na próxima segunda-feira para começar uma nova semana!`,
    connectWalletButton: `Conectar Carteira`,
    connectWallet: `Conecte sua carteira para rastrear automaticamente suas visitas diárias e reivindicar recompensas $HORO!`,
    connectSuietWallet: `Conectar Carteira`,
    connectSuietWalletTitle: `Conectar Carteira`,
    connectSuietPrompt: `Conecte sua carteira para rastrear automaticamente suas visitas diárias e reivindicar recompensas $HORO com segurança criptográfica!`,
    suietWalletSecure: `Carteira segura com assinatura de mensagens`,
    whySuiet: `Por que Conectar Carteira?`,
    suietBenefitSigning: `Suporta assinatura criptográfica de mensagens`,
    suietBenefitSecurity: `Segurança aprimorada para airdrops de NFT`,
    suietBenefitFraud: `Previne fraude no check-in`,
    suietBenefitCompatibility: `Melhor compatibilidade com recursos $HORO`,
    dontHaveSuiet: `Não tem carteira?`,
    downloadSuiet: `Baixar Carteira →`,
    useSuietForSigning: `Por favor use sua carteira para assinatura segura de mensagens`,
    autoSigning: `Assinando automaticamente a visita de hoje... ✨`,
    transitioningToZodiac: `Transicionando para seleção zodiacal...`,
    wallet: `Carteira`,
    
    // Loading States
    connecting: `Conectando...`,
    signing: `Assinando...`,
    loading: `Carregando...`,
    
    // Testnet Education
    testnetDisclaimer: `🧪 Este app usa Sui Testnet`,
    testnetExplainer: `Tokens testnet não têm valor monetário real. Este é um ambiente seguro para aprender e ganhar tokens $HORO virtuais!`,
    learnMoreSuiet: `Aprenda como instalar carteira`,
    needHelp: `Precisa de ajuda?`,
    
    // Gas Management
    gasLow: `⛽ Saldo de Gas Baixo`,
    gasNeeded: `Por favor adicione SUI testnet à sua carteira para transações`,
    getFreeGas: `Abrir Torneira Testnet`,
    gettingGas: `Abrindo torneira...`,
    gasSuccess: `✅ SUI testnet gratuito adicionado à sua carteira!`,
    gasError: `❌ Falha ao abrir torneira. Por favor visite faucet.testnet.sui.io manualmente.`,
    gasBalance: `Saldo de Gas`,
    sufficientGas: `✅ Gas suficiente para transações`,
    
    // Footer
    about: `Sobre`,
    tokenomics: `Tokenômica`,
    help: `Ajuda`,
    reset: `Resetar`,
    
    // Claim Status Messages
    alreadyClaimedToday: `Já Reivindicado Hoje!`,
    alreadyClaimedMessage: `Você ganhou seu $HORO diário! Volte amanhã.`,
    nextClaimAvailable: `Próxima reivindicação disponível: Amanhã`,
    claimTodaysHoro: `🎁 Reivindicar $HORO de Hoje`,
    missedDays: `Dias Perdidos`,
    completedDays: `Dias Completados`,
    claimedAmountToday: `Reivindicados {amount} $HORO hoje!`,
    completed: `Completado`,
    missed: `Perdido`,
    available: `Disponível`,
    future: `Futuro`,
    
    // Network Status
    connected: `Conectado`,
    connectionVerified: `Conexão com Sui Testnet verificada`,
    refreshStatus: `Atualizar Status`,
    
    // Days of the Week
    sunday: `Dom`,
    monday: `Seg`, 
    tuesday: `Ter`,
    wednesday: `Qua`,
    thursday: `Qui`,
    friday: `Sex`,
    saturday: `Sáb`,
    
    // Zodiac Signs
    aries: `áries`,
    taurus: `touro`, 
    gemini: `gêmeos`,
    cancer: `câncer`,
    leo: `leão`,
    virgo: `virgem`,
    libra: `libra`,
    scorpio: `escorpião`,
    sagittarius: `sagitário`,
    capricorn: `capricórnio`,
    aquarius: `aquário`,
    pisces: `peixes`,
    
    // Chinese Zodiac
    rat: `rato`,
    ox: `boi`,
    tiger: `tigre`, 
    rabbit: `coelho`,
    dragon: `dragão`,
    snake: `serpente`,
    horse: `cavalo`,
    goat: `cabra`,
    monkey: `macaco`,
    rooster: `galo`,
    dog: `cão`,
    pig: `porco`,
    
    // Elements
    water: `Água`,
    earth: `Terra`, 
    wood: `Madeira`,
    fire: `Fogo`,
    metal: `Metal`
  }
};

// Western Horoscopes with translations  
const $HOROSCOPES = {
  "en": {
    "aries": "Your body welcomes the deep rest, making everything feel easy and smooth today. Career deadlines could spark productivity, bringing out your best work. Blended family dynamics need patience, but harmony is possible with understanding. Planning for home equipment purchases ahead of time might help you avoid financial strain. Adventure may be calling you, but ensuring travel plans are well-organized is important.",
    "taurus": "Promoting clarity in family conversations could help prevent misunderstandings. Yoga sessions may enhance flexibility and bring a sense of inner peace. Avoid committing to financial obligations based on uncertain income to maintain security. Reconnecting with nature through travel can refresh your spirit, even with slight discomfort. Inherited properties can be beautifully transformed into treasured family homes. Professionally, your dedication is being recognized, possibly leading to promotions.",
    "gemini": "Building self-esteem through family support could boost confidence, though setbacks might still arise. Financial opportunities are likely to boost your cash flow, bringing stability and growth. Productive evenings may fuel steady career advancement and goal achievement. Your energy seems consistent, allowing for a well-paced and productive day. When purchasing property, take your time to understand the area fully to avoid regrets.",
    "cancer": "Post-meal walks might enhance digestion, although intense activity right after eating is best avoided. Routine expenses seem stable, with no unexpected costs ahead. A heartfelt chat with an elder can warm your day and deepen family bonds. Work today might involve managerial tasks that enhance leadership skills and drive sustainable growth. Exploring local culture during travel could bring new perspectives, although slight discomforts may arise.",
    "leo": "Joining knowledge-sharing events can expand your career prospects and unlock new opportunities. Detoxifying drinks might help refresh your body, making you feel rejuvenated. Travel may go smoothly, with small detours adding to the adventure. Financial appraisals might bring improvements, though it's wise to keep expectations realistic. Knowing the neighborhood vibe before investing can help avoid future regrets. Today's family moments may highlight the joy of close bonds.",
    "virgo": "A surprise family obligation may arise, demanding quick adjustments and careful planning. Creative problem-solving could lead to breakthrough innovations in the workplace. High-protein foods might boost muscle recovery and support overall health. Traveling to new destinations could bring a blend of joy and learning experiences. Party expenses could be fun, but it's important to keep them within budget.",
    "libra": "If you are planning an international move, advanced planning may make the transition seamless. Household changes work best with shared input, fostering harmony through joint decisions. Impulsive spending can strain your budget; mindful choices are key. Managing calorie intake could seem challenging, but it supports better health. Introducing new workflows might boost workplace efficiency and innovation.",
    "scorpio": "Strategic planning during a slow workday could be highly productive for long-term goals. Focused planning may help manage future investments more smoothly. Renovating your space can refresh the vibe and add a welcoming feel. A sense of unspoken love may fill your home, bringing warmth and contentment. Travel today might be steady and pleasant, offering moments of reflection and calm.",
    "sagittarius": "Spending time at home with family could recharge your spirit and bring comfort. Shifting from freelancing to full-time work may bring stability, though it might require adjustments. Increasing your daily steps could boost cardiovascular health and endurance. A travel reunion can be memorable if essentials are confirmed in advance. Financially, your portfolio seems strong, indicating long-term security.",
    "capricorn": "Traditional healing methods might bring harmony and inner well-being. Financially, pension schemes could ensure long-term security with regular contributions. Adjusting to a new home routine may take time but promises comfort in the long run. Travel might inspire excitement and fresh energy, leading to new discoveries. Proactively searching for career opportunities could yield promising results.",
    "aquarius": "Exploring new travel destinations could bring joy and unforgettable experiences. Reworking your investment approach may boost financial growth. Adapting workout routines to the weather may help maintain consistency in your fitness goals. Family talks may need careful words, as small comments can affect younger members. Office gossip may risk your reputation; staying professional can protect it. Property rentals offer promise, but careful exploration is wise.",
    "pisces": "Outdoor fitness might keep workouts engaging, though weather changes could require adjustments. Cutting back on unnecessary expenses could stabilize long-term finances. Navigating the rental market may demand caution, as tenant issues might arise unexpectedly. Small compromises within the family could help maintain balance and harmony. Travel may strike a perfect balance between adventure and peaceful moments."
  },
  "es": {
    "aries": "Tu cuerpo acepta el descanso profundo, haciendo que todo se sienta fácil y fluido hoy. Las fechas límite profesionales podrían despertar productividad, sacando lo mejor de tu trabajo. Las dinámicas familiares mixtas necesitan paciencia, pero la armonía es posible con comprensión. Planificar las compras de equipos para el hogar con anticipación podría ayudarte a evitar tensiones financieras. La aventura puede estar llamándote, pero asegurar que los planes de viaje estén bien organizados es importante.",
    "taurus": "Promover claridad en las conversaciones familiares podría ayudar a prevenir malentendidos. Las sesiones de yoga pueden mejorar la flexibilidad y traer una sensación de paz interior. Evita comprometerte con obligaciones financieras basadas en ingresos inciertos para mantener seguridad. Reconectar con la naturaleza a través de viajes puede refrescar tu espíritu, incluso con ligeras molestias. Las propiedades heredadas pueden transformarse hermosamente en hogares familiares preciados. Profesionalmente, tu dedicación está siendo reconocida, posiblemente llevando a promociones.",
    "gemini": "Construir autoestima a través del apoyo familiar podría aumentar la confianza, aunque aún pueden surgir contratiempos. Las oportunidades financieras probablemente impulsen tu flujo de efectivo, trayendo estabilidad y crecimiento. Las tardes productivas pueden alimentar el avance profesional constante y el logro de objetivos. Tu energía parece consistente, permitiendo un día bien pautado y productivo. Al comprar propiedades, tómate tu tiempo para entender completamente el área y evitar arrepentimientos.",
    "cancer": "Los paseos después de las comidas podrían mejorar la digestión, aunque la actividad intensa justo después de comer es mejor evitarla. Los gastos rutinarios parecen estables, sin costos inesperados por delante. Una charla sincera con un mayor puede alegrar tu día y profundizar los lazos familiares. El trabajo hoy podría involucrar tareas gerenciales que mejoren las habilidades de liderazgo e impulsen el crecimiento sostenible. Explorar la cultura local durante los viajes podría traer nuevas perspectivas, aunque pueden surgir ligeras molestias.",
    "leo": "Unirse a eventos de intercambio de conocimientos puede expandir tus perspectivas profesionales y desbloquear nuevas oportunidades. Las bebidas desintoxicantes podrían ayudar a refrescar tu cuerpo, haciéndote sentir rejuvenecido. Los viajes pueden transcurrir sin problemas, con pequeños desvíos que añaden a la aventura. Las evaluaciones financieras podrían traer mejoras, aunque es sabio mantener expectativas realistas. Conocer el ambiente del vecindario antes de invertir puede ayudar a evitar arrepentimientos futuros. Los momentos familiares de hoy pueden resaltar la alegría de los lazos cercanos.",
    "virgo": "Puede surgir una obligación familiar sorpresa, exigiendo ajustes rápidos y planificación cuidadosa. La resolución creativa de problemas podría llevar a innovaciones revolucionarias en el lugar de trabajo. Los alimentos ricos en proteínas podrían impulsar la recuperación muscular y apoyar la salud general. Viajar a nuevos destinos podría traer una mezcla de alegría y experiencias de aprendizaje. Los gastos de fiestas podrían ser divertidos, pero es importante mantenerlos dentro del presupuesto.",
    "libra": "Si estás planeando una mudanza internacional, la planificación avanzada puede hacer la transición perfecta. Los cambios domésticos funcionan mejor con aportes compartidos, fomentando la armonía a través de decisiones conjuntas. El gasto impulsivo puede tensar tu presupuesto; las elecciones conscientes son clave. Gestionar la ingesta de calorías podría parecer desafiante, pero apoya una mejor salud. Introducir nuevos flujos de trabajo podría impulsar la eficiencia e innovación en el lugar de trabajo.",
    "scorpio": "La planificación estratégica durante un día de trabajo lento podría ser altamente productiva para objetivos a largo plazo. La planificación enfocada puede ayudar a gestionar futuras inversiones más suavemente. Renovar tu espacio puede refrescar el ambiente y agregar una sensación acogedora. Una sensación de amor no expresado puede llenar tu hogar, trayendo calidez y contentamiento. Los viajes hoy podrían ser constantes y placenteros, ofreciendo momentos de reflexión y calma.",
    "sagittarius": "Pasar tiempo en casa con la familia podría recargar tu espíritu y traer comodidad. Cambiar del trabajo freelance al trabajo de tiempo completo puede traer estabilidad, aunque podría requerir ajustes. Aumentar tus pasos diarios podría impulsar la salud cardiovascular y la resistencia. Una reunión de viaje puede ser memorable si se confirman los elementos esenciales con anticipación. Financieramente, tu portafolio parece fuerte, indicando seguridad a largo plazo.",
    "capricorn": "Los métodos de sanación tradicionales podrían traer armonía y bienestar interior. Financieramente, los esquemas de pensión podrían asegurar seguridad a largo plazo con contribuciones regulares. Ajustarse a una nueva rutina doméstica puede tomar tiempo pero promete comodidad a largo plazo. Los viajes podrían inspirar emoción y energía fresca, llevando a nuevos descubrimientos. Buscar proactivamente oportunidades profesionales podría dar resultados prometedores.",
    "aquarius": "Explorar nuevos destinos de viaje podría traer alegría y experiencias inolvidables. Reelaborar tu enfoque de inversión puede impulsar el crecimiento financiero. Adaptar las rutinas de ejercicio al clima puede ayudar a mantener consistencia en tus objetivos de fitness. Las conversaciones familiares pueden necesitar palabras cuidadosas, ya que comentarios pequeños pueden afectar a los miembros más jóvenes. Los chismes de oficina pueden arriesgar tu reputación; mantenerse profesional puede protegerla. Los alquileres de propiedades ofrecen promesa, pero la exploración cuidadosa es sabia.",
    "pisces": "El fitness al aire libre podría mantener los entrenamientos atractivos, aunque los cambios climáticos podrían requerir ajustes. Reducir gastos innecesarios podría estabilizar las finanzas a largo plazo. Navegar el mercado de alquileres puede exigir precaución, ya que los problemas con inquilinos podrían surgir inesperadamente. Pequeños compromisos dentro de la familia podrían ayudar a mantener el equilibrio y la armonía. Los viajes pueden lograr un equilibrio perfecto entre aventura y momentos pacíficos."
  },
  "ru": {
    "aries": "Ваше тело приветствует глубокий отдых, делая все легким и плавным сегодня. Рабочие дедлайны могут вызвать продуктивность, выявляя вашу лучшую работу. Смешанная семейная динамика требует терпения, но гармония возможна с пониманием. Планирование покупок домашнего оборудования заранее может помочь избежать финансового напряжения. Приключения могут призывать вас, но обеспечение хорошо организованных планов путешествий важно.",
    "taurus": "Продвижение ясности в семейных разговорах может помочь предотвратить недоразумения. Сеансы йоги могут улучшить гибкость и принести чувство внутреннего покоя. Избегайте обязательств по финансовым обязательствам, основанным на неопределенном доходе, чтобы поддерживать безопасность. Воссоединение с природой через путешествия может освежить ваш дух, даже с легким дискомфортом. Унаследованная недвижимость может быть красиво преобразована в ценные семейные дома. Профессионально ваша преданность признается, возможно, ведя к продвижениям.",
    "gemini": "Построение самооценки через семейную поддержку может повысить уверенность, хотя неудачи могут все еще возникать. Финансовые возможности, вероятно, увеличат ваш денежный поток, принося стабильность и рост. Продуктивные вечера могут питать устойчивое карьерное продвижение и достижение целей. Ваша энергия кажется последовательной, позволяя хорошо размеренный и продуктивный день. При покупке недвижимости не торопитесь полностью понять область, чтобы избежать сожалений.",
    "cancer": "Прогулки после еды могут улучшить пищеварение, хотя интенсивная активность сразу после еды лучше избегается. Рутинные расходы кажутся стабильными, без неожиданных затрат впереди. Сердечная беседа со старшим может согреть ваш день и углубить семейные связи. Работа сегодня может включать управленческие задачи, которые улучшают лидерские навыки и способствуют устойчивому росту. Изучение местной культуры во время путешествий может принести новые перспективы, хотя могут возникнуть легкие неудобства.",
    "leo": "Присоединение к мероприятиям по обмену знаниями может расширить ваши карьерные перспективы и открыть новые возможности. Детоксифицирующие напитки могут помочь освежить ваше тело, заставляя вас чувствовать себя омоложенным. Путешествия могут проходить гладко, с небольшими объездами, добавляющими к приключению. Финансовые оценки могут принести улучшения, хотя мудро сохранять реалистичные ожидания. Знание атмосферы района перед инвестированием может помочь избежать будущих сожалений. Сегодняшние семейные моменты могут подчеркнуть радость близких связей.",
    "virgo": "Неожиданное семейное обязательство может возникнуть, требуя быстрых корректировок и тщательного планирования. Творческое решение проблем может привести к прорывным инновациям на рабочем месте. Пища с высоким содержанием белка может стимулировать восстановление мышц и поддерживать общее здоровье. Путешествие в новые места может принести смесь радости и опыта обучения. Расходы на вечеринки могут быть веселыми, но важно держать их в рамках бюджета.",
    "libra": "Если вы планируете международный переезд, продвинутое планирование может сделать переход бесшовным. Домашние изменения работают лучше всего с совместным вкладом, способствуя гармонии через совместные решения. Импульсивные траты могут напрягать ваш бюджет; осознанные выборы являются ключевыми. Управление потреблением калорий может показаться сложным, но это поддерживает лучшее здоровье. Внедрение новых рабочих процессов может повысить эффективность и инновации на рабочем месте.",
    "scorpio": "Стратегическое планирование во время медленного рабочего дня может быть высоко продуктивным для долгосрочных целей. Сосредоточенное планирование может помочь управлять будущими инвестициями более гладко. Обновление вашего пространства может освежить атмосферу и добавить гостеприимное ощущение. Чувство невысказанной любви может заполнить ваш дом, принося тепло и удовлетворение. Путешествие сегодня может быть устойчивым и приятным, предлагая моменты размышления и спокойствия.",
    "sagittarius": "Проведение времени дома с семьей может перезарядить ваш дух и принести комфорт. Переход от фриланса к полной занятости может принести стабильность, хотя это может потребовать корректировок. Увеличение ваших ежедневных шагов может стимулировать сердечно-сосудистое здоровье и выносливость. Путешествие-воссоединение может быть запоминающимся, если основы подтверждены заранее. Финансово ваш портфель кажется сильным, указывая на долгосрочную безопасность.",
    "capricorn": "Традиционные методы исцеления могут принести гармонию и внутреннее благополучие. Финансово пенсионные схемы могут обеспечить долгосрочную безопасность с регулярными взносами. Приспособление к новой домашней рутине может занять время, но обещает комфорт в долгосрочной перспективе. Путешествие может вдохновить волнение и свежую энергию, ведя к новым открытиям. Проактивный поиск карьерных возможностей может дать многообещающие результаты.",
    "aquarius": "Исследование новых направлений путешествий может принести радость и незабываемые впечатления. Переработка вашего подхода к инвестициям может стимулировать финансовый рост. Адаптация тренировочных рутин к погоде может помочь поддерживать постоянство в ваших фитнес-целях. Семейные разговоры могут нуждаться в осторожных словах, поскольку небольшие комментарии могут повлиять на младших членов. Офисные сплетни могут рисковать вашей репутацией; оставаться профессиональным может защитить ее. Аренда недвижимости предлагает обещание, но осторожное исследование мудро.",
    "pisces": "Фитнес на открытом воздухе может сохранить тренировки увлекательными, хотя изменения погоды могут потребовать корректировок. Сокращение ненужных расходов может стабилизировать долгосрочные финансы. Навигация по рынку аренды может потребовать осторожности, поскольку проблемы с арендаторами могут возникнуть неожиданно. Небольшие компромиссы в семье могут помочь поддерживать баланс и гармонию. Путешествие может достичь идеального баланса между приключением и мирными моментами."
  },
  "fr": {
    "aries": "Votre corps accueille le repos profond, rendant tout facile et fluide aujourd'hui. Les échéances professionnelles pourraient déclencher la productivité, révélant votre meilleur travail. Les dynamiques familiales mélangées nécessitent de la patience, mais l'harmonie est possible avec la compréhension. Planifier les achats d'équipements domestiques à l'avance pourrait vous aider à éviter les tensions financières. L'aventure peut vous appeler, mais s'assurer que les plans de voyage sont bien organisés est important.",
    "taurus": "Promouvoir la clarté dans les conversations familiales pourrait aider à prévenir les malentendus. Les séances de yoga peuvent améliorer la flexibilité et apporter un sentiment de paix intérieure. Évitez de vous engager dans des obligations financières basées sur un revenu incertain pour maintenir la sécurité. Se reconnecter avec la nature par le voyage peut rafraîchir votre esprit, même avec un léger inconfort. Les propriétés héritées peuvent être magnifiquement transformées en maisons familiales précieuses. Professionnellement, votre dévouement est reconnu, menant possiblement à des promotions.",
    "gemini": "Construire l'estime de soi par le soutien familial pourrait renforcer la confiance, bien que des revers puissent encore survenir. Les opportunités financières sont susceptibles d'augmenter votre flux de trésorerie, apportant stabilité et croissance. Les soirées productives peuvent alimenter l'avancement professionnel constant et l'atteinte des objectifs. Votre énergie semble constante, permettant une journée bien rythmée et productive. Lors de l'achat d'une propriété, prenez votre temps pour comprendre pleinement la zone afin d'éviter les regrets.",
    "cancer": "Les promenades après les repas pourraient améliorer la digestion, bien que l'activité intense juste après avoir mangé soit mieux évitée. Les dépenses routinières semblent stables, sans coûts inattendus à venir. Une conversation sincère avec un aîné peut réchauffer votre journée et approfondir les liens familiaux. Le travail aujourd'hui pourrait impliquer des tâches managériales qui améliorent les compétences de leadership et stimulent la croissance durable. Explorer la culture locale pendant le voyage pourrait apporter de nouvelles perspectives, bien que de légers inconforts puissent survenir.",
    "leo": "Rejoindre des événements de partage de connaissances peut élargir vos perspectives de carrière et débloquer de nouvelles opportunités. Les boissons détoxifiantes pourraient aider à rafraîchir votre corps, vous faisant vous sentir rajeuni. Le voyage peut se dérouler en douceur, avec de petits détours ajoutant à l'aventure. Les évaluations financières pourraient apporter des améliorations, bien qu'il soit sage de garder des attentes réalistes. Connaître l'ambiance du quartier avant d'investir peut aider à éviter les regrets futurs. Les moments familiaux d'aujourd'hui peuvent souligner la joie des liens étroits.",
    "virgo": "Une obligation familiale surprise peut survenir, exigeant des ajustements rapides et une planification soigneuse. La résolution créative de problèmes pourrait mener à des innovations révolutionnaires sur le lieu de travail. Les aliments riches en protéines pourraient stimuler la récupération musculaire et soutenir la santé globale. Voyager vers de nouvelles destinations pourrait apporter un mélange de joie et d'expériences d'apprentissage. Les dépenses de fête pourraient être amusantes, mais il est important de les garder dans le budget.",
    "libra": "Si vous planifiez un déménagement international, une planification avancée peut rendre la transition transparente. Les changements domestiques fonctionnent mieux avec une contribution partagée, favorisant l'harmonie par des décisions conjointes. Les dépenses impulsives peuvent tendre votre budget ; les choix réfléchis sont essentiels. Gérer l'apport calorique pourrait sembler difficile, mais cela soutient une meilleure santé. Introduire de nouveaux flux de travail pourrait stimuler l'efficacité et l'innovation sur le lieu de travail.",
    "scorpio": "La planification stratégique pendant une journée de travail lente pourrait être très productive pour les objectifs à long terme. Une planification ciblée peut aider à gérer les investissements futurs plus facilement. Rénover votre espace peut rafraîchir l'ambiance et ajouter une sensation accueillante. Un sentiment d'amour non exprimé peut remplir votre maison, apportant chaleur et contentement. Le voyage aujourd'hui pourrait être stable et agréable, offrant des moments de réflexion et de calme.",
    "sagittarius": "Passer du temps à la maison avec la famille pourrait recharger votre esprit et apporter du réconfort. Passer du travail freelance au travail à temps plein peut apporter de la stabilité, bien que cela puisse nécessiter des ajustements. Augmenter vos pas quotidiens pourrait stimuler la santé cardiovasculaire et l'endurance. Une réunion de voyage peut être mémorable si les essentiels sont confirmés à l'avance. Financièrement, votre portefeuille semble fort, indiquant une sécurité à long terme.",
    "capricorn": "Les méthodes de guérison traditionnelles pourraient apporter harmonie et bien-être intérieur. Financièrement, les régimes de pension pourraient assurer une sécurité à long terme avec des contributions régulières. S'adapter à une nouvelle routine domestique peut prendre du temps mais promet du confort à long terme. Le voyage pourrait inspirer l'excitation et une énergie fraîche, menant à de nouvelles découvertes. Rechercher proactivement des opportunités de carrière pourrait donner des résultats prometteurs.",
    "aquarius": "Explorer de nouvelles destinations de voyage pourrait apporter joie et expériences inoubliables. Retravailler votre approche d'investissement peut stimuler la croissance financière. Adapter les routines d'entraînement à la météo peut aider à maintenir la consistance dans vos objectifs de fitness. Les discussions familiales peuvent nécessiter des mots prudents, car de petits commentaires peuvent affecter les membres plus jeunes. Les ragots de bureau peuvent risquer votre réputation ; rester professionnel peut la protéger. Les locations de propriétés offrent de la promesse, mais une exploration prudente est sage.",
    "pisces": "Le fitness en plein air pourrait garder les entraînements engageants, bien que les changements météorologiques puissent nécessiter des ajustements. Réduire les dépenses inutiles pourrait stabiliser les finances à long terme. Naviguer dans le marché locatif peut exiger de la prudence, car des problèmes de locataires pourraient survenir de manière inattendue. De petits compromis au sein de la famille pourraient aider à maintenir l'équilibre et l'harmonie. Le voyage peut atteindre un équilibre parfait entre aventure et moments paisibles."
  },
  "zh": {
    "aries": "你的身体欢迎深度休息，让今天的一切都感觉轻松顺畅。职业截止日期可能激发生产力，展现你最好的工作。混合家庭动态需要耐心，但通过理解可以实现和谐。提前规划家庭设备购买可能帮助你避免财务压力。冒险可能在召唤你，但确保旅行计划井然有序很重要。",
    "taurus": "在家庭对话中促进清晰度可能有助于防止误解。瑜伽课程可能增强柔韧性并带来内心平静的感觉。避免基于不确定收入承担财务义务以保持安全。通过旅行与自然重新连接可以刷新你的精神，即使有轻微的不适。继承的财产可以美丽地转变为珍贵的家庭住所。在职业上，你的奉献正在被认可，可能导致晋升。",
    "gemini": "通过家庭支持建立自尊可能提升信心，尽管挫折仍可能出现。财务机会可能促进你的现金流，带来稳定和增长。富有成效的晚上可能推动稳定的职业发展和目标实现。你的能量似乎保持一致，允许节奏良好且富有成效的一天。购买房产时，花时间充分了解该地区以避免遗憾。",
    "cancer": "餐后散步可能增强消化，尽管饭后立即进行剧烈活动最好避免。日常开支似乎稳定，没有意外成本在前。与长辈的真心谈话可以温暖你的一天并加深家庭纽带。今天的工作可能涉及增强领导技能并推动可持续增长的管理任务。旅行中探索当地文化可能带来新的视角，尽管可能出现轻微的不适。",
    "leo": "参加知识分享活动可以扩展你的职业前景并开启新机会。排毒饮品可能有助于刷新你的身体，让你感到焕发活力。旅行可能顺利进行，小的绕道增添冒险色彩。财务评估可能带来改善，尽管保持现实期望是明智的。在投资前了解社区氛围可以帮助避免未来的遗憾。今天的家庭时光可能突出亲密关系的快乐。",
    "virgo": "可能出现意外的家庭义务，需要快速调整和仔细规划。创造性解决问题可能导致工作场所的突破性创新。高蛋白食物可能促进肌肉恢复并支持整体健康。前往新目的地旅行可能带来快乐和学习体验的融合。聚会费用可能很有趣，但保持在预算内很重要。",
    "libra": "如果你正在计划国际搬迁，高级规划可能使过渡无缝。家庭变化在共同参与下效果最好，通过联合决策促进和谐。冲动消费可能给你的预算带来压力；明智的选择是关键。管理卡路里摄入可能看起来具有挑战性，但它支持更好的健康。引入新的工作流程可能提升工作场所的效率和创新。",
    "scorpio": "在缓慢工作日期间的战略规划对长期目标可能非常富有成效。专注的规划可能帮助更顺利地管理未来投资。翻新你的空间可以刷新氛围并增添温馨感觉。一种未言喻的爱的感觉可能充满你的家，带来温暖和满足。今天的旅行可能稳定而愉快，提供反思和平静的时刻。",
    "sagittarius": "与家人在家度过时光可能为你的精神充电并带来安慰。从自由职业转向全职工作可能带来稳定，尽管可能需要调整。增加你的日常步数可能促进心血管健康和耐力。如果提前确认必需品，旅行聚会可能是难忘的。在财务上，你的投资组合似乎强劲，表明长期安全。",
    "capricorn": "传统治疗方法可能带来和谐和内心幸福。在财务上，养老金计划可以通过定期缴费确保长期安全。适应新的家庭例行公事可能需要时间，但承诺长期舒适。旅行可能激发兴奋和新鲜能量，导致新发现。主动寻找职业机会可能产生有希望的结果。",
    "aquarius": "探索新的旅行目的地可能带来快乐和难忘的体验。重新设计你的投资方法可能促进财务增长。根据天气调整锻炼例行公事可能有助于在你的健身目标中保持一致性。家庭谈话可能需要谨慎的措辞，因为小评论可能影响年轻成员。办公室八卦可能危及你的声誉；保持专业可以保护它。房产租赁提供希望，但谨慎探索是明智的。",
    "pisces": "户外健身可能保持锻炼的吸引力，尽管天气变化可能需要调整。削减不必要的开支可能稳定长期财务。导航租赁市场可能需要谨慎，因为租户问题可能意外出现。家庭内的小妥协可能有助于保持平衡和和谐。旅行可能在冒险和宁静时刻之间取得完美平衡。"
  },
  "zh-TR": {
    "aries": "你的身體歡迎深度休息，讓今天的一切都感覺輕鬆順暢。職業截止日期可能激發生產力，展現你最好的工作。混合家庭動態需要耐心，但通過理解可以實現和諧。提前規劃家庭設備購買可能幫助你避免財務壓力。冒險可能在召喚你，但確保旅行計劃井然有序很重要。",
    "taurus": "在家庭對話中促進清晰度可能有助於防止誤解。瑜伽課程可能增強柔韌性並帶來內心平靜的感覺。避免基於不確定收入承擔財務義務以保持安全。通過旅行與自然重新連接可以刷新你的精神，即使有輕微的不適。繼承的財產可以美麗地轉變為珍貴的家庭住所。在職業上，你的奉獻正在被認可，可能導致晉升。",
    "gemini": "通過家庭支持建立自尊可能提升信心，儘管挫折仍可能出現。財務機會可能促進你的現金流，帶來穩定和增長。富有成效的晚上可能推動穩定的職業發展和目標實現。你的能量似乎保持一致，允許節奏良好且富有成效的一天。購買房產時，花時間充分瞭解該地區以避免遺憾。",
    "cancer": "餐後散步可能增強消化，儘管飯後立即進行劇烈活動最好避免。日常開支似乎穩定，沒有意外成本在前。與長輩的真心談話可以溫暖你的一天並加深家庭紐帶。今天的工作可能涉及增強領導技能並推動可持續增長的管理任務。旅行中探索當地文化可能帶來新的視角，儘管可能出現輕微的不適。",
    "leo": "參加知識分享活動可以擴展你的職業前景並開啟新機會。排毒飲品可能有助於刷新你的身體，讓你感到煥發活力。旅行可能順利進行，小的繞道增添冒險色彩。財務評估可能帶來改善，儘管保持現實期望是明智的。在投資前瞭解社區氛圍可以幫助避免未來的遺憾。今天的家庭時光可能突出親密關係的快樂。",
    "virgo": "可能出現意外的家庭義務，需要快速調整和仔細規劃。創造性解決問題可能導致工作場所的突破性創新。高蛋白食物可能促進肌肉恢復並支持整體健康。前往新目的地旅行可能帶來快樂和學習體驗的融合。聚會費用可能很有趣，但保持在預算內很重要。",
    "libra": "如果你正在計劃國際搬遷，高級規劃可能使過渡無縫。家庭變化在共同參與下效果最好，通過聯合決策促進和諧。衝動消費可能給你的預算帶來壓力；明智的選擇是關鍵。管理卡路里攝入可能看起來具有挑戰性，但它支持更好的健康。引入新的工作流程可能提升工作場所的效率和創新。",
    "scorpio": "在緩慢工作日期間的戰略規劃對長期目標可能非常富有成效。專注的規劃可能幫助更順利地管理未來投資。翻新你的空間可以刷新氛圍並增添溫馨感覺。一種未言喻的愛的感覺可能充滿你的家，帶來溫暖和滿足。今天的旅行可能穩定而愉快，提供反思和平靜的時刻。",
    "sagittarius": "與家人在家度過時光可能為你的精神充電並帶來安慰。從自由職業轉向全職工作可能帶來穩定，儘管可能需要調整。增加你的日常步數可能促進心血管健康和耐力。如果提前確認必需品，旅行聚會可能是難忘的。在財務上，你的投資組合似乎強勁，表明長期安全。",
    "capricorn": "傳統治療方法可能帶來和諧和內心幸福。在財務上，養老金計劃可以通過定期繳費確保長期安全。適應新的家庭例行公事可能需要時間，但承諾長期舒適。旅行可能激發興奮和新鮮能量，導致新發現。主動尋找職業機會可能產生有希望的結果。",
    "aquarius": "探索新的旅行目的地可能帶來快樂和難忘的體驗。重新設計你的投資方法可能促進財務增長。根據天氣調整鍛煉例行公事可能有助於在你的健身目標中保持一致性。家庭談話可能需要謹慎的措辭，因為小評論可能影響年輕成員。辦公室八卦可能危及你的聲譽；保持專業可以保護它。房產租賃提供希望，但謹慎探索是明智的。",
    "pisces": "戶外健身可能保持鍛煉的吸引力，儘管天氣變化可能需要調整。削減不必要的開支可能穩定長期財務。導航租賃市場可能需要謹慎，因為租戶問題可能意外出現。家庭內的小妥協可能有助於保持平衡和和諧。旅行可能在冒險和寧靜時刻之間取得完美平衡。"
  },
  "pt": {
    "aries": "Seu corpo recebe o descanso profundo, fazendo tudo parecer fácil e suave hoje. Prazos de carreira podem despertar produtividade, trazendo à tona seu melhor trabalho. Dinâmicas familiares mistas precisam de paciência, mas harmonia é possível com compreensão. Planejar compras de equipamentos domésticos com antecedência pode ajudar você a evitar tensões financeiras. A aventura pode estar chamando você, mas garantir que os planos de viagem estejam bem organizados é importante.",
    "taurus": "Promover clareza nas conversas familiares pode ajudar a prevenir mal-entendidos. Sessões de ioga podem melhorar a flexibilidade e trazer uma sensação de paz interior. Evite se comprometer com obrigações financeiras baseadas em renda incerta para manter segurança. Reconectar-se com a natureza através de viagens pode refrescar seu espírito, mesmo com leve desconforto. Propriedades herdadas podem ser lindamente transformadas em lares familiares preciosos. Profissionalmente, sua dedicação está sendo reconhecida, possivelmente levando a promoções.",
    "gemini": "Construir autoestima através do apoio familiar pode aumentar a confiança, embora contratempos ainda possam surgir. Oportunidades financeiras provavelmente impulsionarão seu fluxo de caixa, trazendo estabilidade e crescimento. Noites produtivas podem alimentar avanço profissional constante e conquista de objetivos. Sua energia parece consistente, permitindo um dia bem ritmado e produtivo. Ao comprar propriedade, reserve tempo para entender completamente a área para evitar arrependimentos.",
    "cancer": "Caminhadas pós-refeição podem melhorar a digestão, embora atividade intensa logo após comer seja melhor evitada. Despesas rotineiras parecem estáveis, sem custos inesperados pela frente. Uma conversa sincera com um mais velho pode aquecer seu dia e aprofundar laços familiares. O trabalho hoje pode envolver tarefas gerenciais que melhoram habilidades de liderança e impulsionam crescimento sustentável. Explorar cultura local durante viagens pode trazer novas perspectivas, embora leves desconfortos possam surgir.",
    "leo": "Participar de eventos de compartilhamento de conhecimento pode expandir suas perspectivas de carreira e desbloquear novas oportunidades. Bebidas desintoxicantes podem ajudar a refrescar seu corpo, fazendo você se sentir rejuvenescido. Viagens podem correr bem, com pequenos desvios adicionando à aventura. Avaliações financeiras podem trazer melhorias, embora seja sábio manter expectativas realistas. Conhecer a vibração do bairro antes de investir pode ajudar a evitar arrependimentos futuros. Os momentos familiares de hoje podem destacar a alegria de laços próximos.",
    "virgo": "Uma obrigação familiar surpresa pode surgir, exigindo ajustes rápidos e planejamento cuidadoso. Solução criativa de problemas pode levar a inovações revolucionárias no local de trabalho. Alimentos ricos em proteína podem impulsionar a recuperação muscular e apoiar a saúde geral. Viajar para novos destinos pode trazer uma mistura de alegria e experiências de aprendizado. Despesas de festa podem ser divertidas, mas é importante mantê-las dentro do orçamento.",
    "libra": "Se você está planejando uma mudança internacional, planejamento avançado pode tornar a transição perfeita. Mudanças domésticas funcionam melhor com contribuição compartilhada, promovendo harmonia através de decisões conjuntas. Gastos impulsivos podem sobrecarregar seu orçamento; escolhas conscientes são fundamentais. Gerenciar a ingestão de calorias pode parecer desafiador, mas apoia melhor saúde. Introduzir novos fluxos de trabalho pode impulsionar eficiência e inovação no local de trabalho.",
    "scorpio": "Planejamento estratégico durante um dia de trabalho lento pode ser altamente produtivo para objetivos de longo prazo. Planejamento focado pode ajudar a gerenciar investimentos futuros mais suavemente. Renovar seu espaço pode refrescar a vibração e adicionar uma sensação acolhedora. Uma sensação de amor não expresso pode preencher sua casa, trazendo calor e contentamento. Viagem hoje pode ser estável e agradável, oferecendo momentos de reflexão e calma.",
    "sagittarius": "Passar tempo em casa com a família pode recarregar seu espírito e trazer conforto. Mudar de freelancing para trabalho em tempo integral pode trazer estabilidade, embora possa requerer ajustes. Aumentar seus passos diários pode impulsionar saúde cardiovascular e resistência. Uma reunião de viagem pode ser memorável se os essenciais forem confirmados com antecedência. Financeiramente, seu portfólio parece forte, indicando segurança de longo prazo.",
    "capricorn": "Métodos de cura tradicionais podem trazer harmonia e bem-estar interior. Financeiramente, esquemas de pensão podem garantir segurança de longo prazo com contribuições regulares. Ajustar-se a uma nova rotina doméstica pode levar tempo, mas promete conforto a longo prazo. Viagem pode inspirar emoção e energia fresca, levando a novas descobertas. Buscar proativamente oportunidades de carreira pode render resultados promissores.",
    "aquarius": "Explorar novos destinos de viagem pode trazer alegria e experiências inesquecíveis. Reformular sua abordagem de investimento pode impulsionar crescimento financeiro. Adaptar rotinas de exercício ao clima pode ajudar a manter consistência em seus objetivos de fitness. Conversas familiares podem precisar de palavras cuidadosas, já que pequenos comentários podem afetar membros mais jovens. Fofocas do escritório podem arriscar sua reputação; manter-se profissional pode protegê-la. Aluguéis de propriedade oferecem promessa, mas exploração cuidadosa é sábia.",
    "pisces": "Fitness ao ar livre pode manter exercícios envolventes, embora mudanças climáticas possam requerer ajustes. Cortar gastos desnecessários pode estabilizar finanças de longo prazo. Navegar no mercado de aluguel pode exigir cautela, já que problemas com inquilinos podem surgir inesperadamente. Pequenos compromissos dentro da família podem ajudar a manter equilíbrio e harmonia. Viagem pode encontrar um equilíbrio perfeito entre aventura e momentos pacíficos."
  }
};

// Chinese Horoscopes with translations
const CHINESE_$HOROSCOPES = {
  "en": {
    "rat": "Today brings a wave of clever insights, Rat, encouraging you to trust your quick wits in navigating daily challenges. Relationships may flourish with open communication, fostering deeper connections with loved ones. Embrace opportunities for personal growth, as small steps lead to significant progress. Your mood is optimistic, with luck favoring intellectual pursuits. Take time for reflection to balance your ambitious drive with moments of rest, ensuring sustained energy throughout the day. Emotional themes revolve around adaptability and resourcefulness, helping you turn obstacles into stepping stones.",
    "ox": "Steadfast Ox, your determination shines brightly today, paving the way for steady achievements in work and personal endeavors. Relationships benefit from your reliable nature, strengthening bonds through acts of kindness. Luck smiles on practical matters, perhaps bringing financial stability or home improvements. Maintain a calm mood by focusing on gratitude, and seize opportunities for quiet reflection. Emotional harmony comes from embracing patience, allowing you to build lasting foundations in all areas of life.",
    "tiger": "Bold Tiger, your dynamic energy propels you forward today, inspiring courageous actions in pursuit of goals. In relationships, passion ignites meaningful interactions, drawing closer those who match your intensity. Luck favors adventurous spirits, opening doors to exciting prospects. Keep your mood vibrant with positive affirmations, and reflect on past triumphs to fuel future successes. Emotional themes highlight bravery and leadership, empowering you to overcome any hurdles with grace.",
    "rabbit": "Gentle Rabbit, serenity envelops you today, promoting harmony in your surroundings and inner world. Relationships thrive on your empathetic touch, nurturing deeper understanding and affection. Opportunities for creative expression arise, bringing luck in artistic or social realms. Cultivate a peaceful mood through mindfulness, and take time to reflect on your dreams. Emotional balance stems from kindness, allowing you to hop gracefully through life's meadows.",
    "dragon": "Majestic Dragon, your charisma radiates today, attracting admiration and new alliances. In relationships, authenticity fosters profound connections, enhancing mutual respect. Luck aligns with ambitious ventures, promising rewarding outcomes. Sustain an inspired mood by celebrating small victories, and reflect on your innate power. Emotional themes emphasize confidence and vision, guiding you to soar to new heights.",
    "snake": "Wise Snake, intuition guides you today, unveiling hidden truths and strategic paths. Relationships deepen through thoughtful conversations, building trust and intimacy. Luck favors discreet efforts, perhaps in career or personal development. Maintain a composed mood with meditative practices, and reflect on transformative experiences. Emotional insight brings renewal, allowing you to shed old skins for fresh beginnings.",
    "horse": "Free-spirited Horse, enthusiasm gallops through your day, fueling exploration and joy. Relationships sparkle with shared adventures, strengthening ties through fun. Opportunities for travel or learning bring luck and growth. Keep your mood lively with optimism, and reflect on your journey's progress. Emotional themes focus on freedom and vitality, empowering you to race toward fulfillment.",
    "goat": "Creative Goat, imagination flourishes today, inspiring innovative ideas and expressions. In relationships, gentleness cultivates warmth and support. Luck graces artistic pursuits or community involvement, yielding satisfying results. Nurture a tranquil mood through nature, and reflect on your unique talents. Emotional harmony arises from compassion, helping you climb to peaceful peaks.",
    "monkey": "Playful Monkey, curiosity sparks delight today, leading to clever discoveries and fun. Relationships benefit from your wit, sparking lively exchanges. Opportunities for social networking bring luck and connections. Sustain a cheerful mood with humor, and reflect on adaptable strategies. Emotional themes highlight ingenuity and joy, swinging you through life's branches with ease.",
    "rooster": "Proud Rooster, diligence pays off today, showcasing your talents and earning recognition. In relationships, honesty fosters loyalty and admiration. Luck shines on professional endeavors, promising advancements. Maintain a confident mood through self-care, and reflect on achievements. Emotional strength comes from integrity, allowing you to crow triumphantly.",
    "dog": "Loyal Dog, faithfulness strengthens bonds today, creating security in friendships and family. Opportunities for helping others bring luck and fulfillment. Keep your mood steady with trust, and reflect on meaningful connections. Emotional themes revolve around devotion and protection, guiding you to a harmonious path.",
    "pig": "Generous Pig, abundance flows today, rewarding your kind-hearted efforts. Relationships blossom with sincerity, enhancing joy and support. Luck favors leisurely pursuits or financial gains. Cultivate a content mood through appreciation, and reflect on life's blessings. Emotional warmth brings prosperity, inviting you to savor the feast of existence."
  },
  "es": {
    "rat": "Hoy trae una ola de perspicacias inteligentes, Rata, animándote a confiar en tu astucia rápida para navegar los desafíos diarios. Las relaciones pueden florecer con comunicación abierta, fomentando conexiones más profundas con seres queridos. Abraza oportunidades de crecimiento personal, ya que pequeños pasos llevan a progreso significativo. Tu estado de ánimo es optimista, con la suerte favoreciendo pursuits intelectuales. Toma tiempo para reflexión para equilibrar tu impulso ambicioso con momentos de descanso, asegurando energía sostenida durante todo el día. Temas emocionales giran en torno a la adaptabilidad y el ingenio, ayudándote a convertir obstáculos en escalones.",
    "ox": "Firme Buey, tu determinación brilla intensamente hoy, pavimentando el camino para logros constantes en el trabajo y los empeños personales. Las relaciones se benefician de tu naturaleza confiable, fortaleciendo vínculos a través de actos de bondad. La suerte sonríe en asuntos prácticos, tal vez trayendo estabilidad financiera o mejoras del hogar. Mantén un estado de ánimo calmado enfocándote en la gratitud, y aprovecha oportunidades para reflexión silenciosa. La armonía emocional viene de abrazar la paciencia, permitiéndote construir fundaciones duraderas en todas las áreas de la vida.",
    "tiger": "Audaz Tigre, tu energía dinámica te propulsa hacia adelante hoy, inspirando acciones valientes en la búsqueda de objetivos. En relaciones, la pasión enciende interacciones significativas, acercando a aquellos que igualan tu intensidad. La suerte favorece a los espíritus aventureros, abriendo puertas a perspectivas emocionantes. Mantén tu estado de ánimo vibrante con afirmaciones positivas, y reflexiona sobre triunfos pasados para alimentar éxitos futuros. Temas emocionales destacan la valentía y el liderazgo, empoderándote para superar cualquier obstáculo con gracia.",
    "rabbit": "Gentil Conejo, la serenidad te envuelve hoy, promoviendo armonía en tu entorno y mundo interior. Las relaciones prosperan con tu toque empático, nutriendo entendimiento más profundo y afecto. Surgen oportunidades para expresión creativa, trayendo suerte en reinos artísticos o sociales. Cultiva un estado de ánimo pacífico a través de mindfulness, y toma tiempo para reflexionar sobre tus sueños. El equilibrio emocional surge de la bondad, permitiéndote saltar grácilmente por los prados de la vida.",
    "dragon": "Majestuoso Dragón, tu carisma irradia hoy, atrayendo admiración y nuevas alianzas. En relaciones, la autenticidad fomenta conexiones profundas, mejorando el respeto mutuo. La suerte se alinea con empresas ambiciosas, prometiendo resultados gratificantes. Sostén un estado de ánimo inspirado celebrando pequeñas victorias, y reflexiona sobre tu poder innato. Temas emocionales enfatizan confianza y visión, guiándote a volar a nuevas alturas.",
    "snake": "Sabia Serpiente, la intuición te guía hoy, revelando verdades ocultas y caminos estratégicos. Las relaciones se profundizan a través de conversaciones reflexivas, construyendo confianza e intimidad. La suerte favorece esfuerzos discretos, tal vez en carrera o desarrollo personal. Mantén un estado de ánimo compuesto con prácticas meditativas, y reflexiona sobre experiencias transformadoras. La perspicacia emocional trae renovación, permitiéndote mudar pieles viejas para nuevos comienzos.",
    "horse": "Caballo de espíritu libre, el entusiasmo galopa por tu día, alimentando exploración y alegría. Las relaciones brillan con aventuras compartidas, fortaleciendo lazos a través de diversión. Oportunidades para viajar o aprender traen suerte y crecimiento. Mantén tu estado de ánimo animado con optimismo, y reflexiona sobre el progreso de tu viaje. Temas emocionales se enfocan en libertad y vitalidad, empoderándote para correr hacia la realización.",
    "goat": "Cabra Creativa, la imaginación florece hoy, inspirando ideas y expresiones innovadoras. En relaciones, la gentileza cultiva calidez y apoyo. La suerte bendice persuits artísticos o participación comunitaria, dando resultados satisfactorios. Nutre un estado de ánimo tranquilo a través de la naturaleza, y reflexiona sobre tus talentos únicos. La armonía emocional surge de la compasión, ayudándote a escalar a picos pacíficos.",
    "monkey": "Mono Juguetón, la curiosidad enciende deleite hoy, llevando a descubrimientos inteligentes y diversión. Las relaciones se benefician de tu ingenio, generando intercambios animados. Oportunidades para networking social traen suerte y conexiones. Sostén un estado de ánimo alegre con humor, y reflexiona sobre estrategias adaptables. Temas emocionales destacan ingenio y alegría, balanceándote por las ramas de la vida con facilidad.",
    "rooster": "Gallo Orgulloso, la diligencia da frutos hoy, mostrando tus talentos y ganando reconocimiento. En relaciones, la honestidad fomenta lealtad y admiración. La suerte brilla en empeños profesionales, prometiendo avances. Mantén un estado de ánimo confiado a través del autocuidado, y reflexiona sobre logros. La fuerza emocional viene de la integridad, permitiéndote cantar triunfalmente.",
    "dog": "Perro Leal, la fidelidad fortalece vínculos hoy, creando seguridad en amistades y familia. Oportunidades para ayudar a otros traen suerte y realización. Mantén tu estado de ánimo estable con confianza, y reflexiona sobre conexiones significativas. Temas emocionales giran en torno a devoción y protección, guiándote a un camino armonioso.",
    "pig": "Cerdo Generoso, la abundancia fluye hoy, recompensando tus esfuerzos bondadosos. Las relaciones florecen con sinceridad, mejorando alegría y apoyo. La suerte favorece persuits de ocio o ganancias financieras. Cultiva un estado de ánimo contento a través de apreciación, y reflexiona sobre las bendiciones de la vida. La calidez emocional trae prosperidad, invitándote a saborear el banquete de la existencia."
  },
  "ru": {
    "rat": "Сегодня приносит волну умных озарений, Крыса, поощряя вас доверять своему быстрому уму в навигации ежедневных вызовов. Отношения могут процветать с открытым общением, способствуя более глубоким связям с близкими. Обнимите возможности для личностного роста, поскольку маленькие шаги ведут к значительному прогрессу. Ваше настроение оптимистично, с удачей, благоприятствующей интеллектуальным занятиям. Найдите время для размышлений, чтобы сбалансировать ваш амбициозный драйв с моментами отдыха, обеспечивая устойчивую энергию в течение дня. Эмоциональные темы вращаются вокруг адаптивности и находчивости, помогая вам превращать препятствия в ступени.",
    "ox": "Стойкий Бык, ваша решимость ярко сияет сегодня, прокладывая путь к устойчивым достижениям в работе и личных начинаниях. Отношения выигрывают от вашей надежной природы, укрепляя связи через акты доброты. Удача улыбается практическим вопросам, возможно принося финансовую стабильность или улучшения дома. Поддерживайте спокойное настроение, сосредотачиваясь на благодарности, и используйте возможности для тихих размышлений. Эмоциональная гармония приходит от принятия терпения, позволяя вам строить длительные основы во всех областях жизни.",
    "tiger": "Смелый Тигр, ваша динамичная энергия продвигает вас вперед сегодня, вдохновляя смелые действия в погоне за целями. В отношениях страсть зажигает значимые взаимодействия, притягивая ближе тех, кто соответствует вашей интенсивности. Удача благоприятствует авантюрным духам, открывая двери к захватывающим перспективам. Поддерживайте яркое настроение с позитивными утверждениями, и размышляйте о прошлых триумфах, чтобы питать будущие успехи. Эмоциональные темы подчеркивают храбрость и лидерство, наделяя вас силой преодолевать любые препятствия с грацией.",
    "rabbit": "Нежный Кролик, спокойствие окутывает вас сегодня, способствуя гармонии в вашем окружении и внутреннем мире. Отношения процветают от вашего эмпатичного прикосновения, питая более глубокое понимание и привязанность. Возникают возможности для творческого выражения, принося удачу в художественных или социальных сферах. Культивируйте мирное настроение через осознанность, и найдите время для размышлений о ваших мечтах. Эмоциональный баланс происходит от доброты, позволяя вам грациозно прыгать по лугам жизни.",
    "dragon": "Величественный Дракон, ваша харизма излучается сегодня, привлекая восхищение и новые союзы. В отношениях аутентичность способствует глубоким связям, улучшая взаимное уважение. Удача выравнивается с амбициозными предприятиями, обещая вознаграждающие результаты. Поддерживайте вдохновленное настроение, празднуя маленькие победы, и размышляйте о вашей врожденной силе. Эмоциональные темы подчеркивают уверенность и видение, направляя вас взлетать к новым высотам.",
    "snake": "Мудрая Змея, интуиция направляет вас сегодня, раскрывая скрытые истины и стратегические пути. Отношения углубляются через вдумчивые разговоры, строя доверие и близость. Удача благоприятствует дискретным усилиям, возможно в карьере или личном развитии. Поддерживайте сдержанное настроение с медитативными практиками, и размышляйте о трансформирующих переживаниях. Эмоциональное прозрение приносит обновление, позволяя вам сбрасывать старые кожи для свежих начинаний.",
    "horse": "Свободолюбивая Лошадь, энтузиазм скачет через ваш день, питая исследование и радость. Отношения искрятся с общими приключениями, укрепляя связи через веселье. Возможности для путешествий или обучения приносят удачу и рост. Поддерживайте живое настроение с оптимизмом, и размышляйте о прогрессе вашего путешествия. Эмоциональные темы фокусируются на свободе и жизненности, наделяя вас силой мчаться к исполнению.",
    "goat": "Творческая Коза, воображение процветает сегодня, вдохновляя инновационные идеи и выражения. В отношениях нежность культивирует тепло и поддержку. Удача украшает художественные занятия или общественное участие, дающие удовлетворительные результаты. Питайте спокойное настроение через природу, и размышляйте о ваших уникальных талантах. Эмоциональная гармония возникает от сострадания, помогая вам взбираться к мирным вершинам.",
    "monkey": "Игривая Обезьяна, любопытство зажигает восторг сегодня, ведя к умным открытиям и веселью. Отношения выигрывают от вашего остроумия, вызывая живые обмены. Возможности для социального нетворкинга приносят удачу и связи. Поддерживайте веселое настроение с юмором, и размышляйте об адаптивных стратегиях. Эмоциональные темы подчеркивают изобретательность и радость, качая вас по ветвям жизни с легкостью.",
    "rooster": "Гордый Петух, прилежность окупается сегодня, показывая ваши таланты и завоевывая признание. В отношениях честность способствует лояльности и восхищению. Удача сияет на профессиональных начинаниях, обещая продвижения. Поддерживайте уверенное настроение через самозаботу, и размышляйте о достижениях. Эмоциональная сила приходит от целостности, позволяя вам кричать триумфально.",
    "dog": "Верная Собака, верность укрепляет связи сегодня, создавая безопасность в дружбах и семье. Возможности помочь другим приносят удачу и исполнение. Поддерживайте стабильное настроение с доверием, и размышляйте о значимых связях. Эмоциональные темы вращаются вокруг преданности и защиты, направляя вас к гармоничному пути.",
    "pig": "Щедрая Свинья, изобилие течет сегодня, вознаграждая ваши добросердечные усилия. Отношения расцветают с искренностью, улучшая радость и поддержку. Удача благоприятствует досуговым занятиям или финансовым приобретениям. Культивируйте довольное настроение через признательность, и размышляйте о благословениях жизни. Эмоциональное тепло приносит процветание, приглашая вас наслаждаться пиром существования."
  },
  "fr": {
    "rat": "Aujourd'hui apporte une vague d'idées ingénieuses, Rat, vous encourageant à faire confiance à votre esprit vif pour naviguer les défis quotidiens. Les relations peuvent s'épanouir avec une communication ouverte, favorisant des connexions plus profondes avec les êtres chers. Embrassez les opportunités de croissance personnelle, car les petits pas mènent à des progrès significatifs. Votre humeur est optimiste, avec la chance favorisant les activités intellectuelles. Prenez du temps pour la réflexion pour équilibrer votre élan ambitieux avec des moments de repos, assurant une énergie soutenue tout au long de la journée. Les thèmes émotionnels tournent autour de l'adaptabilité et de la débrouillardise, vous aidant à transformer les obstacles en tremplins.",
    "ox": "Bœuf constant, votre détermination brille intensément aujourd'hui, pavant la voie pour des réalisations constantes dans le travail et les entreprises personnelles. Les relations bénéficient de votre nature fiable, renforçant les liens par des actes de bonté. La chance sourit aux affaires pratiques, apportant peut-être la stabilité financière ou les améliorations de la maison. Maintenez une humeur calme en vous concentrant sur la gratitude, et saisissez les opportunités pour la réflexion silencieuse. L'harmonie émotionnelle vient d'embrasser la patience, vous permettant de construire des fondations durables dans tous les domaines de la vie.",
    "tiger": "Tigre audacieux, votre énergie dynamique vous propulse vers l'avant aujourd'hui, inspirant des actions courageuses dans la poursuite d'objectifs. Dans les relations, la passion allume des interactions significatives, rapprochant ceux qui correspondent à votre intensité. La chance favorise les esprits aventureux, ouvrant des portes à des perspectives excitantes. Gardez votre humeur vibrante avec des affirmations positives, et réfléchissez sur les triomphes passés pour alimenter les succès futurs. Les thèmes émotionnels soulignent la bravoure et le leadership, vous permettant de surmonter tous les obstacles avec grâce.",
    "rabbit": "Lapin doux, la sérénité vous enveloppe aujourd'hui, promouvant l'harmonie dans votre environnement et monde intérieur. Les relations prospèrent sur votre touche empathique, nourrissant une compréhension plus profonde et l'affection. Les opportunités d'expression créative surgissent, apportant la chance dans les domaines artistiques ou sociaux. Cultivez une humeur paisible par la pleine conscience, et prenez du temps pour réfléchir sur vos rêves. L'équilibre émotionnel découle de la bonté, vous permettant de sautiller gracieusement dans les prairies de la vie.",
    "dragon": "Dragon majestueux, votre charisme rayonne aujourd'hui, attirant l'admiration et de nouvelles alliances. Dans les relations, l'authenticité favorise des connexions profondes, améliorant le respect mutuel. La chance s'aligne avec les entreprises ambitieuses, promettant des résultats gratifiants. Maintenez une humeur inspirée en célébrant les petites victoires, et réfléchissez sur votre pouvoir inné. Les thèmes émotionnels mettent l'accent sur la confiance et la vision, vous guidant à voler vers de nouveaux sommets.",
    "snake": "Serpent sage, l'intuition vous guide aujourd'hui, révélant des vérités cachées et des chemins stratégiques. Les relations s'approfondissent par des conversations réfléchies, construisant la confiance et l'intimité. La chance favorise les efforts discrets, peut-être dans la carrière ou le développement personnel. Maintenez une humeur composée avec des pratiques méditatives, et réfléchissez sur les expériences transformatrices. L'insight émotionnel apporte le renouveau, vous permettant de muer de vieilles peaux pour de nouveaux commencements.",
    "horse": "Cheval d'esprit libre, l'enthousiasme galope à travers votre journée, alimentant l'exploration et la joie. Les relations étincellent avec des aventures partagées, renforçant les liens par le plaisir. Les opportunités de voyage ou d'apprentissage apportent chance et croissance. Gardez votre humeur vive avec l'optimisme, et réfléchissez sur le progrès de votre voyage. Les thèmes émotionnels se concentrent sur la liberté et la vitalité, vous permettant de courir vers l'épanouissement.",
    "goat": "Chèvre créative, l'imagination prospère aujourd'hui, inspirant des idées et expressions innovantes. Dans les relations, la douceur cultive la chaleur et le soutien. La chance bénit les activités artistiques ou l'engagement communautaire, donnant des résultats satisfaisants. Nourrissez une humeur tranquille par la nature, et réfléchissez sur vos talents uniques. L'harmonie émotionnelle naît de la compassion, vous aidant à grimper vers des sommets paisibles.",
    "monkey": "Singe joueur, la curiosité allume le délice aujourd'hui, menant à des découvertes intelligentes et au plaisir. Les relations bénéficient de votre esprit, déclenchant des échanges animés. Les opportunités de réseautage social apportent chance et connexions. Maintenez une humeur joyeuse avec l'humour, et réfléchissez sur les stratégies adaptables. Les thèmes émotionnels soulignent l'ingéniosité et la joie, vous balançant à travers les branches de la vie avec facilité.",
    "rooster": "Coq fier, la diligence porte ses fruits aujourd'hui, montrant vos talents et gagnant la reconnaissance. Dans les relations, l'honnêteté favorise la loyauté et l'admiration. La chance brille sur les entreprises professionnelles, promettant des avancements. Maintenez une humeur confiante par l'auto-soin, et réfléchissez sur les réalisations. La force émotionnelle vient de l'intégrité, vous permettant de chanter triomphalement.",
    "dog": "Chien loyal, la fidélité renforce les liens aujourd'hui, créant la sécurité dans les amitiés et la famille. Les opportunités d'aider les autres apportent chance et épanouissement. Gardez votre humeur stable avec la confiance, et réfléchissez sur les connexions significatives. Les thèmes émotionnels tournent autour de la dévotion et la protection, vous guidant vers un chemin harmonieux.",
    "pig": "Cochon généreux, l'abondance coule aujourd'hui, récompensant vos efforts bienveillants. Les relations s'épanouissent avec la sincérité, améliorant la joie et le soutien. La chance favorise les activités de loisir ou les gains financiers. Cultivez une humeur satisfaite par l'appréciation, et réfléchissez sur les bénédictions de la vie. La chaleur émotionnelle apporte la prospérité, vous invitant à savourer le festin de l'existence."
  },
  "zh": {
    "rat": "今天带来一波聪明的洞察，鼠，鼓励你相信自己的敏捷智慧来应对日常挑战。关系可能通过开放的沟通而繁荣，与挚爱者建立更深的联系。拥抱个人成长的机会，因为小步骤会带来重大进步。你的心情是乐观的，幸运青睐智力追求。花时间反思以平衡你的雄心壮志与休息时刻，确保全天保持持续的能量。情感主题围绕适应性和机智，帮助你将障碍转化为踏脚石。",
    "ox": "坚定的牛，你的决心今天闪闪发光，为工作和个人努力中的稳定成就铺平道路。关系受益于你可靠的本性，通过善举加强纽带。幸运青睐实际事务，也许带来财务稳定或家庭改善。通过专注于感恩保持平静的心情，抓住安静反思的机会。情感和谐来自拥抱耐心，让你在生活的各个领域建立持久的基础。",
    "tiger": "勇敢的虎，你的动态能量今天推动你前进，激发在追求目标时的勇敢行动。在关系中，激情点燃有意义的互动，吸引那些与你强度匹配的人。幸运青睐冒险精神，为激动人心的前景打开大门。用积极肯定保持你振奋的心情，反思过去的胜利以激发未来的成功。情感主题突出勇敢和领导力，赋予你优雅地克服任何障碍的力量。",
    "rabbit": "温和的兔，宁静今天包围着你，促进你周围环境和内心世界的和谐。关系在你同情的触摸下茁壮成长，培养更深的理解和情感。创意表达的机会出现，在艺术或社交领域带来幸运。通过正念培养平和的心情，花时间反思你的梦想。情感平衡源于善良，让你优雅地跳跃穿过生活的草地。",
    "dragon": "威严的龙，你的魅力今天辐射，吸引钦佩和新的联盟。在关系中，真实性促进深刻的联系，增强相互尊重。幸运与雄心勃勃的事业保持一致，承诺有回报的结果。通过庆祝小胜利保持受启发的心情，反思你的内在力量。情感主题强调信心和愿景，指导你翱翔到新的高度。",
    "snake": "智慧的蛇，直觉今天指导你，揭示隐藏的真相和战略路径。关系通过深思熟虑的对话加深，建立信任和亲密。幸运青睐谨慎的努力，也许在职业或个人发展方面。通过冥想练习保持镇定的心情，反思变革性的经历。情感洞察带来更新，让你为全新的开始蜕去旧皮。",
    "horse": "自由奔放的马，热情今天在你的日子里奔腾，激发探索和快乐。关系通过共同的冒险闪闪发光，通过乐趣加强纽带。旅行或学习的机会带来幸运和成长。用乐观保持你活泼的心情，反思你旅程的进步。情感主题专注于自由和活力，赋予你朝着实现奔跑的力量。",
    "goat": "创意山羊，想象力今天蓬勃发展，激发创新的想法和表达。在关系中，温和培养温暖和支持。幸运恩赐艺术追求或社区参与，产生令人满意的结果。通过自然培养宁静的心情，反思你独特的才能。情感和谐源于同情，帮助你攀登到和平的顶峰。",
    "monkey": "顽皮的猴子，好奇心今天点燃愉悦，导致聪明的发现和乐趣。关系受益于你的机智，引发生动的交流。社交网络的机会带来幸运和联系。用幽默保持愉快的心情，反思适应性策略。情感主题突出独创性和快乐，让你轻松地在生活的枝桠中摆荡。",
    "rooster": "骄傲的公鸡，勤奋今天得到回报，展示你的才能并赢得认可。在关系中，诚实促进忠诚和钦佩。幸运照耀在专业努力上，承诺进步。通过自我照顾保持自信的心情，反思成就。情感力量来自正直，让你胜利地啼叫。",
    "dog": "忠诚的狗，忠实今天加强纽带，在友谊和家庭中创造安全感。帮助他人的机会带来幸运和满足。用信任保持你稳定的心情，反思有意义的联系。情感主题围绕奉献和保护，指导你走向和谐的道路。",
    "pig": "慷慨的猪，丰盛今天流淌，奖励你善良的努力。关系在真诚中绽放，增强快乐和支持。幸运青睐休闲追求或财务收益。通过欣赏培养满足的心情，反思生活的祝福。情感温暖带来繁荣，邀请你品味存在的盛宴。"
  },
  "zh-TR": {
    "rat": "今天帶來一波聰明的洞察，鼠，鼓勵你相信自己的敏捷智慧來應對日常挑戰。關係可能通過開放的溝通而繁榮，與摯愛者建立更深的聯繫。擁抱個人成長的機會，因為小步驟會帶來重大進步。你的心情是樂觀的，幸運青睞智力追求。花時間反思以平衡你的雄心壯志與休息時刻，確保全天保持持續的能量。情感主題圍繞適應性和機智，幫助你將障礙轉化為踏腳石。",
    "ox": "堅定的牛，你的決心今天閃閃發光，為工作和個人努力中的穩定成就鋪平道路。關係受益於你可靠的本性，通過善舉加強紐帶。幸運青睞實際事務，也許帶來財務穩定或家庭改善。通過專注於感恩保持平靜的心情，抓住安靜反思的機會。情感和諧來自擁抱耐心，讓你在生活的各個領域建立持久的基礎。",
    "tiger": "勇敢的虎，你的動態能量今天推動你前進，激發在追求目標時的勇敢行動。在關係中，激情點燃有意義的互動，吸引那些與你強度匹配的人。幸運青睞冒險精神，為激動人心的前景打開大門。用積極肯定保持你振奮的心情，反思過去的勝利以激發未來的成功。情感主題突出勇敢和領導力，賦予你優雅地克服任何障礙的力量。",
    "rabbit": "溫和的兔，寧靜今天包圍著你，促進你周圍環境和內心世界的和諧。關係在你同情的觸摸下茁壯成長，培養更深的理解和情感。創意表達的機會出現，在藝術或社交領域帶來幸運。通過正念培養平和的心情，花時間反思你的夢想。情感平衡源於善良，讓你優雅地跳躍穿過生活的草地。",
    "dragon": "威嚴的龍，你的魅力今天輻射，吸引欽佩和新的聯盟。在關係中，真實性促進深刻的聯繫，增強相互尊重。幸運與雄心勃勃的事業保持一致，承諾有回報的結果。通過慶祝小勝利保持受啟發的心情，反思你的內在力量。情感主題強調信心和願景，指導你翱翔到新的高度。",
    "snake": "智慧的蛇，直覺今天指導你，揭示隱藏的真相和戰略路徑。關係通過深思熟慮的對話加深，建立信任和親密。幸運青睞謹慎的努力，也許在職業或個人發展方面。通過冥想練習保持鎮定的心情，反思變革性的經歷。情感洞察帶來更新，讓你為全新的開始蛻去舊皮。",
    "horse": "自由奔放的馬，熱情今天在你的日子裡奔騰，激發探索和快樂。關係通過共同的冒險閃閃發光，通過樂趣加強紐帶。旅行或學習的機會帶來幸運和成長。用樂觀保持你活潑的心情，反思你旅程的進步。情感主題專注於自由和活力，賦予你朝著實現奔跑的力量。",
    "goat": "創意山羊，想像力今天蓬勃發展，激發創新的想法和表達。在關係中，溫和培養溫暖和支持。幸運恩賜藝術追求或社區參與，產生令人滿意的結果。通過自然培養寧靜的心情，反思你獨特的才能。情感和諧源於同情，幫助你攀登到和平的頂峰。",
    "monkey": "頑皮的猴子，好奇心今天點燃愉悅，導致聰明的發現和樂趣。關係受益於你的機智，引發生動的交流。社交網絡的機會帶來幸運和聯繫。用幽默保持愉快的心情，反思適應性策略。情感主題突出獨創性和快樂，讓你輕鬆地在生活的枝椏中擺盪。",
    "rooster": "驕傲的公雞，勤奮今天得到回報，展示你的才能並贏得認可。在關係中，誠實促進忠誠和欽佩。幸運照耀在專業努力上，承諾進步。通過自我照顧保持自信的心情，反思成就。情感力量來自正直，讓你勝利地啼叫。",
    "dog": "忠誠的狗，忠實今天加強紐帶，在友誼和家庭中創造安全感。幫助他人的機會帶來幸運和滿足。用信任保持你穩定的心情，反思有意義的聯繫。情感主題圍繞奉獻和保護，指導你走向和諧的道路。",
    "pig": "慷慨的豬，豐盛今天流淌，獎勵你善良的努力。關係在真誠中綻放，增強快樂和支持。幸運青睞休閒追求或財務收益。通過欣賞培養滿足的心情，反思生活的祝福。情感溫暖帶來繁榮，邀請你品味存在的盛宴。"
  },
  "pt": {
    "rat": "Hoje traz uma onda de insights inteligentes, Rato, encorajando você a confiar em seu raciocínio rápido para navegar desafios diários. Relacionamentos podem florescer com comunicação aberta, fomentando conexões mais profundas com entes queridos. Abrace oportunidades de crescimento pessoal, pois pequenos passos levam a progresso significativo. Seu humor está otimista, com sorte favorecendo atividades intelectuais. Reserve tempo para reflexão para equilibrar seu impulso ambicioso com momentos de descanso, garantindo energia sustentada ao longo do dia. Temas emocionais giram em torno de adaptabilidade e desenvoltura, ajudando você a transformar obstáculos em degraus.",
    "ox": "Boi determinado, sua determinação brilha intensamente hoje, pavimentando o caminho para conquistas constantes no trabalho e empreendimentos pessoais. Relacionamentos se beneficiam de sua natureza confiável, fortalecendo vínculos através de atos de bondade. A sorte sorri para assuntos práticos, talvez trazendo estabilidade financeira ou melhorias domésticas. Mantenha um humor calmo focando na gratidão, e aproveite oportunidades para reflexão silenciosa. A harmonia emocional vem de abraçar a paciência, permitindo que você construa fundações duradouras em todas as áreas da vida.",
    "tiger": "Tigre audaz, sua energia dinâmica o impulsiona para frente hoje, inspirando ações corajosas na busca de objetivos. Nos relacionamentos, paixão acende interações significativas, aproximando aqueles que correspondem à sua intensidade. A sorte favorece espíritos aventureiros, abrindo portas para perspectivas emocionantes. Mantenha seu humor vibrante com afirmações positivas, e reflita sobre triunfos passados para alimentar sucessos futuros. Temas emocionais destacam bravura e liderança, capacitando você a superar qualquer obstáculo com graça.",
    "rabbit": "Coelho gentil, serenidade o envolve hoje, promovendo harmonia em seu ambiente e mundo interior. Relacionamentos prosperam com seu toque empático, nutrindo entendimento mais profundo e afeto. Oportunidades para expressão criativa surgem, trazendo sorte em esferas artísticas ou sociais. Cultive um humor pacífico através da atenção plena, e reserve tempo para refletir sobre seus sonhos. Equilíbrio emocional surge da bondade, permitindo que você salte graciosamente pelos prados da vida.",
    "dragon": "Dragão majestoso, seu carisma irradia hoje, atraindo admiração e novas alianças. Nos relacionamentos, autenticidade promove conexões profundas, melhorando respeito mútuo. A sorte se alinha com empreendimentos ambiciosos, prometendo resultados recompensadores. Sustente um humor inspirado celebrando pequenas vitórias, e reflita sobre seu poder inato. Temas emocionais enfatizam confiança e visão, guiando você a voar para novos patamares.",
    "snake": "Cobra sábia, intuição o guia hoje, revelando verdades ocultas e caminhos estratégicos. Relacionamentos se aprofundam através de conversas reflexivas, construindo confiança e intimidade. A sorte favorece esforços discretos, talvez na carreira ou desenvolvimento pessoal. Mantenha um humor composto com práticas meditativas, e reflita sobre experiências transformadoras. Insight emocional traz renovação, permitindo que você mude peles velhas por novos começos.",
    "horse": "Cavalo de espírito livre, entusiasmo galopa através do seu dia, alimentando exploração e alegria. Relacionamentos brilham com aventuras compartilhadas, fortalecendo laços através da diversão. Oportunidades para viagem ou aprendizado trazem sorte e crescimento. Mantenha seu humor animado com otimismo, e reflita sobre o progresso de sua jornada. Temas emocionais focam em liberdade e vitalidade, capacitando você a correr em direção à realização.",
    "goat": "Cabra criativa, imaginação floresce hoje, inspirando ideias e expressões inovadoras. Nos relacionamentos, gentileza cultiva calor e apoio. A sorte abençoa atividades artísticas ou envolvimento comunitário, rendendo resultados satisfatórios. Nutra um humor tranquilo através da natureza, e reflita sobre seus talentos únicos. Harmonia emocional surge da compaixão, ajudando você a escalar para picos pacíficos.",
    "monkey": "Macaco brincalhão, curiosidade desperta deleite hoje, levando a descobertas inteligentes e diversão. Relacionamentos se beneficiam de sua perspicácia, gerando trocas animadas. Oportunidades para networking social trazem sorte e conexões. Sustente um humor alegre com humor, e reflita sobre estratégias adaptáveis. Temas emocionais destacam engenhosidade e alegria, balançando você pelos galhos da vida com facilidade.",
    "rooster": "Galo orgulhoso, diligência compensa hoje, exibindo seus talentos e ganhando reconhecimento. Nos relacionamentos, honestidade promove lealdade e admiração. A sorte brilha em empreendimentos profissionais, prometendo avanços. Mantenha um humor confiante através do autocuidado, e reflita sobre conquistas. Força emocional vem da integridade, permitindo que você cante triunfalmente.",
    "dog": "Cão leal, fidelidade fortalece vínculos hoje, criando segurança em amizades e família. Oportunidades para ajudar outros trazem sorte e realização. Mantenha seu humor estável com confiança, e reflita sobre conexões significativas. Temas emocionais giram em torno de devoção e proteção, guiando você a um caminho harmonioso.",
    "pig": "Porco generoso, abundância flui hoje, recompensando seus esforços bondosos. Relacionamentos florescem com sinceridade, melhorando alegria e apoio. A sorte favorece atividades de lazer ou ganhos financeiros. Cultive um humor contente através da apreciação, e reflita sobre as bênçãos da vida. Calor emocional traz prosperidade, convidando você a saborear o banquete da existência."
  }
}

// Modal translations
const MODAL_TRANSLATIONS = {
  en: {
    aboutHoro: `⁉️ About $HORO`,
    whatIsHoro: `🧭 What`,
    whatIsHoroText: `$HORO is a Web3 horoscope dApp built on the Sui testnet. Users receive free $HORO tokens for checking their horoscope — no purchases, no gas fees, no crypto knowledge required.\n\nThis is a fun and educational token with no financial utility or speculative value. Just read your stars, sign your wallet, and enjoy the beginning of a magical, star-powered Web3 journey!`,
    whereIsHoro: `🌍 Where`, 
    whereIsHoroText: `$HORO lives on horocoin.com and runs entirely on the Sui testnet. Tokens are distributed through our dApp and used only in our Web3 learning ecosystem.`,
    whenIsHoro: `📅 When`,
    whenIsHoroText: `$HORO runs continuously with:\n• Daily check-ins: Read your horoscope and connect your wallet.\n• Instant rewards: Claim your $HORO tokens immediately when you check in.\n• Streak bonuses: Longer daily streaks earn bigger rewards.`,
    whatsNext: `🔮 What's Next`,
    whatsNextText: `We're continuously expanding $HORO to include more astrological traditions from around the world. Our roadmap includes adding Vedic astrology, Mayan astrology, Celtic astrology, and many other cultural zodiac systems to ensure all traditions are properly represented and honored.`,
    whyHoro: `🤔 Why`,
    whyHoroText: `$HORO exists to introduce astrology lovers and Web2 users to the basics of Web3 in a fun, low-pressure way. No trading, no volatility, just habit-forming, blockchain-powered cosmic interplay.`,
    
    // Tokenomics
    tokenomics: `💰 $HORO Tokenomics`,
    totalSupplyTitle: `📦 Total Supply`,
    totalSupply: `10T $HORO`,
    fixedSupply: `Fixed total supply. Minted once, no inflation, no reminting.`,
    allocationBreakdown: `🧮 Allocation Breakdown`,
    dailyClaims: `Daily Claims`,
    contractAddress: `Contract Address`,
    dailyClaimsAmount: `10T tokens`,
    totalSupplyAmount: `10T tokens`,
    
    // Help
    help: `Help`,
    helpTitle: `💡 Help & Support`,
    switchToTestnet: `🔄 Switch Wallet to Testnet`,
    switchToTestnetText: `To use this app, your wallet must be connected to Sui Testnet:\n\n1. Open your wallet extension\n2. Click the network dropdown (usually shows 'Mainnet')\n3. Select 'Testnet' from the list\n4. Refresh this page and reconnect your wallet\n\nIf you don't see Testnet option, make sure you have the latest version of your wallet.`,
    needTestnetSui: `💧 Need Testnet SUI?`,
    needTestnetSuiText: `Testnet SUI tokens are free and needed for gas fees:\n\n1. Copy your wallet address from your wallet\n2. Visit: faucet.testnet.sui.io\n3. Paste your address and request SUI\n4. Wait 30 seconds for tokens to arrive\n\nYou only need to do this once - a small amount lasts for many transactions.`,
    troubleshooting: `🔧 Troubleshooting`,
    troubleshootingText: `Common issues and solutions:\n\n• Wallet won't connect: Make sure your wallet is installed and unlocked\n• Claims not working: Check you're on Testnet and have gas\n• Progress not showing: Refresh page and reconnect wallet\n• Missing tokens: Verify network and check faucet\n\nStill having trouble? This is a testnet app for learning - no real money involved!`
  },
  es: {
    aboutHoro: `❓ Acerca de $HORO`,
    whatIsHoro: `🧭 Qué`,
    whatIsHoroText: `$HORO es una dApp de horóscopo Web3 construida en la testnet de Sui. Los usuarios reciben tokens $HORO gratuitos por consultar su horóscopo — sin compras, sin tarifas de gas, sin conocimiento de cripto requerido.\n\nEste es un token divertido y educativo sin utilidad financiera o valor especulativo. Solo lee tus estrellas, firma con tu billetera y disfruta de un viaje mágico Web3.`,
    whereIsHoro: `🌍 Dónde`,
    whereIsHoroText: `$HORO vive en horocoin.com y funciona completamente en la testnet de Sui. Los tokens se distribuyen a través de nuestra dApp y se usan solo en nuestro ecosistema de aprendizaje Web3.`,
    whenIsHoro: `📅 Cuándo`,
    whenIsHoroText: `$HORO funciona continuamente con:\n• Registros diarios: Lee tu horóscopo y conecta tu billetera.\n• Recompensas instantáneas: Reclama tus tokens $HORO inmediatamente al registrarte.\n• Bonos de racha: Las rachas diarias más largas ganan mayores recompensas.`,
    whatsNext: `🔮 Qué Sigue`,
    whatsNextText: `Estamos expandiendo continuamente $HORO para incluir más tradiciones astrológicas de todo el mundo. Nuestra hoja de ruta incluye agregar astrología védica, astrología maya, astrología celta y muchos otros sistemas zodiacales culturales para asegurar que todas las tradiciones estén adecuadamente representadas y honradas.`,
    whyHoro: `🤔 Por qué`,
    whyHoroText: `$HORO existe para introducir a los amantes de la astrología y usuarios Web2 a los conceptos básicos de Web3 de una manera divertida y sin presión. Sin comercio, sin volatilidad, solo juego cósmico que forma hábitos.`,
    
    // Tokenomics
    tokenomics: `💰 Tokenómica de $HORO`,
    totalSupplyTitle: `📦 Suministro Total`,
    totalSupply: `10T $HORO`,
    fixedSupply: `Suministro total fijo. Acuñado una vez, sin inflación, sin re-acuñación.`,
    allocationBreakdown: `🧮 Desglose de Asignación`,
    dailyClaims: `Reclamos Diarios`,
    contractAddress: `Dirección del Contrato`,
    dailyClaimsAmount: `10T tokens`,
    totalSupplyAmount: `10T tokens`,
    
    // Help
    help: `Ayuda`,
    helpTitle: `💡 Ayuda y Soporte`,
    switchToTestnet: `🔄 Cambiar Billetera a Testnet`,
    switchToTestnetText: `Para usar esta app, tu billetera debe estar conectada a Sui Testnet:\n\n1. Abre tu extensión de billetera\n2. Haz clic en el menú de red (normalmente muestra 'Mainnet')\n3. Selecciona 'Testnet' de la lista\n4. Actualiza esta página y reconecta tu billetera\n\nSi no ves la opción Testnet, asegúrate de tener la última versión de tu billetera.`,
    needTestnetSui: `💧 ¿Necesitas SUI de Testnet?`,
    needTestnetSuiText: `Los tokens SUI de testnet son gratuitos y necesarios para las tarifas de gas:\n\n1. Copia tu dirección de billetera desde tu billetera\n2. Visita: faucet.testnet.sui.io\n3. Pega tu dirección y solicita SUI\n4. Espera 30 segundos para que lleguen los tokens\n\nSolo necesitas hacer esto una vez - una pequeña cantidad dura para muchas transacciones.`,
    troubleshooting: `🔧 Solución de Problemas`,
    troubleshootingText: `Problemas comunes y soluciones:\n\n• La billetera no se conecta: Asegúrate de que tu billetera esté instalada y desbloqueada\n• Los reclamos no funcionan: Verifica que estés en Testnet y tengas gas\n• El progreso no se muestra: Actualiza la página y reconecta la billetera\n• Tokens faltantes: Verifica la red y revisa el faucet\n\n¿Sigues teniendo problemas? Esta es una app de testnet para aprender - ¡no hay dinero real involucrado!`
  },
  zh: {
    aboutHoro: `❓ 关于$HORO`,
    whatIsHoro: `🧭 什么`,
    whatIsHoroText: `$HORO是建立在Sui测试网上的Web3星座体验。用户通过查看星座获得免费的$HORO代币——无需购买、无gas费用、无需加密货币知识。\n\n这是一个有趣的教育代币，没有金融用途或投机价值。只需阅读你的星座，签署你的钱包，享受神奇的Web3之旅。`,
    whereIsHoro: `🌍 在哪里`,
    whereIsHoroText: `$HORO存在于horocoin.com，完全在Sui测试网上运行。代币通过我们的dApp分发，仅在我们的Web3学习生态系统中使用。`,
    whenIsHoro: `📅 什么时候`,
    whenIsHoroText: `$HORO持续运行：\n• 每日签到：阅读你的星座并连接你的钱包。\n• 即时奖励：签到时立即领取你的$HORO代币。\n• 连续奖励：更长的每日连续天数获得更大的奖励。`,
    whatsNext: `🔮 接下来`,
    whatsNextText: `我们正在不断扩展$HORO，以包括来自世界各地的更多占星传统。我们的路线图包括增加吠陀占星术、玛雅占星术、凯尔特占星术和许多其他文化星座系统，以确保所有传统都得到适当的代表和尊重。`,
    whyHoro: `🤔 为什么`,
    whyHoroText: `$HORO的存在是为了以有趣、低压力的方式向星座爱好者和Web2用户介绍Web3基础知识。没有交易，没有波动性，只是形成习惯的宇宙游戏。`,
    
    // Tokenomics
    tokenomics: `💰 $HORO代币经济学`,
    totalSupplyTitle: `📦 总供应量`,
    totalSupply: `10万亿 $HORO`,
    fixedSupply: `固定总供应量。一次铸造，无通胀，无重新铸造。`,
    allocationBreakdown: `🧮 分配明细`,
    dailyClaims: `每日领取`,
    contractAddress: `合约地址`,
    dailyClaimsAmount: `10万亿代币`, 
    totalSupplyAmount: `10万亿代币`,
    
    // Help
    help: `帮助`,
    helpTitle: `💡 帮助与支持`,
    switchToTestnet: `🔄 将钱包切换到测试网`,
    switchToTestnetText: `要使用此应用，您的钱包必须连接到Sui测试网：\n\n1. 打开您的钱包扩展\n2. 点击网络下拉菜单（通常显示"主网"）\n3. 从列表中选择"测试网"\n4. 刷新此页面并重新连接您的钱包\n\n如果您没有看到测试网选项，请确保您有最新版本的钱包。`,
    needTestnetSui: `💧 需要测试网SUI？`,
    needTestnetSuiText: `测试网SUI代币是免费的，gas费用需要：\n\n1. 从您的钱包复制您的钱包地址\n2. 访问：faucet.testnet.sui.io\n3. 粘贴您的地址并请求SUI\n4. 等待30秒让代币到达\n\n您只需要做一次 - 少量就足够进行许多交易。`,
    troubleshooting: `🔧 故障排除`,
    troubleshootingText: `常见问题和解决方案：\n\n• 钱包无法连接：确保您的钱包已安装并解锁\n• 领取不工作：检查您在测试网上并有gas\n• 进度不显示：刷新页面并重新连接钱包\n• 代币丢失：验证网络并检查水龙头\n\n仍有问题？这是一个用于学习的测试网应用 - 没有真钱参与！`
  },
  'zh-TR': {
    aboutHoro: `❓ 關於$HORO`,
    whatIsHoro: `🧭 什麼`,
    whatIsHoroText: `$HORO是建立在Sui測試網上的Web3星座體驗。用戶通過查看星座獲得免費的$HORO代幣——無需購買、無gas費用、無需加密貨幣知識。\n\n這是一個有趣的教育代幣，沒有金融用途或投機價值。只需閱讀你的星座，簽署你的錢包，享受神奇的Web3之旅。`,
    whereIsHoro: `🌍 在哪裡`,
    whereIsHoroText: `$HORO存在於horocoin.com，完全在Sui測試網上運行。代幣通過我們的dApp分發，僅在我們的Web3學習生態系統中使用。`,
    whenIsHoro: `📅 什麼時候`,
    whenIsHoroText: `$HORO持續運行：\n• 每日簽到：閱讀你的星座並連接你的錢包。\n• 即時獎勵：簽到時立即領取你的$HORO代幣。\n• 連續獎勵：更長的每日連續天數獲得更大的獎勵。`,
    whatsNext: `🔮 接下來`,
    whatsNextText: `我們正在不斷擴展$HORO，以包括來自世界各地的更多占星傳統。我們的路線圖包括增加吠陀占星術、瑪雅占星術、凱爾特占星術和許多其他文化星座系統，以確保所有傳統都得到適當的代表和尊重。`,
    whyHoro: `🤔 為什麼`,
    whyHoroText: `$HORO的存在是為了以有趣、低壓力的方式向星座愛好者和Web2用戶介紹Web3基礎知識。沒有交易，沒有波動性，只是形成習慣的宇宙遊戲。`,
    
    // Tokenomics
    tokenomics: `💰 $HORO代幣經濟學`,
    totalSupplyTitle: `📦 總供應量`,
    totalSupply: `10兆 $HORO`,
    fixedSupply: `固定總供應量。一次鑄造，無通脹，無重新鑄造。`,
    allocationBreakdown: `🧮 分配明細`,
    dailyClaims: `每日領取`,
    ecosystemRewards: `生態系統獎勵`,
    socialEngagement: `社交參與`,
    developerInfraSupport: `開發者/基礎設施支持`,
    futureSurprises: `未來驚喜`,
    contractAddress: `合約地址`,
    dailyClaimsAmount: `9兆代幣`,
    ecosystemRewardsAmount: `5000億代幣`,
    socialEngagementAmount: `3000億代幣`,
    developerInfraSupportAmount: `1000億代幣`,
    futureSurprisesAmount: `1000億代幣`,
    totalSupplyAmount: `10兆代幣`,
    
    // Help
    help: `幫助`,
    helpTitle: `💡 幫助與支援`,
    switchToTestnet: `🔄 將錢包切換到測試網`,
    switchToTestnetText: `要使用此應用，您的錢包必須連接到Sui測試網：\n\n1. 打開您的錢包擴展\n2. 點擊網路下拉選單（通常顯示「主網」）\n3. 從列表中選擇「測試網」\n4. 刷新此頁面並重新連接您的錢包\n\n如果您沒有看到測試網選項，請確保您有最新版本的錢包。`,
    needTestnetSui: `💧 需要測試網SUI？`,
    needTestnetSuiText: `測試網SUI代幣是免費的，gas費用需要：\n\n1. 從您的錢包複製您的錢包地址\n2. 訪問：faucet.testnet.sui.io\n3. 貼上您的地址並請求SUI\n4. 等待30秒讓代幣到達\n\n您只需要做一次 - 少量就足夠進行許多交易。`,
    troubleshooting: `🔧 故障排除`,
    troubleshootingText: `常見問題和解決方案：\n\n• 錢包無法連接：確保您的錢包已安裝並解鎖\n• 領取不工作：檢查您在測試網上並有gas\n• 進度不顯示：刷新頁面並重新連接錢包\n• 代幣遺失：驗證網路並檢查水龍頭\n\n仍有問題？這是一個用於學習的測試網應用 - 沒有真錢參與！`
  },
  ru: {
    aboutHoro: `❓ О $HORO`,
    whatIsHoro: `🧭 Что`,
    whatIsHoroText: `$HORO — это Web3-опыт гороскопов, построенный на тестнете Sui. Пользователи получают бесплатные токены $HORO за проверку своего гороскопа — никаких покупок, никаких комиссий за газ, никаких знаний о криптовалютах не требуется.\n\nЭто веселый и образовательный токен без финансовой полезности или спекулятивной ценности. Просто читайте свои звезды, подписывайтесь кошельком и наслаждайтесь магическим Web3-путешествием.`,
    whereIsHoro: `🌍 Где`,
    whereIsHoroText: `$HORO живет на horocoin.com и работает полностью на тестнете Sui. Токены распространяются через наше dApp и используются только в нашей экосистеме обучения Web3.`,
    whenIsHoro: `📅 Когда`,
    whenIsHoroText: `$HORO работает непрерывно с:\n• Ежедневные отметки: Читайте свой гороскоп и подключайте кошелек.\n• Мгновенные награды: Получайте токены $HORO сразу при отметке.\n• Бонусы за серии: Более длинные ежедневные серии дают большие награды.`,
    whatsNext: `🔮 Что Дальше`,
    whatsNextText: `Мы постоянно расширяем $HORO, чтобы включить больше астрологических традиций со всего мира. Наша дорожная карта включает добавление ведической астрологии, астрологии майя, кельтской астрологии и многих других культурных зодиакальных систем, чтобы обеспечить надлежащее представление и уважение всех традиций.`,
    whyHoro: `🤔 Почему`,
    whyHoroText: `$HORO существует для того, чтобы познакомить любителей астрологии и пользователей Web2 с основами Web3 веселым, непринужденным способом. Никакой торговли, никакой волатильности, только формирующая привычки космическая игра.`,
    
    // Tokenomics
    tokenomics: `💰 Токеномика $HORO`,
    totalSupplyTitle: `📦 Общее Предложение`,
    totalSupply: `10трлн $HORO`,
    fixedSupply: `Фиксированное общее предложение. Отчеканено один раз, без инфляции, без перечеканки.`,
    allocationBreakdown: `🧮 Разбивка Распределения`,
    dailyClaims: `Ежедневные Претензии`,
    contractAddress: `Адрес Контракта`,
    dailyClaimsAmount: `10трлн токенов`,
    totalSupplyAmount: `10трлн токенов`,
    
    // Help
    help: `Помощь`,
    helpTitle: `💡 Помощь и Поддержка`,
    switchToTestnet: `🔄 Переключить Кошелек на Тестнет`,
    switchToTestnetText: `Для использования этого приложения ваш кошелек должен быть подключен к Sui Testnet:\n\n1. Откройте расширение кошелька\n2. Нажмите на выпадающее меню сети (обычно показывает 'Mainnet')\n3. Выберите 'Testnet' из списка\n4. Обновите эту страницу и переподключите кошелек\n\nЕсли вы не видите опцию Testnet, убедитесь, что у вас последняя версия кошелька.`,
    needTestnetSui: `💧 Нужен Testnet SUI?`,
    needTestnetSuiText: `Токены Testnet SUI бесплатны и нужны для комиссий за газ:\n\n1. Скопируйте адрес вашего кошелька из вашего кошелька\n2. Посетите: faucet.testnet.sui.io\n3. Вставьте ваш адрес и запросите SUI\n4. Подождите 30 секунд, пока токены прибудут\n\nВам нужно сделать это только один раз - небольшого количества хватает на много транзакций.`,
    troubleshooting: `🔧 Устранение Неполадок`,
    troubleshootingText: `Частые проблемы и решения:\n\n• Кошелек не подключается: Убедитесь, что ваш кошелек установлен и разблокирован\n• Требования не работают: Проверьте, что вы в Testnet и у вас есть газ\n• Прогресс не отображается: Обновите страницу и переподключите кошелек\n• Отсутствующие токены: Проверьте сеть и краник\n\nВсе еще проблемы? Это приложение testnet для обучения - никаких реальных денег не задействовано!`
  },
  fr: {
    aboutHoro: `❓ À propos de $HORO`,
    whatIsHoro: `🧭 Quoi`,
    whatIsHoroText: `$HORO est une dApp d'horoscope Web3 construite sur le testnet Sui. Les utilisateurs reçoivent des tokens $HORO gratuits pour consulter leur horoscope — aucun achat, aucun frais de gas, aucune connaissance crypto requise.\n\nC'est un token amusant et éducatif sans utilité financière ou valeur spéculative. Lisez simplement vos étoiles, signez avec votre portefeuille et profitez d'un voyage Web3 magique.`,
    whereIsHoro: `🌍 Où`,
    whereIsHoroText: `$HORO vit sur horocoin.com et fonctionne entièrement sur le testnet Sui. Les tokens sont distribués via notre dApp et utilisés uniquement dans notre écosystème d'apprentissage Web3.`,
    whenIsHoro: `📅 Quand`,
    whenIsHoroText: `$HORO fonctionne en continu avec :\n• Enregistrements quotidiens : Lisez votre horoscope et connectez votre portefeuille.\n• Récompenses instantanées : Réclamez vos tokens $HORO immédiatement lors de l'enregistrement.\n• Bonus de série : Des séries quotidiennes plus longues donnent de plus grandes récompenses.`,
    whatsNext: `🔮 Et Ensuite`,
    whatsNextText: `Nous élargissons continuellement $HORO pour inclure plus de traditions astrologiques du monde entier. Notre feuille de route comprend l'ajout de l'astrologie védique, l'astrologie maya, l'astrologie celtique et de nombreux autres systèmes zodiacaux culturels pour s'assurer que toutes les traditions sont correctement représentées et honorées.`,
    whyHoro: `🤔 Pourquoi`,
    whyHoroText: `$HORO existe pour introduire les amateurs d'astrologie et les utilisateurs Web2 aux bases du Web3 de manière amusante et sans pression. Pas de trading, pas de volatilité, juste un jeu cosmique formant des habitudes.`,
    
    // Tokenomics
    tokenomics: `💰 Tokenomique $HORO`,
    totalSupplyTitle: `📦 Offre Totale`,
    totalSupply: `10T $HORO`,
    fixedSupply: `Offre totale fixe. Frappé une fois, pas d'inflation, pas de re-frappe.`,
    allocationBreakdown: `🧮 Répartition de l'Allocation`,
    dailyClaims: `Réclamations Quotidiennes`,
    contractAddress: `Adresse du Contrat`,
    dailyClaimsAmount: `10T tokens`, 
    totalSupplyAmount: `10T tokens`,
    
    // Help
    help: `Aide`,
    helpTitle: `💡 Aide et Support`,
    switchToTestnet: `🔄 Changer Portefeuille vers Testnet`,
    switchToTestnetText: `Pour utiliser cette app, votre portefeuille doit être connecté au Sui Testnet :\n\n1. Ouvrez votre extension de portefeuille\n2. Cliquez sur le menu déroulant de réseau (affiche généralement 'Mainnet')\n3. Sélectionnez 'Testnet' dans la liste\n4. Actualisez cette page et reconnectez votre portefeuille\n\nSi vous ne voyez pas l'option Testnet, assurez-vous d'avoir la dernière version de votre portefeuille.`,
    needTestnetSui: `💧 Besoin de SUI Testnet ?`,
    needTestnetSuiText: `Les tokens SUI testnet sont gratuits et nécessaires pour les frais de gas :\n\n1. Copiez l'adresse de votre portefeuille depuis votre portefeuille\n2. Visitez : faucet.testnet.sui.io\n3. Collez votre adresse et demandez SUI\n4. Attendez 30 secondes que les tokens arrivent\n\nVous n'avez besoin de le faire qu'une fois - une petite quantité suffit pour de nombreuses transactions.`,
    troubleshooting: `🔧 Dépannage`,
    troubleshootingText: `Problèmes courants et solutions :\n\n• Le portefeuille ne se connecte pas : Assurez-vous que votre portefeuille est installé et déverrouillé\n• Les réclamations ne fonctionnent pas : Vérifiez que vous êtes sur Testnet et avez du gas\n• Le progrès ne s'affiche pas : Actualisez la page et reconnectez le portefeuille\n• Tokens manquants : Vérifiez le réseau et le robinet\n\nToujours des problèmes ? C'est une app testnet pour apprendre - aucun vrai argent impliqué !`
  },
  pt: {
    aboutHoro: `❓ Sobre $HORO`,
    whatIsHoro: `🧭 O que`,
    whatIsHoroText: `$HORO é uma dApp de horóscopo Web3 construída na testnet Sui. Usuários recebem tokens $HORO gratuitos por verificar seu horóscopo — sem compras, sem taxas de gas, sem conhecimento cripto necessário.\n\nEste é um token divertido e educativo sem utilidade financeira ou valor especulativo. Apenas leia suas estrelas, assine com sua carteira e desfrute de uma jornada Web3 mágica e estelar!`,
    whereIsHoro: `🌍 Onde`,
    whereIsHoroText: `$HORO vive em horocoin.com e roda inteiramente na testnet Sui. Tokens são distribuídos através de nossa dApp e usados apenas em nosso ecossistema de aprendizado Web3.`,
    whenIsHoro: `📅 Quando`,
    whenIsHoroText: `$HORO roda continuamente com:\n• Check-ins diários: Leia seu horóscopo e conecte sua carteira.\n• Recompensas instantâneas: Reivindique seus tokens $HORO imediatamente ao fazer check-in.\n• Bônus de sequência: Sequências diárias mais longas ganham maiores recompensas.`,
    whatsNext: `🔮 O que Vem a Seguir`,
    whatsNextText: `Estamos continuamente expandindo $HORO para incluir mais tradições astrológicas de todo o mundo. Nosso roadmap inclui adicionar astrologia védica, astrologia maia, astrologia celta e muitos outros sistemas zodiacais culturais para garantir que todas as tradições sejam adequadamente representadas e honradas.`,
    whyHoro: `🤔 Por que`,
    whyHoroText: `$HORO existe para introduzir amantes da astrologia e usuários Web2 aos básicos do Web3 de uma forma divertida e sem pressão. Sem negociação, sem volatilidade, apenas interação cósmica que forma hábitos e é alimentada por blockchain.`,
    
    // Tokenomics
    tokenomics: `💰 Tokenômica $HORO`,
    totalSupplyTitle: `📦 Fornecimento Total`,
    totalSupply: `10T $HORO`,
    fixedSupply: `Fornecimento total fixo. Cunhado uma vez, sem inflação, sem re-cunhagem.`,
    allocationBreakdown: `🧮 Detalhamento da Alocação`,
    dailyClaims: `Reivindicações Diárias`,
    contractAddress: `Endereço do Contrato`,
    dailyClaimsAmount: `10T tokens`,
    totalSupplyAmount: `10T tokens`,
    
    // Help
    help: `Ajuda`,
    helpTitle: `💡 Ajuda e Suporte`,
    switchToTestnet: `🔄 Mudar Carteira para Testnet`,
    switchToTestnetText: `Para usar este app, sua carteira deve estar conectada à Sui Testnet:\n\n1. Abra sua extensão de carteira\n2. Clique no dropdown de rede (geralmente mostra 'Mainnet')\n3. Selecione 'Testnet' da lista\n4. Atualize esta página e reconecte sua carteira\n\nSe você não vê a opção Testnet, certifique-se de ter a versão mais recente de sua carteira.`,
    needTestnetSui: `💧 Precisa de SUI Testnet?`,
    needTestnetSuiText: `Tokens SUI testnet são gratuitos e necessários para taxas de gas:\n\n1. Copie o endereço de sua carteira da sua carteira\n2. Visite: faucet.testnet.sui.io\n3. Cole seu endereço e solicite SUI\n4. Aguarde 30 segundos para os tokens chegarem\n\nVocê só precisa fazer isso uma vez - uma pequena quantidade dura para muitas transações.`,
    troubleshooting: `🔧 Solução de Problemas`,
    troubleshootingText: `Problemas comuns e soluções:\n\n• Carteira não conecta: Certifique-se de que sua carteira esteja instalada e desbloqueada\n• Reivindicações não funcionam: Verifique se você está na Testnet e tem gas\n• Progresso não aparece: Atualize a página e reconecte a carteira\n• Tokens em falta: Verifique a rede e a torneira\n\nAinda com problemas? Este é um app testnet para aprender - sem dinheiro real envolvido!`
  }
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-red-900/30 rounded-xl p-6 border border-red-500/30">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-300 mb-6">The app encountered an unexpected error. Please refresh the page to try again.</p>
              <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading Spinner Component
const LoadingSpinner = ({ size = "h-5 w-5" }) => (
  <div className={`animate-spin rounded-full ${size} border-2 border-white border-t-transparent`}></div>
);

// Gas Management Component
const GasManager = ({ currentAccount, suiClient, t }) => {
  const [gasBalance, setGasBalance] = useState(null);
  const [isRequestingGas, setIsRequestingGas] = useState(false);
  const [gasStatus, setGasStatus] = useState('checking');

  const MIN_GAS_BALANCE = 50_000_000;

  const checkGasBalance = async () => {
    if (!!!currentAccount || !currentAccount?.address) return;
    
    try {
      const balance = await suiClient.getBalance({
        owner: currentAccount?.address,
        coinType: '0x2::sui::SUI'
      });
      
      const totalBalance = parseInt(balance.totalBalance);
      setGasBalance(totalBalance);
      setGasStatus(totalBalance >= MIN_GAS_BALANCE ? 'sufficient' : 'low');
    } catch (error) {
      console.error('Failed to check gas balance:', error);
      setGasStatus('low');
    }
  };

  const requestTestnetGas = async () => {
    if (!currentAccount?.address || isRequestingGas) return;
    
    setIsRequestingGas(true);
    
    try {
      const faucetUrl = `https://faucet.testnet.sui.io/`;
      window.open(faucetUrl, '_blank');
      
      alert(`🚰 Testnet Faucet opened in new tab!\n\n📋 Your address: ${currentAccount?.address}\n\n1. Please paste your address in the faucet\n2. Please click "Request SUI"\n3. Please come back here and try again\n\n(This takes ~30 seconds)`);
      
      setTimeout(() => {
        checkGasBalance();
        setIsRequestingGas(false);
      }, 5000);
      
    } catch (error) {
      console.error('Failed to open faucet:', error);
      alert(t('gasError') || 'Failed to open faucet');
      setIsRequestingGas(false);
    }
  };

  const formatSuiAmount = (amount) => {
    if (!amount) return '0';
    return (amount / 1_000_000_000).toFixed(4);
  };

  React.useEffect(() => {
    if (!!currentAccount && currentAccount?.address) {
      checkGasBalance();
    } else {
      setGasBalance(null);
      setGasStatus('checking');
    }
  }, [!!currentAccount, currentAccount?.address]);

  if (!!!currentAccount) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{t('gasBalance') || 'Gas Balance'}:</span>
        <span className={gasStatus === 'sufficient' ? 'text-green-400' : 'text-yellow-400'}>
          {gasBalance !== null ? `${formatSuiAmount(gasBalance)} SUI` : 'Loading...'}
        </span>
      </div>

      {gasStatus === 'low' && (
        <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-400/30">
          <div className="text-center space-y-3">
            <p className="text-yellow-300 font-semibold text-sm">{t('gasLow') || '⛽ Low Gas Balance'}</p>
            <p className="text-yellow-200 text-xs">{t('gasNeeded') || 'Please add testnet SUI to your wallet for transactions'}</p>
            <button
              onClick={requestTestnetGas}
              disabled={isRequestingGas}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 mx-auto"
            >
              {isRequestingGas ? (
                <>
                  <LoadingSpinner size="h-4 w-4" />
                  <span>{t('gettingGas') || 'Opening faucet...'}</span>
                </>
              ) : (
                <span>{t('getFreeGas') || 'Open Testnet Faucet'}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {gasStatus === 'sufficient' && (
        <div className="text-center">
          <p className="text-green-400 text-xs">{t('sufficientGas') || '✅ Sufficient gas for transactions'}</p>
        </div>
      )}
    </div>
  );
};

// SUI Blockchain Time Management with improved consistency
const useSuiTime = () => {
  const [suiTimeData, setSuiTimeData] = useState({
    timestamp: null,
    dayOfWeek: null,
    currentDay: null,
    weekNumber: null,
    year: null,
    isLoaded: false,
    error: null
  });

  // Get SUI blockchain time directly from Clock object with improved error handling
  const getSuiTime = async (suiClient) => {
    try {
      console.log('🕒 Fetching SUI blockchain time...');
      
      if (!suiClient) {
        throw new Error('SUI client not available');
      }
      
      // Get the SUI Clock object to read current timestamp
      const clockObject = await suiClient.getObject({
        id: '0x6', // SUI Clock singleton object
        options: { showContent: true }
      });
      
      console.log('🕒 Clock object:', clockObject);
      
      if (clockObject.data?.content?.fields?.timestamp_ms) {
        const timestampMs = parseInt(clockObject.data.content.fields.timestamp_ms);
        const timestampSeconds = Math.floor(timestampMs / 1000);
        
        // Calculate day of week using SUI timestamp (same as contract logic)
        // SUI epoch started on a Thursday (day 4), so we adjust accordingly
        const daysSinceEpoch = Math.floor(timestampSeconds / 86400);
        const dayOfWeek = (daysSinceEpoch + 4) % 7; // +4 because epoch started on Thursday
        
        // Calculate week number and year - use the same logic as the contract
        const daysSinceSunday = (daysSinceEpoch + 4) % 7; // Calculate days since Sunday
        const sundayOfCurrentWeek = daysSinceEpoch - daysSinceSunday;
        const weekNumber = Math.floor(sundayOfCurrentWeek / 7);
        
        // Calculate year (simplified but consistent)
        const yearsSince2024 = Math.floor((daysSinceEpoch - 19723) / 365); // 19723 is days from epoch to 2024-01-01
        const year = 2024 + yearsSince2024;
        
        console.log('🕒 SUI time calculated:', {
          timestampMs,
          timestampSeconds,
          daysSinceEpoch,
          dayOfWeek,
          weekNumber,
          year,
          humanReadable: new Date(timestampMs).toISOString()
        });
        
        const timeData = {
          timestamp: timestampMs,
          dayOfWeek,
          currentDay: daysSinceEpoch,
          weekNumber,
          year,
          isLoaded: true,
          error: null
        };
        
        setSuiTimeData(timeData);
        return timeData;
      } else {
        throw new Error('Unable to read timestamp from SUI Clock object');
      }
    } catch (error) {
      console.error('❌ Failed to get SUI time:', error);
      
      // Improved fallback using UTC time to match blockchain calculations
      const utcNow = new Date();
      const utcTimestamp = utcNow.getTime();
      const utcSeconds = Math.floor(utcTimestamp / 1000);
      const utcDaysSinceEpoch = Math.floor(utcSeconds / 86400);
      const utcDayOfWeek = (utcDaysSinceEpoch + 4) % 7; // Same calculation as SUI
      
      // Use same week calculation logic as SUI time
      const daysSinceSunday = (utcDaysSinceEpoch + 4) % 7;
      const sundayOfCurrentWeek = utcDaysSinceEpoch - daysSinceSunday;
      const weekNumber = Math.floor(sundayOfCurrentWeek / 7);
      
      const yearsSince2024 = Math.floor((utcDaysSinceEpoch - 19723) / 365);
      const year = 2024 + yearsSince2024;
      
      console.log('🕒 Using UTC time fallback (consistent with SUI logic):', {
        utcDayOfWeek,
        utcDaysSinceEpoch,
        weekNumber,
        year
      });
      
      const fallbackData = {
        timestamp: utcTimestamp,
        dayOfWeek: utcDayOfWeek,
        currentDay: utcDaysSinceEpoch,
        weekNumber,
        year,
        isLoaded: true,
        error: error.message
      };
      
      setSuiTimeData(fallbackData);
      return fallbackData;
    }
  };

  return { suiTimeData, getSuiTime };
};

// Current zodiac season logic
const getCurrentZodiacSeason = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

const ZODIAC_SIGNS = [
  { name: 'aries', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { name: 'taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
  { name: 'gemini', symbol: '♊', dates: 'May 21 - Jun 20' },
  { name: 'cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { name: 'leo', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { name: 'virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { name: 'libra', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { name: 'scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { name: 'sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { name: 'capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { name: 'aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { name: 'pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' }
];

const CHINESE_ZODIAC_SIGNS = [
  { name: 'rat', symbol: '🐀' },
  { name: 'ox', symbol: '🐂'},
  { name: 'tiger', symbol: '🐅'},
  { name: 'rabbit', symbol: '🐇'},
  { name: 'dragon', symbol: '🐉'},
  { name: 'snake', symbol: '🐍'},
  { name: 'horse', symbol: '🐎'},
  { name: 'goat', symbol: '🐐'},
  { name: 'monkey', symbol: '🐒'},
  { name: 'rooster', symbol: '🐓'},
  { name: 'dog', symbol: '🐕'},
  { name: 'pig', symbol: '🐖'}
];

// Custom Connect Button Component
const CustomConnectButton = ({ t }) => {
  const currentAccount = useCurrentAccount();
  const { connectionStatus } = useCurrentWallet();
  
  if (currentAccount) {
    return (
      <div className="flex flex-col items-center space-y-3">
        <div className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
          {t('connected')}: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="wallet-connect-button">
        <ConnectButton 
          connectText={t('connectWalletButton')}
          connectedText={t('connected')}
        />
      </div>
    </div>
  );
};

// Language Selector Component
const LanguageSelector = ({ currentLanguage, onLanguageChange, textColor = "text-yellow-200" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${textColor} hover:text-white transition-colors text-sm font-medium cursor-pointer flex items-center space-x-1`}
      >
        <Globe className="h-4 w-4" />
        <span>{LANGUAGES[currentLanguage]?.flag}</span>
        <span>{LANGUAGES[currentLanguage]?.name}</span>
      </button>
      
      {isOpen && (
        <div 
          className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-sm rounded-lg border border-gray-600 shadow-lg min-w-max z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {Object.entries(LANGUAGES).map(([code, language]) => (
            <button
              key={code}
              onClick={() => {
                onLanguageChange(code);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors text-white text-sm flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function HoroApp() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const { suiTimeData, getSuiTime } = useSuiTime();
  const [selectedSign, setSelectedSign] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [weeklyProgressByDay, setWeeklyProgressByDay] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('');
  const [stars, setStars] = useState([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showTokenomics, setShowTokenomics] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [autoSigningProgress, setAutoSigningProgress] = useState(false);
  const [language, setLanguage] = useState('en');
  
  // Blockchain claim verification state
  const [blockchainClaimStatus, setBlockchainClaimStatus] = useState('checking');
  const [isVerifyingClaim, setIsVerifyingClaim] = useState(false);
  const [todaysClaimAmount, setTodaysClaimAmount] = useState(0);

  // Translation helper function
  const t = (key, replacements = {}) => {
    let translation = TRANSLATIONS[language]?.[key] || key;
    Object.keys(replacements).forEach(placeholder => {
      translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
    });
    return translation;
  };

  // Modal translation helper
  const mt = (key) => {
    return MODAL_TRANSLATIONS[language]?.[key] || key;
  };

  // Get flag for Western zodiac button based on current language
  const getWesternFlag = () => {
    const westernLanguages = ['en', 'es', 'ru', 'fr'];
    if (westernLanguages.includes(language)) {
      return LANGUAGES[language].flag;
    }
    return '🇺🇸'; // Default to US flag for non-western languages
  };

  // Date formatting helper function
  const formatCurrentDate = () => {
    const now = new Date();
    
    // Language code mapping for Intl.DateTimeFormat
    const localeMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'zh': 'zh-CN',
      'zh-TR': 'zh-TW',
      'ru': 'ru-RU',
      'fr': 'fr-FR'
    };
    
    const locale = localeMap[language] || 'en-US';
    
    try {
      return new Intl.DateTimeFormat(locale, {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(now);
    } catch (error) {
      // Fallback to English format if locale is not supported
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(now);
    }
  };

  // Helper function to get translated day names
  const getDayName = (dayIndex) => {
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return t(dayKeys[dayIndex]);
  };

  const getZodiacSymbol = () => {
    const signs = selectedSystem === 'western' ? ZODIAC_SIGNS : CHINESE_ZODIAC_SIGNS;
    const sign = signs.find(s => s.name === selectedSign);
    return sign ? sign.symbol : '';
  };

  // Get horoscope for current language and system
  const getCurrentHoroscope = () => {
    if (selectedSystem === 'western') {
      return $HOROSCOPES[language]?.[selectedSign] || $HOROSCOPES?.en?.[selectedSign] || 'Your daily horoscope will appear here.';
    } else {
      return CHINESE_$HOROSCOPES[language]?.[selectedSign] || CHINESE_$HOROSCOPES?.en?.[selectedSign] || 'Your daily horoscope will appear here.';
    }
  };

  // Use SUI blockchain time consistently
  const getCurrentDayOfWeek = () => {
    if (suiTimeData.isLoaded && suiTimeData.dayOfWeek !== null) {
      return suiTimeData.dayOfWeek;
    }
    
    // Fallback to UTC time calculation (same as SUI time calculation)
    const utcDate = new Date();
    const utcTimestamp = utcDate.getTime();
    const utcSeconds = Math.floor(utcTimestamp / 1000);
    const utcDaysSinceEpoch = Math.floor(utcSeconds / 86400);
    const utcDayOfWeek = (utcDaysSinceEpoch + 4) % 7; // Same calculation as SUI
    
    return utcDayOfWeek;
  };

  // Get date for a specific day of week using SUI time
  const getDateForDayOfWeek = (dayOfWeek) => {
    if (!suiTimeData.isLoaded || suiTimeData.timestamp === null || suiTimeData.dayOfWeek === null) {
      // Fallback to UTC time to maintain consistency with SUI time
      const today = new Date();
      const utcToday = new Date(today.getTime() + (today.getTimezoneOffset() * 60000));
      const currentDayOfWeek = (Math.floor(utcToday.getTime() / (1000 * 86400)) + 4) % 7;
      const diff = dayOfWeek - currentDayOfWeek;
      const targetDate = new Date(utcToday);
      targetDate.setDate(utcToday.getDate() + diff);
      return targetDate.toISOString().split('T')[0];
    }
    
    // Use SUI blockchain time-based calculation
    const suiDate = new Date(suiTimeData.timestamp);
    const currentSuiDayOfWeek = suiTimeData.dayOfWeek;
    const diff = dayOfWeek - currentSuiDayOfWeek;
    const targetDate = new Date(suiDate);
    targetDate.setDate(suiDate.getDate() + diff);
    return targetDate.toISOString().split('T')[0];
  };

  // Check blockchain claim status using SUI time with optional silent mode
  const checkBlockchainClaimStatus = async (silent = false) => {
    if (!!!currentAccount || !currentAccount?.address) {
      setBlockchainClaimStatus('checking');
      return;
    }

    if (!silent) {
      setIsVerifyingClaim(true);
    }
    
    try {
      // Always get fresh SUI time to ensure we have current data
      const currentSuiTime = await getSuiTime(suiClient);
      
      console.log('🔍 Checking blockchain claim status for:', currentAccount?.address);
      console.log('🔍 Using SUI day of week:', currentSuiTime.dayOfWeek);
      
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: (() => {
          const txb = new Transaction();
          txb.moveCall({
            target: `${PACKAGE_ID}::horo::has_claimed_today`,
            arguments: [
              txb.object(CLAIMS_ID),
              txb.object('0x6'), // Sui Clock object
              txb.pure.address(currentAccount?.address)
            ]
          });
          return txb;
        })(),
        sender: currentAccount?.address,
      });

      console.log('🔍 Has claimed today result:', result);
      
      if (result.results && result.results[0] && result.results[0].returnValues && result.results[0].returnValues[0]) {
        const returnValue = result.results[0].returnValues[0];
        let hasClaimed = false;
        
        if (Array.isArray(returnValue) && returnValue.length >= 2) {
          const dataArray = returnValue[0];
          if (Array.isArray(dataArray) && dataArray.length > 0) {
            hasClaimed = dataArray[0] === 1;
          }
        }
        
        console.log('🔍 Has claimed today (parsed):', hasClaimed);
        console.log('🔍 Based on SUI time, today is day:', currentSuiTime.dayOfWeek);
        setBlockchainClaimStatus(hasClaimed ? 'claimed' : 'not_claimed');
      } else {
        setBlockchainClaimStatus('not_claimed');
      }
    } catch (error) {
      console.error('❌ Failed to check has_claimed_today:', error);
      setBlockchainClaimStatus('not_claimed');
    }
    
    if (!silent) {
      setIsVerifyingClaim(false);
    }
  };

  // Improved ULEB128 decoding function
  const decodeULEB128 = (data, offset) => {
    let value = 0;
    let shift = 0;
    let currentOffset = offset;
    
    while (currentOffset < data.length) {
      const byte = data[currentOffset];
      value |= (byte & 0x7F) << shift;
      currentOffset++;
      
      if ((byte & 0x80) === 0) {
        break;
      }
      
      shift += 7;
      if (shift >= 64) {
        throw new Error('ULEB128 value too large');
      }
    }
    
    return { value, nextOffset: currentOffset };
  };

  // Improved little-endian u64 parsing with endianness verification
  const parseU64LittleEndian = (data, offset) => {
    if (offset + 8 > data.length) {
      throw new Error(`Not enough bytes for u64 at offset ${offset}, need 8 bytes but only ${data.length - offset} available`);
    }
    
    // Parse as little-endian u64
    let value = 0;
    for (let i = 0; i < 8; i++) {
      const byte = data[offset + i];
      value += byte * Math.pow(256, i);
    }
    
    // Verify the result is within safe JavaScript integer range
    if (value > Number.MAX_SAFE_INTEGER) {
      console.warn(`Warning: u64 value ${value} exceeds MAX_SAFE_INTEGER, precision may be lost`);
    }
    
    return value;
  };

  // Load weekly progress using SUI time with improved error handling
  const loadWeeklyProgress = async () => {
    if (!currentAccount?.address) {
      setWeeklyProgressByDay({});
      return;
    }
    
    setIsLoading(true);
    try {
      // Always get fresh SUI time to ensure we have current data
      const currentSuiTime = await getSuiTime(suiClient);
      
      console.log('📊 Loading weekly progress from blockchain for:', currentAccount?.address);
      console.log('📊 SUI day of week:', currentSuiTime.dayOfWeek);
      console.log('📊 SUI current day:', currentSuiTime.currentDay);
      
      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: (() => {
          const txb = new Transaction();
          txb.moveCall({
            target: `${PACKAGE_ID}::horo::get_weekly_progress`,
            arguments: [
              txb.object(PROGRESS_REGISTRY_ID),
              txb.pure.address(currentAccount?.address),
              txb.object('0x6'), // Clock
            ]
          });
          return txb;
        })(),
        sender: currentAccount?.address,
      });
      
      console.log('📊 Blockchain progress query result:', result);
      
      const weeklyData = parseWeeklyProgressResult(result);
      setWeeklyProgressByDay(weeklyData);
      
      console.log('📊 Parsed weekly progress by day:', weeklyData);
      console.log('📊 Number of days with progress:', Object.keys(weeklyData).length);
      
      // Log each day's progress using translated day names
      Object.keys(weeklyData).forEach(dayOfWeek => {
        console.log(`📊 ${getDayName(dayOfWeek)} (${dayOfWeek}): ${weeklyData[dayOfWeek].dailyReward} $HORO`);
      });
      
    } catch (error) {
      console.error('❌ Failed to load weekly progress from blockchain:', error);
      setWeeklyProgressByDay({});
    }
    setIsLoading(false);
  };

  // Parse weekly progress result from blockchain with improved error handling
  const parseWeeklyProgressResult = (result) => {
    try {
      console.log('🔍 Full blockchain result:', JSON.stringify(result, null, 2));
      
      if (result.results && result.results[0] && result.results[0].returnValues && result.results[0].returnValues[0]) {
        const returnValue = result.results[0].returnValues[0];
        console.log('🔍 Raw progress return value:', returnValue);
        
        if (Array.isArray(returnValue) && returnValue.length >= 1) {
          const serializedData = returnValue[0]; // This is the serialized byte array
          console.log('🔍 Serialized data:', serializedData);
          console.log('🔍 Serialized data length:', serializedData.length);
          
          if (Array.isArray(serializedData) && serializedData.length > 0) {
            return parseFlatClaimData(serializedData);
          }
        }
      }
      
      console.log('🔍 No valid return values found');
      return {};
    } catch (error) {
      console.error('❌ Error parsing weekly progress:', error);
      return {};
    }
  };

  // Parse flat claim data from Move vector serialization with proper ULEB128 and complete field parsing
  const parseFlatClaimData = (data) => {
    const progressByDay = {};
    let offset = 0;
    
    console.log('🔍 Parsing flat claim data, total bytes:', data.length);
    
    if (offset >= data.length) {
      console.log('🔍 No data to parse');
      return {};
    }
    
    try {
      // Parse vector length using ULEB128
      const { value: vectorLength, nextOffset } = decodeULEB128(data, offset);
      offset = nextOffset;
      console.log('🔍 Vector contains', vectorLength, 'claims');
      
      // Parse each DailyClaimInfo struct in the vector
      for (let i = 0; i < vectorLength; i++) {
        try {
          const result = parseSingleClaim(data, offset);
          if (result.claim) {
            progressByDay[result.claim.dayOfWeek] = result.claim;
            console.log(`✅ Parsed claim ${i} for day ${result.claim.dayOfWeek}:`, result.claim);
            offset = result.nextOffset;
          } else {
            console.log(`🔍 Failed to parse claim ${i} at offset:`, offset);
            // Try to skip this claim and continue with the next one
            console.log('🔍 Attempting to skip malformed claim and continue...');
            break;
          }
        } catch (error) {
          console.error(`❌ Error parsing claim ${i} at offset`, offset, ':', error);
          // Try to recover by skipping some bytes, but this is risky
          console.log('🔍 Attempting recovery by skipping claim...');
          break;
        }
      }
    } catch (error) {
      console.error('❌ Error parsing vector length:', error);
      return {};
    }
    
    console.log('📊 Final progressByDay object:', progressByDay);
    return progressByDay;
  };

  // Parse a single DailyClaimInfo struct - FIXED to include all 6 fields
  const parseSingleClaim = (data, startOffset) => {
    let offset = startOffset;
    
    console.log(`🔍 Parsing single claim starting at offset ${offset}`);
    
    if (offset >= data.length) {
      throw new Error('Offset beyond data length');
    }
    
    try {
      // Parse day_of_week (u8 - 1 byte)
      const dayOfWeek = data[offset];
      offset += 1;
      console.log(`🔍 Day of week: ${dayOfWeek}`);
      
      if (dayOfWeek > 6) {
        throw new Error(`Invalid day of week: ${dayOfWeek}`);
      }
      
      // Parse amount_claimed (u64 - 8 bytes, little endian)
      const amount = parseU64LittleEndian(data, offset);
      offset += 8;
      console.log(`🔍 Amount: ${amount} (${Math.floor(amount / 1_000_000)} $HORO)`);
      
      // Parse timestamp (u64 - 8 bytes, little endian)
      const timestamp = parseU64LittleEndian(data, offset);
      offset += 8;
      console.log(`🔍 Timestamp: ${timestamp}`);
      
      // Parse zodiac_sign vector (ULEB128 length prefix + bytes)
      const { value: zodiacLength, nextOffset: afterZodiacLength } = decodeULEB128(data, offset);
      offset = afterZodiacLength;
      console.log(`🔍 Zodiac sign length: ${zodiacLength}`);
      
      // Parse zodiac_sign bytes
      if (offset + zodiacLength > data.length) {
        throw new Error(`Not enough bytes for zodiac sign, need ${zodiacLength} bytes but only ${data.length - offset} available`);
      }
      
      const zodiacBytes = data.slice(offset, offset + zodiacLength);
      offset += zodiacLength;
      
      let zodiacSign = '';
      try {
        if (zodiacLength > 0) {
          zodiacSign = new TextDecoder().decode(new Uint8Array(zodiacBytes));
        }
      } catch (e) {
        console.warn('Failed to decode zodiac sign:', e);
        zodiacSign = 'unknown';
      }
      console.log(`🔍 Zodiac sign: "${zodiacSign}"`);
      
      // Parse claim_day (u64 - 8 bytes, little endian)
      const claimDay = parseU64LittleEndian(data, offset);
      offset += 8;
      console.log(`🔍 Claim day: ${claimDay}`);
      
      // Parse streak_at_claim (u64 - 8 bytes, little endian) - THIS WAS MISSING!
      const streakAtClaim = parseU64LittleEndian(data, offset);
      offset += 8;
      console.log(`🔍 Streak at claim: ${streakAtClaim}`);
      
      const claim = {
        dayOfWeek,
        amount: amount,
        dailyReward: Math.floor(amount / 1_000_000), // Convert from 6 decimals to display value
        timestamp,
        zodiacSign,
        claimDay,
        streakAtClaim, // Now included!
        date: getDateForDayOfWeek(dayOfWeek)
      };
      
      console.log(`✅ Successfully parsed complete claim:`, claim);
      return { claim, nextOffset: offset };
      
    } catch (error) {
      console.error(`❌ Error parsing claim at offset ${offset}:`, error);
      return { claim: null, nextOffset: offset };
    }
  };

  const calculateDailyReward = (dayCount) => {
    const baseReward = 10;
    const streakBonus = Math.floor(dayCount / 3) * 5;
    return baseReward + streakBonus;
  };

  // Get daily streak from blockchain data
  const getDailyStreak = () => {
    return Object.keys(weeklyProgressByDay).length;
  };

  // Check if today is completed using both blockchain and localStorage data
  const isTodayCompleted = () => {
    const currentDayOfWeek = getCurrentDayOfWeek();
    const hasProgressToday = weeklyProgressByDay[currentDayOfWeek];
    return blockchainClaimStatus === 'claimed' || !!hasProgressToday;
  };

  // Update today's claim amount from blockchain data
  const updateTodaysClaimAmount = () => {
    const currentDayOfWeek = getCurrentDayOfWeek();
    const todaysProgress = weeklyProgressByDay[currentDayOfWeek];
    
    if (blockchainClaimStatus === 'claimed' || todaysProgress) {
      if (todaysProgress && todaysProgress.dailyReward) {
        setTodaysClaimAmount(todaysProgress.dailyReward);
      } else {
        // Wait for blockchain data to load before showing estimated amount
        if (Object.keys(weeklyProgressByDay).length === 0) {
          setTodaysClaimAmount(0); // Don't show estimate until data loads
          return;
        }
        const currentStreak = getDailyStreak();
        const estimatedAmount = calculateDailyReward(currentStreak + 1); // +1 for today's claim
        setTodaysClaimAmount(estimatedAmount);
      }
    } else {
      setTodaysClaimAmount(0);
    }
  };
  
  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem('horoLanguage');
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('horoLanguage', language);
  }, [language]);

  useEffect(() => {
    const season = getCurrentZodiacSeason();
    setCurrentSeason(season);
    
    const newStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 3 + 4
    }));
    setStars(newStars);

    // Check for saved zodiac sign
    const savedSign = localStorage.getItem('horoZodiacSign');
    const savedSystem = localStorage.getItem('horoZodiacSystem');
    if (savedSign && savedSystem) {
      setSelectedSign(savedSign);
      setSelectedSystem(savedSystem);
    }
  }, [!!currentAccount, language]);

  // Initialize SUI time and then check claim status, plus periodic status checking
  useEffect(() => {
    let statusCheckInterval;
    
    if (!!currentAccount && currentAccount?.address && selectedSign) {
      // Get SUI time first, then check status and load progress
      getSuiTime(suiClient).then((currentSuiTime) => {
        console.log('🕒 SUI time initialized:', currentSuiTime);
        checkBlockchainClaimStatus();
        loadWeeklyProgress();
      }).catch((error) => {
        console.error('❌ Failed to initialize SUI time:', error);
        // Still try to check status with fallback
        checkBlockchainClaimStatus();
        loadWeeklyProgress();
      });

      // Set up periodic status checking to catch successful transactions (silent mode)
      statusCheckInterval = setInterval(async () => {
        try {
          await checkBlockchainClaimStatus(true); // Silent mode - no UI flicker
          await loadWeeklyProgress();
        } catch (error) {
          console.error('Error in periodic status check:', error);
        }
      }, 5000); // Check every 5 seconds

    } else {
      setBlockchainClaimStatus('checking');
      setTodaysClaimAmount(0);
      setWeeklyProgressByDay({});
    }

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [!!currentAccount, currentAccount?.address, selectedSign]);
  
  useEffect(() => {
    if (!!currentAccount) {
      updateTodaysClaimAmount();
    }
  }, [blockchainClaimStatus, weeklyProgressByDay, suiTimeData]);

  // Claim function with improved error handling
  const claimTodaysHoro = async (sign) => {
    const hasAlreadyClaimed = isTodayCompleted();
    
    if (hasAlreadyClaimed) {
      console.log('❌ Cannot claim: already claimed');
      if (hasAlreadyClaimed) {
        alert(`💫 You've already claimed your daily $HORO! ✨\n\nCome back tomorrow for another cosmic blessing~`);
      }
      return;
    }
    
    setAutoSigningProgress(true);
    
    try {
      // Ensure we have fresh SUI time data
      const currentSuiTime = await getSuiTime(suiClient);
      console.log('🕒 Using SUI time for claim:', currentSuiTime);
      
      const currentStreak = getDailyStreak();
      const dailyReward = calculateDailyReward(currentStreak + 1);
      const amount = dailyReward * 1_000_000; // Convert to 6 decimals
      
      console.log('🚀 Preparing to claim', dailyReward, '$HORO tokens...');
      
      // Validate contract objects
      const treasuryObject = await suiClient.getObject({
        id: TREASURY_ID,
        options: { showContent: true, showType: true }
      });
      
      const claimsObject = await suiClient.getObject({
        id: CLAIMS_ID,
        options: { showContent: true, showType: true }
      });

      const progressObject = await suiClient.getObject({
        id: PROGRESS_REGISTRY_ID,
        options: { showContent: true, showType: true }
      });
      
      if (!claimsObject.data?.type?.includes('DailyClaims')) {
        throw new Error(`Invalid claims object - expected DailyClaims, got: ${claimsObject.data?.type}`);
      }
      
      if (!treasuryObject.data?.type?.includes('Treasury')) {
        throw new Error(`Invalid treasury object - expected Treasury, got: ${treasuryObject.data?.type}`);
      }

      if (!progressObject.data?.type?.includes('UserProgressRegistry')) {
        throw new Error(`Invalid progress registry object - expected UserProgressRegistry, got: ${progressObject.data?.type}`);
      }
      
      console.log('✅ Contract objects validated successfully');
      
      // Convert zodiac sign to bytes for the contract
      const zodiacSignBytes = Array.from(new TextEncoder().encode(sign));
      console.log('🔤 Zodiac sign bytes:', zodiacSignBytes);
      
      // Build transaction
      const txb = new Transaction();
      
      try {
        txb.moveCall({
          target: `${PACKAGE_ID}::horo::claim_daily_reward`,
          arguments: [
            txb.object(TREASURY_ID),
            txb.object(CLAIMS_ID),
            txb.object(PROGRESS_REGISTRY_ID),
            txb.object('0x6'), // Sui Clock object
            txb.pure.u64(amount),
            txb.pure.vector('u8', zodiacSignBytes)
          ]
        });
        
        console.log('📋 Transaction built successfully');
      } catch (buildError) {
        console.error('❌ Transaction build error:', buildError);
        throw new Error(`Failed to build transaction: ${buildError.message}`);
      }
      
      // Sign and execute transaction - simplified approach for wallet compatibility
      console.log('✍️ Requesting wallet signature and execution...');
      
      try {
        const txResult = await signAndExecuteTransaction(
          {
            transaction: txb,
          },
          {
            onSuccess: async (result) => {
              console.log('🎉 Transaction succeeded:', result);
              
              // Update blockchain claim status
              setBlockchainClaimStatus('claimed');
              
              // Reload weekly progress from blockchain
              await loadWeeklyProgress();
              
              alert(`🎉 Daily Check-in Complete!\n\n+${dailyReward} $HORO earned today!\nStreak: ${currentStreak + 1} days\n\nTransaction: ${result.digest || 'completed'}`);
              
              console.log('✅ Daily check-in completed successfully');
            },
            onError: (error) => {
              console.error('❌ Transaction failed:', error);
              throw error;
            }
          }
        );
        
        // For wallets that return the result directly
        if (txResult) {
          console.log('✅ Direct transaction result:', txResult);
          
          const digest = txResult.digest || txResult.transactionDigest || 'completed';
          
          // Update blockchain claim status
          setBlockchainClaimStatus('claimed');
          
          // Reload weekly progress from blockchain  
          await loadWeeklyProgress();
          
          alert(`🎉 Daily Check-in Complete!\n\n+${dailyReward} $HORO earned today!\nStreak: ${currentStreak + 1} days\n\nTransaction: ${digest}`);
        }
        
      } catch (signError) {
        console.error('❌ Transaction error:', signError);
        
        // Check if the error is just a timing issue but transaction might still go through
        if (signError.message && (signError.message.includes('undefined') || signError.message.includes('digest'))) {
          console.log('🔄 Possible timing issue detected, will check status after wallet interaction...');
          
          // Give the wallet time to process and then check status
          setTimeout(async () => {
            try {
              await checkBlockchainClaimStatus(true); // Silent mode
              await loadWeeklyProgress();
              
              // If claim status changed to claimed, show success
              if (blockchainClaimStatus === 'claimed') {
                alert(`🎉 Transaction completed successfully!\n\n+${dailyReward} $HORO earned today!`);
              }
            } catch (recheckError) {
              console.error('Error rechecking status:', recheckError);
            }
          }, 3000);
          
          // Don't throw the error - let the wallet handle the transaction
          return;
        }
        
        throw signError;
      }
    } catch (error) {
      console.error('Daily check-in failed:', error);
      const errorMessage = error.message || error.toString() || '';
      
      console.log('🔍 Full error object:', error);
      
      // Don't show error dialog for timing/undefined issues - these often resolve themselves
      if (errorMessage.includes('undefined') || errorMessage.includes('digest') || errorMessage.includes('Cannot read properties')) {
        console.log('🔄 Suppressing timing-related error dialog, transaction may still succeed');
        return; // Exit gracefully without showing error
      }
      
      if (errorMessage.includes('EAlreadyClaimedToday') || 
          errorMessage.includes('Abort(1)') || 
          errorMessage.includes('), 1)') ||
          errorMessage.includes('MoveAbort') && errorMessage.includes(', 1)') ||
          (errorMessage.includes('Dry run failed') && (errorMessage.includes('1)') || errorMessage.includes('), 1)')))) {
        setBlockchainClaimStatus('claimed');
        alert(`💫 You've already claimed your daily $HORO! ✨\n\nCome back tomorrow for another cosmic blessing~`);
      } else if (errorMessage.includes('EGlobalPeriodLimitExceeded') || errorMessage.includes('Abort(4)')) {
        alert('🌟 The cosmic energy is at maximum capacity right now!\n\nPlease try again in a few hours when the stars realign~ ✨');
      } else if (errorMessage.includes('Insufficient gas')) {
        alert('Need testnet SUI for gas. Please use the "Open Testnet Faucet" button to get free gas!');
      } else if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected') || errorMessage.includes('cancelled')) {
        alert('Transaction was cancelled. No $HORO tokens were awarded.');
      } else {
        alert(`🔮 The cosmic connection seems unstable right now.\n\nError: ${errorMessage.slice(0, 100)}...\n\nPlease try again in a moment!`);
      }
    }
    
    setAutoSigningProgress(false);
  };

  const selectZodiacSign = async (sign) => {
    const weekStart = getWeekStartDate();
    const savedWeekSign = localStorage.getItem(`horoWeekSign_${weekStart}`);
    
    if (savedWeekSign && savedWeekSign !== sign) {
      alert(`You've already selected ${savedWeekSign} for this week. Please continue with your chosen sign or wait until next Monday to change it.`);
      return;
    }
    
    setSelectedSign(sign);
    localStorage.setItem('horoZodiacSign', sign);
    localStorage.setItem('horoZodiacSystem', selectedSystem);
    localStorage.setItem(`horoWeekSign_${weekStart}`, sign);
    
    // Get SUI time and load progress after selecting sign
    if (!!currentAccount) {
      try {
        const currentSuiTime = await getSuiTime(suiClient);
        console.log('🕒 SUI time loaded after sign selection:', currentSuiTime);
        await checkBlockchainClaimStatus();
        await loadWeeklyProgress();
      } catch (error) {
        console.error('❌ Failed to load SUI time after sign selection:', error);
        // Still try to check status with fallback
        await checkBlockchainClaimStatus();
        await loadWeeklyProgress();
      }
    }
  };

  const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
    return startOfWeek.toISOString().split('T')[0];
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Show zodiac system selection if no system selected
  if (!selectedSystem) {
    return (
      <>
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #92400e 100%)'
        }}>
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute text-yellow-200"
              style={{
                left: `${star.x}%`,
                top: '-50px',
                fontSize: `${star.size * 2}px`,
                animation: `fallingStar ${star.duration}s linear infinite`,
                animationDelay: `${star.delay}s`,
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 0, 0.8))',
                zIndex: 10
              }}
            >
              ⭐
            </div>
          ))}

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold text-white mb-4 tracking-wider" style={{
                textShadow: '3px 3px 0px rgba(0,0,0,0.3), 6px 6px 0px rgba(0,0,0,0.1)'
              }}>
                {t('dailyHoro')}
              </h1>
              <p className="text-2xl text-yellow-200 font-semibold">
                {t('chooseZodiacSystem')}
              </p>
            </div>

            <div className="max-w-md w-full space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setSelectedSystem('western')}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-2">{getWesternFlag()}</div>
                  <div className="text-white font-semibold text-lg">{t('western')}</div>
                </button>
                <button
                  onClick={() => setSelectedSystem('chinese')}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-6 rounded-xl transition-all duration-200 transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-2">🇨🇳</div>
                  <div className="text-white font-semibold text-lg">{t('chinese')}</div>
                </button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="flex space-x-4 mb-4 justify-center">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                <Sparkles className="h-8 w-8 text-yellow-200 animate-pulse" style={{animationDelay: '0.3s'}} />
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" style={{animationDelay: '0.6s'}} />
              </div>
              
              <div className="flex space-x-6 text-yellow-200 justify-center">
                <button 
                  onClick={() => setShowAbout(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('about')}
                </button>
                <button 
                  onClick={() => setShowTokenomics(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('tokenomics')}
                </button>
                <button 
                  onClick={() => setShowHelp(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('help')}
                </button>
                <LanguageSelector 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange}
                />
              </div>

              {/* SVAC Static Logo - Centered below footer */}
              <div className="flex justify-center items-center mt-12">
                <div className="text-gray-500">
                  {/* <StaticLogo size="small" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('aboutHoro')}</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatIsHoro')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('whatIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whereIsHoro')}</h3>
                <p className="leading-relaxed">{mt('whereIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whenIsHoro')}</h3>
                <div className="leading-relaxed whitespace-pre-line">{mt('whenIsHoroText')}</div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whyHoro')}</h3>
                <p className="leading-relaxed">{mt('whyHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatsNext')}</h3>
                <p className="leading-relaxed">{mt('whatsNextText')}</p>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tokenomics Modal */}
      {showTokenomics && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowTokenomics(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('tokenomics')}</h2>
              <button 
                onClick={() => setShowTokenomics(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{mt('totalSupplyTitle')}</h3>
                <h4 className="text-2xl font-bold text-white mb-2">{mt('totalSupply')}</h4>
                <p className="text-green-400 font-semibold">{mt('fixedSupply')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-4">{mt('allocationBreakdown')}</h3>
                <div className="space-y-3">
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-purple-300">{mt('dailyClaims')}</div>
                        <div className="text-xs text-gray-400">{language === 'zh' ? '10万亿' : language === 'zh-TR' ? '10兆' : language === 'ru' ? '10трлн' : '10T'} tokens</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-300">100%</div>
                    </div>
                  </div>
        
                </div>
                
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('helpTitle')}</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">{mt('switchToTestnet')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('switchToTestnetText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">{mt('needTestnetSui')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('needTestnetSuiText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('troubleshooting')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('troubleshootingText')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      </>
    );
  }

  // Show zodiac selection if no sign selected
  if (!selectedSign) {
    return (
      <>
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #b45309 75%, #92400e 100%)'
        }}>
          {stars.map(star => (
            <div
              key={star.id}
              className="absolute text-yellow-200"
              style={{
                left: `${star.x}%`,
                top: '-50px',
                fontSize: `${star.size * 2}px`,
                animation: `fallingStar ${star.duration}s linear infinite`,
                animationDelay: `${star.delay}s`,
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 0, 0.8))',
                zIndex: 10
              }}
            >
              ⭐
            </div>
          ))}

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold text-white mb-4 tracking-wider" style={{
                textShadow: '3px 3px 0px rgba(0,0,0,0.3), 6px 6px 0px rgba(0,0,0,0.1)'
              }}>
                {t('dailyHoro')}
              </h1>
              <p className="text-2xl text-yellow-200 font-semibold">
                {selectedSystem === 'western' ? t('chooseWesternZodiac') : t('chooseChineseZodiac')}
              </p>
            </div>

            <div className="max-w-md w-full space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {(selectedSystem === 'western' ? ZODIAC_SIGNS : CHINESE_ZODIAC_SIGNS).map(sign => (
                  <button
                    key={sign.name}
                    onClick={() => selectZodiacSign(sign.name)}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-xl transition-all duration-200 transform hover:scale-105 text-center"
                  >
                    <div className="text-2xl mb-1">{sign.symbol}</div>
                    <div className="text-white font-semibold capitalize text-sm">{t(sign.name)}</div>
                    {selectedSystem === 'western' && (
                      <div className="text-yellow-200 text-xs">{sign.dates}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="flex space-x-4 mb-4 justify-center">
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                <Sparkles className="h-8 w-8 text-yellow-200 animate-pulse" style={{animationDelay: '0.3s'}} />
                <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" style={{animationDelay: '0.6s'}} />
              </div>
              
              <div className="flex space-x-6 text-yellow-200 justify-center">
                <button 
                  onClick={() => setShowAbout(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('about')}
                </button>
                <button 
                  onClick={() => setShowTokenomics(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('tokenomics')}
                </button>
                <button 
                  onClick={() => setShowHelp(true)}
                  className="hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  {t('help')}
                </button>
                <LanguageSelector 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange}
                />
              </div>

              {/* SVAC Static Logo - Centered below footer */}
              <div className="flex justify-center items-center mt-12">
                <div className="text-gray-500">
                  {/* <StaticLogo size="small" /> */}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* About Modal */}
        {showAbout && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setShowAbout(false)}
          >
            <div 
              className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{mt('aboutHoro')}</h2>
                <button 
                  onClick={() => setShowAbout(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6 text-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatIsHoro')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('whatIsHoroText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whereIsHoro')}</h3>
                  <p className="leading-relaxed">{mt('whereIsHoroText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whenIsHoro')}</h3>
                  <div className="leading-relaxed whitespace-pre-line">{mt('whenIsHoroText')}</div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whyHoro')}</h3>
                  <p className="leading-relaxed">{mt('whyHoroText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatsNext')}</h3>
                  <p className="leading-relaxed">{mt('whatsNextText')}</p>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                  <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                  <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                    {PACKAGE_ID}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tokenomics Modal */}
        {showTokenomics && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setShowTokenomics(false)}
          >
            <div 
              className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{mt('tokenomics')}</h2>
                <button 
                  onClick={() => setShowTokenomics(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6 text-gray-100">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">{mt('totalSupplyTitle')}</h3>
                  <h4 className="text-2xl font-bold text-white mb-2">{mt('totalSupply')}</h4>
                  <p className="text-green-400 font-semibold">{mt('fixedSupply')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">{mt('allocationBreakdown')}</h3>
                  <div className="space-y-3">
                    <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-purple-300">{mt('dailyClaims')}</div>
                          <div className="text-xs text-gray-400">{language === 'zh' ? '10万亿' : language === 'zh-TR' ? '10兆' : language === 'ru' ? '10трлн' : '10T'} tokens</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-300">100%</div>
                      </div>
                    </div>
                    
                  </div>
                  
                </div>

                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                  <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                  <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                    {PACKAGE_ID}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelp && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setShowHelp(false)}
          >
            <div 
              className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{mt('helpTitle')}</h2>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6 text-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-3">{mt('switchToTestnet')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('switchToTestnetText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-3">{mt('needTestnetSui')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('needTestnetSuiText')}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('troubleshooting')}</h3>
                  <p className="leading-relaxed whitespace-pre-line">{mt('troubleshootingText')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Main horoscope view
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-12 w-12 text-yellow-400 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {t('dailyHoro')}
              </h1>
            </div>

          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Auto-claiming progress */}
            {autoSigningProgress && (
              <div className="bg-blue-900/50 rounded-xl p-4 text-center">
                <p className="text-blue-300">Claiming today's $HORO tokens... ✨</p>
              </div>
            )}

            {/* Blockchain verification progress */}
            {isVerifyingClaim && (
              <div className="bg-yellow-900/50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="h-4 w-4" />
                  <p className="text-yellow-300">{t('verifyingClaim')}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <CustomConnectButton t={t} />
            </div>

            {/* Today's horoscope */}
              <div className="bg-gray-800 rounded-xl p-8">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-6 gap-4 sm:gap-0">
                  <h2 className="text-2xl font-bold capitalize">{t(selectedSign)} {t('dailyReading')} {getZodiacSymbol()}</h2>
                  <h2 className="text-2xl">{formatCurrentDate()}</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl leading-relaxed text-gray-100">
                  {getCurrentHoroscope()}
                </p>
              </div>
            </div>

            {/* Wallet connection prompt */}
            {!!!currentAccount && (
              <div className="bg-blue-900/30 rounded-xl p-8 border border-blue-400/30 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">💧</div>
                  <h3 className="text-xl font-bold text-blue-300">Connect Your Wallet</h3>
                  <p className="text-blue-300">
                    Please connect your Sui wallet to claim $HORO tokens. Use Sui Wallet on mobile or a browser extension on desktop.
                  </p>
                  <div className="flex justify-center">
                    <CustomConnectButton t={t} />
                  </div>
                  <div className="text-sm text-blue-400 mt-4">
                    <h4>{t('testnetDisclaimer')}</h4>
                    <p className="text-xs mt-1">{t('testnetExplainer')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress indicator with proper blockchain data representation */}
            {!!currentAccount && (
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{t('weeklyProgress')}</h2>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">{getCurrentDayOfWeek() + 1}/7</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-8 mt-2">
                  {[...Array(7)].map((_, i) => {
                    // i represents day of week: 0=Sunday, 1=Monday, etc.
                    const isToday = i === getCurrentDayOfWeek();
                    const isPastDay = i < getCurrentDayOfWeek();
                    const isFutureDay = i > getCurrentDayOfWeek();
                    
                    // Check blockchain data for this day
                    const dayProgress = weeklyProgressByDay[i];
                    const isTodayCompletedFlag = isToday && (blockchainClaimStatus === 'claimed' || !!dayProgress);
                    
                    let bgColor, label, topText, topTextColor;
                    
                    if (dayProgress) {
                      // Day was claimed - show amount earned from blockchain
                      bgColor = 'bg-green-500';
                      label = '✓';
                      topText = `+${dayProgress.dailyReward}`;
                      topTextColor = 'text-green-400';
                    } else if (isTodayCompletedFlag) {
                      // Today was claimed - show estimated amount
                      bgColor = 'bg-green-500';
                      label = '✓';
                      topText = todaysClaimAmount > 0 ? `+${todaysClaimAmount}` : '+10';
                      topTextColor = 'text-green-400';
                    } else if (isPastDay) {
                      // Missed day
                      bgColor = 'bg-red-500';
                      label = '✗';
                      topText = '+0';
                      topTextColor = 'text-red-400';
                    } else if (isToday && blockchainClaimStatus === 'not_claimed') {
                      // Today, ready to claim
                      bgColor = 'bg-yellow-500 animate-pulse';
                      label = '!';
                      topText = 'Today';
                      topTextColor = 'text-green-400';
                    } else if (isToday) {
                      // Today, checking status
                      bgColor = 'bg-yellow-600';
                      label = '?';
                      topText = 'Today';
                      topTextColor = 'text-yellow-400';
                    } else {
                      // Future days
                      bgColor = 'bg-gray-600';
                      label = '';
                      topText = '⭐';
                      topTextColor = 'text-yellow-200';
                    }
                    
                    return (
                      <div key={i} className="flex-1 relative py-2">
                        {/* Top text showing earnings or status */}
                        {topText && (
                          <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs ${topTextColor} whitespace-nowrap font-semibold`}>
                            {topText}
                          </div>
                        )}
                        
                        {/* Day indicator bar */}
                        <div
                          className={`h-4 rounded-full ${bgColor} flex items-center justify-center`}
                          title={`${getDayName(i)}${dayProgress ? ` - Earned ${dayProgress.dailyReward} $HORO` : isTodayCompletedFlag ? ` - Earned ${todaysClaimAmount || 10} $HORO` : isPastDay ? ' - Missed (+0 $HORO)' : isToday ? ' - Today' : ' - Future'}`}
                        >
                          {label && (
                            <span className="text-white text-xs font-bold">{label}</span>
                          )}
                        </div>
                        
                        {/* Day label underneath */}
                        <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap ${
                          isToday ? 'text-green-400 font-semibold' : 'text-gray-400'
                        }`}>
                          {getDayName(i).slice(0, 3)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Legend */}
                <div className="flex justify-center space-x-4 text-xs mb-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">{t('completed')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-400">{t('missed')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-400">{t('available')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-gray-400">{t('future')}</span>
                  </div>
                </div>
                
                {/* Claim status UI */}
                {!!currentAccount && (
                  <div className="mt-2 space-y-2">
                    {(() => {
                      const hasAlreadyClaimed = isTodayCompleted();
                      const isCheckingStatus = isVerifyingClaim && blockchainClaimStatus === 'checking';
                      const isCurrentlyClaiming = autoSigningProgress;
                      
                      if (hasAlreadyClaimed) {
                        return (
                          <>
                            <button
                              disabled={true}
                              className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm flex items-center space-x-2 w-full justify-center cursor-not-allowed"
                            >
                              <span>✅ {todaysClaimAmount > 0 ? t('claimedAmountToday', { amount: todaysClaimAmount }) : t('alreadyClaimedToday')}</span>
                            </button>
                            <div className="text-center space-y-1">
                              <p className="text-green-400 text-sm">{t('alreadyClaimedMessage')}</p>
                              <p className="text-gray-400 text-xs">{t('nextClaimAvailable')}</p>
                            </div>
                          </>
                        );
                      } else if (isCheckingStatus) {
                        return (
                          <>
                            <button
                              disabled={true}
                              className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm flex items-center space-x-2 w-full justify-center"
                            >
                              <LoadingSpinner size="h-4 w-4" />
                              <span>{t('verifyingClaim')}</span>
                            </button>
                            <p className="text-xs text-gray-400 text-center">
                              Checking blockchain status...
                            </p>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <button
                              onClick={() => claimTodaysHoro(selectedSign)}
                              disabled={isCurrentlyClaiming}
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 w-full justify-center"
                            >
                              {isCurrentlyClaiming ? (
                                <>
                                  <LoadingSpinner size="h-4 w-4" />
                                  <span>{t('claiming')}</span>
                                </>
                              ) : (
                                <span>{t('claimTodaysHoro')}</span>
                              )}
                            </button>
                            <p className="text-xs text-gray-400 text-center">
                              Click to claim your daily $HORO tokens (protected by smart contract)
                            </p>
                          </>
                        );
                      }
                    })()}
                  </div>
                )}
                
                {currentAccount?.address && (
                  <div className="mt-3 space-y-2">
                    <p className="text-gray-400 text-xs">
                      {t('wallet')}: {currentAccount?.address.slice(0, 8)}...{currentAccount?.address.slice(-6)}
                    </p>
                    <GasManager currentAccount={currentAccount} suiClient={suiClient} t={t} />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="text-center mt-12 mb-8">
            <div className="flex justify-center space-x-6 text-gray-400">
              <button 
                onClick={() => setShowAbout(true)}
                className="hover:text-yellow-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('about')}
              </button>
              <button 
                onClick={() => setShowTokenomics(true)}
                className="hover:text-yellow-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('tokenomics')}
              </button>
              <button 
                onClick={() => setShowHelp(true)}
                className="hover:text-yellow-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('help')}
              </button>
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange}
                textColor="text-gray-400"
              />
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="hover:text-red-400 transition-colors text-sm font-medium cursor-pointer"
              >
                {t('reset')}
              </button>
            </div>
          </div>

          {/* SVAC Static Logo - Centered below footer */}
          <div className="flex justify-center items-center mt-8">
            <div className="text-gray-500">
              {/* <StaticLogo size="small" /> */}
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('aboutHoro')}</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatIsHoro')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('whatIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whereIsHoro')}</h3>
                <p className="leading-relaxed">{mt('whereIsHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whenIsHoro')}</h3>
                <div className="leading-relaxed whitespace-pre-line">{mt('whenIsHoroText')}</div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whyHoro')}</h3>
                <p className="leading-relaxed">{mt('whyHoroText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('whatsNext')}</h3>
                <p className="leading-relaxed">{mt('whatsNextText')}</p>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tokenomics Modal */}
      {showTokenomics && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowTokenomics(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('tokenomics')}</h2>
              <button 
                onClick={() => setShowTokenomics(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">{mt('totalSupplyTitle')}</h3>
                <h4 className="text-2xl font-bold text-white mb-2">{mt('totalSupply')}</h4>
                <p className="text-green-400 font-semibold">{mt('fixedSupply')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-4">{mt('allocationBreakdown')}</h3>
                <div className="space-y-3">
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-purple-300">{mt('dailyClaims')}</div>
                        <div className="text-xs text-gray-400">{language === 'zh' ? '10万亿' : language === 'zh-TR' ? '10兆' : language === 'ru' ? '10трлн' : '10T'} tokens</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-300">100%</div>
                    </div>
                  </div>
                  
                </div>
                
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/30">
                <h4 className="font-semibold text-blue-300 mb-2">{mt('contractAddress')}</h4>
                <div className="font-mono text-xs text-blue-200 break-all bg-black/30 p-2 rounded">
                  {PACKAGE_ID}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setShowHelp(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{mt('helpTitle')}</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6 text-gray-100">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-3">{mt('switchToTestnet')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('switchToTestnetText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">{mt('needTestnetSui')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('needTestnetSuiText')}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">{mt('troubleshooting')}</h3>
                <p className="leading-relaxed whitespace-pre-line">{mt('troubleshootingText')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper component with WalletProvider
export default function HoroAppWithWallet() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider>
            <HoroApp />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
