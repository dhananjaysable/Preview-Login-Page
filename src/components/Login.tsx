import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { Lock, User, AlertCircle, Eye, EyeOff, Clock, Moon, Sun, Globe, Fingerprint, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import tmcLogo from "figma:asset/7ad79113944c50a529ae9bfc34f1cfad78d7ad12.png";
import { TokenInput } from "./TokenInput";
import { EnhancedSmartCityBackground } from "./backgrounds/EnhancedSmartCityBackground";
import { HolographicCity } from "./HolographicCity";
import { VideoOverlay } from "./VideoOverlay";
import thaneVideo from "../assets/thanevideo.mp4";

type AuthStep = 'credentials' | 'token';
type Language = 'en' | 'mr';

export default function Login() {
    // Form state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);  // Default to light mode
    const [language, setLanguage] = useState<Language>('en');
    
    // UI state
    const [currentStep, setCurrentStep] = useState<AuthStep>('credentials');
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ username?: string; password?: string }>({});
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [shake, setShake] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [hoveredField, setHoveredField] = useState<string | null>(null);
    
    // Token state
    const [tokenError, setTokenError] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [tokenExpiry, setTokenExpiry] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    // Track if notifications have been shown to prevent duplicates
    const hasShownTokenExpiredNotification = useRef(false);
    
    // Detect reduced motion preference - memoized
    const prefersReducedMotion = useMemo(() => 
        typeof window !== 'undefined' 
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
            : false,
        []
    );
    
    const { login, verifyToken, resendToken } = useAuth();
    const notification = useNotification();
    const formRef = useRef<HTMLDivElement>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const lastMouseUpdate = useRef(0);

    // Translations
    const t = {
        en: {
            title: "Thane Municipal Corporation",
            subtitle: "ठाणे महानगर पालिका",
            portalName: "Smart Login Portal",
            tagline: "Seamless Digital Governance",
            username: "Username",
            password: "Password",
            rememberMe: "Remember me",
            signIn: "Sign In",
            signingIn: "Signing In...",
            verifyingToken: "Verifying...",
            verifyToken: "Verify Token",
            enterToken: "Enter 6-digit token",
            tokenExpiry: "Token expires in",
            resendToken: "Resend Token",
            resendIn: "Resend in",
            backToLogin: "Back to Login",
            orSignInWith: "Or sign in with OTP",
            capsLockWarning: "Caps Lock is ON",
        },
        mr: {
            title: "Thane Municipal Corporation",
            subtitle: "ठाणे महानगर पालिका",
            portalName: "स्मार्ट लॉगिन पोर्टल",
            tagline: "अखंड डिजिटल शासन",
            username: "वापरकर्ता नाव",
            password: "संकेतशब्द",
            rememberMe: "मला लक्षात ठेवा",
            signIn: "साइन इन करा",
            signingIn: "साइन इन होत आहे...",
            verifyingToken: "पडताळणी करत आहे...",
            verifyToken: "टोकन सत्यापित करा",
            enterToken: "6-अंकी टोकन प्रविष्ट करा",
            tokenExpiry: "टोकन कालबाह्य होईल",
            resendToken: "टोकन पुन्हा पाठवा",
            resendIn: "पुन्हा पाठवा",
            backToLogin: "लॉगिनवर परत या",
            orSignInWith: "किंवा OTP सह साइन इन करा",
            capsLockWarning: "कॅप्स लॉक चालू आहे",
        },
    };

    // Parallax effect on mouse move - throttled for performance
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastMouseUpdate.current < 16) return;
            lastMouseUpdate.current = now;
            
            const x = (e.clientX / window.innerWidth - 0.5) * 4;
            const y = (e.clientY / window.innerHeight - 0.5) * 4;
            setMousePosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Resend timer
    useEffect(() => {
        if (currentStep === 'token' && resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStep, resendTimer]);

    // Token expiry timer
    useEffect(() => {
        if (currentStep === 'token' && tokenExpiry > 0) {
            const interval = setInterval(() => {
                setTokenExpiry(prev => {
                    if (prev <= 1) {
                        setError("Token expired.");
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStep, tokenExpiry]);

    // Show notification when token expires
    useEffect(() => {
        if (currentStep === 'token' && tokenExpiry === 0 && canResend && !hasShownTokenExpiredNotification.current) {
            notification.error("Please resend a new token to continue.", "Token Expired");
            hasShownTokenExpiredNotification.current = true;
        }
    }, [currentStep, tokenExpiry, canResend, notification]);

    // Caps lock detection
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        setCapsLockOn(e.getModifierState("CapsLock"));
    }, []);

    // Real-time validation - memoized
    const validateUsername = useCallback((value: string): string | undefined => {
        if (!value) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        return undefined;
    }, []);

    const validatePassword = useCallback((value: string): string | undefined => {
        if (!value) return "Password is required";
        if (value.length < 5) return "Password must be at least 5 characters";
        return undefined;
    }, []);

    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        if (value) {
            setValidationErrors(prev => ({ ...prev, username: validateUsername(value) }));
        }
    }, [validateUsername]);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (value) {
            setValidationErrors(prev => ({ ...prev, password: validatePassword(value) }));
        }
    }, [validatePassword]);

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const usernameError = validateUsername(username);
        const passwordError = validatePassword(password);

        if (usernameError || passwordError) {
            setValidationErrors({ username: usernameError, password: passwordError });
            setShake(true);
            setTimeout(() => setShake(false), 150);
            return;
        }

        setIsSubmitting(true);

        const result = await login(username, password);

        if (result.success && result.status === 'ok_password') {
            setCurrentStep('token');
            setResendTimer(30);
            setTokenExpiry(60);
            setCanResend(false);
            hasShownTokenExpiredNotification.current = false;
            notification.success("A 6-digit token has been generated in your e-Pramān app. Open the app to view it.", "Token Generated");
            setIsSubmitting(false);
        } else {
            setError(result.message);
            notification.error(result.message, "Login Failed");
            setShake(true);
            setTimeout(() => setShake(false), 150);
            setIsSubmitting(false);
        }
    };

    const handleTokenComplete = async (tokenValue: string) => {
        if (tokenExpiry === 0) return;
        
        setIsSubmitting(true);
        setTokenError(false);
        setError("");

        const result = await verifyToken(username, tokenValue);

        if (result.success && result.status === 'ok') {
            setSubmitSuccess(true);
            setError("");
            notification.success(`Welcome to NTIS, ${username}!`, "Login Successful");
            
            setTimeout(() => {
                alert(`Login successful! Welcome to NTIS, ${username}`);
                setSubmitSuccess(false);
                setIsSubmitting(false);
            }, 2000);
        } else if (result.status === 'expired') {
            setError("Token expired.");
            setCanResend(true);
            setResendTimer(0);
            setToken("");
            notification.error("Please resend a new token to continue.", "Token Expired");
            setIsSubmitting(false);
        } else {
            setError(result.message);
            setTokenError(true);
            setToken("");
            setShake(true);
            notification.error(result.message, 'Invalid Token');
            
            setTimeout(() => {
                setShake(false);
                setTokenError(false);
            }, 400);
            setIsSubmitting(false);
        }
    };

    const handleResendToken = async () => {
        if (!canResend) return;
        
        setCanResend(false);
        setResendTimer(30);
        setTokenExpiry(60);
        setToken("");
        setError("");
        hasShownTokenExpiredNotification.current = false;
        
        const result = await resendToken(username);
        
        if (result.success) {
            notification.success("A new 6-digit token has been sent to your e-Pramān app", "Token Resent");
        }
    };

    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Corporate color palette
    const govCyan = '#00B8D9';  // Cyan for accents and portal name
    const govTeal = '#26C6DA';  // Teal for button gradient
    const textColor = isDarkMode ? '#E5E5E5' : '#1B2B3A';  // Deep blue-gray for headings
    const mutedTextColor = isDarkMode ? '#A7B0B5' : '#4F5E6C';  // Descriptive text
    const subheadingColor = isDarkMode ? '#B0BEC5' : '#3B4C5A';  // Subheadings
    const inputBorderColor = '#1E3B4F';  // Text field borders

    // Memoize style objects
    const inputStyles = useMemo(() => ({
        fontSize: '16px',
        lineHeight: '24px',
        padding: '14px 44px 14px 44px',
        width: '100%',
        minHeight: '52px',
        border: 'none',
        borderRadius: '12px',
        outline: 'none',
        backgroundColor: isDarkMode ? 'rgba(19, 43, 62, 0.7)' : 'rgba(248, 250, 252, 0.8)',  // Very light gray-blue
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isDarkMode 
            ? `0 0 0 1px rgba(0, 184, 217, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)`
            : `0 0 0 1px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.03)`,  // Subtle border
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: textColor,
        fontFamily: "'Inter', 'Poppins', 'Roboto', sans-serif",
        willChange: 'box-shadow, background-color, transform',
    }), [isDarkMode, textColor, inputBorderColor]);

    const inputFocusStyles = useMemo(() => ({
        backgroundColor: isDarkMode ? 'rgba(19, 43, 62, 0.85)' : 'rgba(255, 255, 255, 1)',  // Pure white on focus
        boxShadow: isDarkMode 
            ? `0 0 15px rgba(0, 184, 217, 0.25), 0 0 0 2px ${govCyan}, inset 0 2px 4px rgba(0, 0, 0, 0.3)`
            : `0 0 12px ${govCyan}25, 0 0 0 2px ${govCyan}, inset 0 1px 2px rgba(0, 0, 0, 0.02)`,  // Softer focus glow
        transform: 'translateY(-1px)',
    }), [isDarkMode, govCyan]);

    const inputHoverStyles = useMemo(() => ({
        backgroundColor: isDarkMode ? 'rgba(19, 43, 62, 0.8)' : 'rgba(255, 255, 255, 0.95)',  // Slightly brighter on hover
        boxShadow: isDarkMode 
            ? `0 0 0 1px rgba(0, 184, 217, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.3)`
            : `0 0 0 1px ${govCyan}30, inset 0 1px 2px rgba(0, 0, 0, 0.02)`,  // Subtle cyan tint on hover
    }), [isDarkMode, govCyan]);

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
                `}
            </style>
            
            <div className="relative flex w-full min-h-screen overflow-hidden">
                {/* Enhanced Smart City Background */}
                <EnhancedSmartCityBackground 
                    mousePosition={mousePosition} 
                    prefersReducedMotion={prefersReducedMotion}
                />

                {/* Full-screen video background */}
                <VideoOverlay 
                    videoSrc={thaneVideo}
                    opacity={0.65}
                    blur={0}
                    overlayColor="rgba(0, 0, 0, 0.38)"
                />

                {/* Dark/Light Mode Toggle */}
                <motion.button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="fixed top-6 right-6 z-50 rounded-full p-3"
                    style={{
                        background: isDarkMode 
                            ? 'rgba(19, 43, 62, 0.85)' 
                            : 'rgba(255, 255, 255, 0.98)',  // Brighter white
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: isDarkMode 
                            ? '1px solid rgba(0, 184, 217, 0.3)' 
                            : '1px solid rgba(0, 184, 217, 0.25)',  // Lighter border
                        boxShadow: isDarkMode 
                            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 12px rgba(0, 0, 0, 0.06)',  // Lighter shadow
                    }}
                    whileHover={{ 
                        scale: 1.08,
                        boxShadow: isDarkMode 
                            ? '0 0 16px rgba(0, 184, 217, 0.4)' 
                            : `0 0 16px ${govCyan}35`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isDarkMode ? (
                        <Sun className="h-5 w-5" style={{ color: govCyan }} />
                    ) : (
                        <Moon className="h-5 w-5" style={{ color: govCyan }} />
                    )}
                </motion.button>

                {/* Language Switcher */}
                <motion.button
                    onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                    className="fixed top-6 right-20 z-50 rounded-full p-3 flex items-center gap-2"
                    style={{
                        background: isDarkMode 
                            ? 'rgba(19, 43, 62, 0.85)' 
                            : 'rgba(255, 255, 255, 0.98)',  // Brighter white
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: isDarkMode 
                            ? '1px solid rgba(0, 184, 217, 0.3)' 
                            : '1px solid rgba(0, 184, 217, 0.25)',  // Lighter border
                        boxShadow: isDarkMode 
                            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                            : '0 4px 12px rgba(0, 0, 0, 0.06)',  // Lighter shadow
                        color: govCyan,
                        fontFamily: "'Inter', 'Poppins', sans-serif",
                        paddingLeft: '16px',
                        paddingRight: '16px',
                    }}
                    whileHover={{ 
                        scale: 1.05,
                        boxShadow: isDarkMode 
                            ? '0 0 16px rgba(0, 184, 217, 0.4)' 
                            : `0 0 16px ${govCyan}35`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Switch language"
                >
                    <Globe className="h-4 w-4" />
                    <span style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
                        {language === 'en' ? 'EN' : 'मर'}
                    </span>
                </motion.button>

                {/* Split Screen Layout */}
                <div className="flex w-full min-h-screen" style={{ position: 'relative', zIndex: 10 }}>
                    {/* Left Panel - Holographic City */}
                    <motion.div
                        className="hidden lg:flex lg:w-1/2"
                        style={{
                            position: 'relative',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '60px',
                            overflow: 'hidden',
                        }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Content layer */}
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <HolographicCity 
                                mousePosition={mousePosition} 
                                prefersReducedMotion={prefersReducedMotion}
                            />
                        </div>
                    </motion.div>

                    {/* Right Panel - Login Form */}
                    <div 
                        className="w-full lg:w-1/2 flex items-center justify-center"
                        style={{ 
                            padding: '40px 20px',
                            minHeight: '100vh',
                        }}
                    >
                        <div className="w-full px-4" style={{ maxWidth: '480px' }}>
                            <motion.div
                                ref={formRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    x: shake ? [-6, 6, -6, 6, 0] : 0,
                                }}
                                transition={{ 
                                    opacity: { duration: 0.6 },
                                    y: { duration: 0.6 },
                                    x: { duration: 0.5 },
                                }}
                                style={{
                                    position: 'relative',
                                    borderRadius: '24px',
                                    padding: '48px 40px',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Enhanced Glassmorphic Card Background */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: '24px',
                                    zIndex: -1,
                                }}>
                                    {/* Glassmorphism Background */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: isDarkMode 
                                                ? 'linear-gradient(135deg, rgba(19, 43, 62, 0.94) 0%, rgba(21, 42, 61, 0.94) 100%)'
                                                : 'rgba(255, 255, 255, 0.75)',  // Transparent white for glassmorphism
                                            borderRadius: '24px',
                                            boxShadow: isDarkMode 
                                                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                                                : '0 8px 32px rgba(0, 184, 217, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',  // Enhanced shadow with cyan tint
                                            border: isDarkMode 
                                                ? 'none'
                                                : '1px solid rgba(255, 255, 255, 0.4)',  // Subtle white border for glass effect
                                        }}
                                    />

                                    {/* Strong backdrop blur for glassmorphism */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backdropFilter: isDarkMode ? 'blur(24px)' : 'blur(20px) saturate(180%)',
                                            WebkitBackdropFilter: isDarkMode ? 'blur(24px)' : 'blur(20px) saturate(180%)',
                                            borderRadius: '24px',
                                        }}
                                    />

                                    {/* Corporate border with cyan gradient */}
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '24px',
                                            padding: '1.5px',
                                            background: `linear-gradient(135deg, ${govCyan} 0%, ${govTeal} 100%)`,
                                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            WebkitMaskComposite: 'xor',
                                            maskComposite: 'exclude',
                                        }}
                                        animate={!prefersReducedMotion ? {
                                            opacity: [0.5, 0.8, 0.5],
                                        } : { opacity: 0.6 }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    {/* Corporate shadow with soft inner shadow */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '24px',
                                            boxShadow: isDarkMode 
                                                ? `0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 184, 217, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 20px rgba(0, 0, 0, 0.1)`
                                                : `0 25px 50px rgba(0, 0, 0, 0.08), 0 0 30px rgba(0, 184, 217, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.02)`,
                                        }}
                                    />

                                    {/* Top accent line - geometric divider */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '20%',
                                            right: '20%',
                                            height: '1px',
                                            background: `linear-gradient(90deg, transparent, ${govCyan}66, transparent)`,
                                            borderRadius: '24px 24px 0 0',
                                        }}
                                    />
                                </div>

                                {/* TMC Logo - Government Seal with Prestige Glow */}
                                <motion.div 
                                    className="flex justify-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <motion.div
                                        style={{
                                            borderRadius: '50%',
                                            padding: '8px',
                                            background: isDarkMode 
                                                ? 'radial-gradient(circle, rgba(224, 247, 250, 0.05) 0%, transparent 70%)'
                                                : 'radial-gradient(circle, rgba(224, 247, 250, 0.3) 0%, transparent 70%)',
                                        }}
                                        whileHover={{ 
                                            scale: 1.04, 
                                            filter: `drop-shadow(0 0 15px ${govCyan}66)` 
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img 
                                            src={tmcLogo} 
                                            alt="Thane Municipal Corporation - Government Seal" 
                                            className="w-auto object-contain"
                                            style={{ 
                                                height: '110px',
                                                filter: isDarkMode 
                                                    ? `drop-shadow(0 0 10px ${govCyan}40)` 
                                                    : `drop-shadow(0 0 8px ${govCyan}30)`,
                                            }}
                                        />
                                    </motion.div>
                                </motion.div>

                                {/* Title - Corporate Style */}
                                <div className="text-center" style={{ marginBottom: '32px' }}>
                                    <motion.h1 
                                        style={{ 
                                            marginBottom: '8px', 
                                            color: textColor,  // #1B2B3A for light mode
                                            letterSpacing: '0.3px',
                                            fontFamily: "'Poppins', 'Inter', sans-serif",
                                            fontWeight: '600',
                                            lineHeight: '1.4',
                                        }}
                                    >
                                        {t[language].title}
                                    </motion.h1>
                                    <p 
                                        className="text-sm" 
                                        style={{ 
                                            color: isDarkMode ? mutedTextColor : subheadingColor,  // #3B4C5A for light mode
                                            marginBottom: '10px',
                                            fontFamily: "'Inter', sans-serif",
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        {t[language].subtitle}
                                    </p>
                                    
                                    {/* Geometric divider line */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '12px',
                                        marginBottom: '10px',
                                    }}>
                                        <div style={{ 
                                            width: '40px', 
                                            height: '1px', 
                                            background: `linear-gradient(90deg, transparent, ${govCyan}66)`,
                                        }} />
                                        <div style={{ 
                                            width: '6px', 
                                            height: '6px', 
                                            borderRadius: '50%',
                                            background: govCyan,
                                            opacity: 0.6,
                                        }} />
                                        <div style={{ 
                                            width: '40px', 
                                            height: '1px', 
                                            background: `linear-gradient(90deg, ${govCyan}66, transparent)`,
                                        }} />
                                    </div>
                                    
                                    <p 
                                        className="text-sm" 
                                        style={{ 
                                            color: govCyan,  // Keep cyan with soft glow
                                            letterSpacing: '1.5px',
                                            fontFamily: "'Inter', 'Poppins', sans-serif",
                                            textTransform: 'uppercase',
                                            fontWeight: '500',
                                            textShadow: isDarkMode ? 'none' : `0 0 10px ${govCyan}30`,
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        {t[language].portalName}
                                    </p>
                                </div>

                                {/* Credentials Form */}
                                <AnimatePresence mode="wait">
                                    {currentStep === 'credentials' && (
                                        <motion.form 
                                            onSubmit={handleCredentialsSubmit}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <AnimatePresence>
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        style={{ marginBottom: '20px' }}
                                                        role="alert"
                                                        aria-live="assertive"
                                                    >
                                                        <Alert variant="destructive">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <AlertDescription>{error}</AlertDescription>
                                                        </Alert>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Username Field */}
                                            <div style={{ marginBottom: '20px' }}>
                                                <Label 
                                                    htmlFor="username" 
                                                    className="block"
                                                    style={{ 
                                                        fontSize: '14px',
                                                        marginBottom: '10px',
                                                        color: focusedField === 'username' 
                                                            ? govCyan
                                                            : textColor,
                                                        transition: 'color 0.3s ease-out',
                                                        fontFamily: "'Inter', 'Poppins', sans-serif",
                                                        letterSpacing: '0.3px',
                                                        fontWeight: '500',
                                                        lineHeight: '1.5',
                                                    }}
                                                >
                                                    {t[language].username}
                                                </Label>
                                                <div className="relative">
                                                    <User 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none" 
                                                        style={{ 
                                                            color: focusedField === 'username' 
                                                                ? govCyan
                                                                : mutedTextColor,
                                                            transition: 'color 0.3s ease-out',
                                                        }} 
                                                    />
                                                    <input
                                                        ref={usernameInputRef}
                                                        id="username"
                                                        type="text"
                                                        value={username}
                                                        onChange={handleUsernameChange}
                                                        onFocus={() => setFocusedField('username')}
                                                        onBlur={() => setFocusedField(null)}
                                                        onMouseEnter={() => setHoveredField('username')}
                                                        onMouseLeave={() => setHoveredField(null)}
                                                        disabled={isSubmitting}
                                                        style={{
                                                            ...inputStyles,
                                                            ...(focusedField === 'username' ? inputFocusStyles : hoveredField === 'username' ? inputHoverStyles : {}),
                                                            cursor: isSubmitting ? 'not-allowed' : 'text',
                                                        }}
                                                        placeholder="Enter your username"
                                                        aria-label="Username"
                                                        aria-invalid={!!validationErrors.username}
                                                        aria-describedby={validationErrors.username ? "username-error" : undefined}
                                                        autoComplete="username"
                                                    />
                                                </div>
                                                {validationErrors.username && (
                                                    <p id="username-error" className="text-xs mt-1" style={{ color: '#ef4444' }}>
                                                        {validationErrors.username}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password Field */}
                                            <div style={{ marginBottom: '24px' }}>
                                                <Label 
                                                    htmlFor="password" 
                                                    className="block"
                                                    style={{ 
                                                        fontSize: '14px',
                                                        marginBottom: '10px',
                                                        color: focusedField === 'password' 
                                                            ? govCyan
                                                            : textColor,
                                                        transition: 'color 0.3s ease-out',
                                                        fontFamily: "'Inter', 'Poppins', sans-serif",
                                                        letterSpacing: '0.3px',
                                                        fontWeight: '500',
                                                        lineHeight: '1.5',
                                                    }}
                                                >
                                                    {t[language].password}
                                                </Label>
                                                <div className="relative">
                                                    <Lock 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none" 
                                                        style={{ 
                                                            color: focusedField === 'password' 
                                                                ? govCyan
                                                                : mutedTextColor,
                                                            transition: 'color 0.3s ease-out',
                                                        }} 
                                                    />
                                                    <input
                                                        ref={passwordInputRef}
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={handlePasswordChange}
                                                        onKeyDown={handleKeyDown}
                                                        onFocus={() => setFocusedField('password')}
                                                        onBlur={() => setFocusedField(null)}
                                                        onMouseEnter={() => setHoveredField('password')}
                                                        onMouseLeave={() => setHoveredField(null)}
                                                        disabled={isSubmitting}
                                                        style={{
                                                            ...inputStyles,
                                                            paddingRight: '88px',
                                                            ...(focusedField === 'password' ? inputFocusStyles : hoveredField === 'password' ? inputHoverStyles : {}),
                                                            cursor: isSubmitting ? 'not-allowed' : 'text',
                                                        }}
                                                        placeholder="Enter your password"
                                                        aria-label="Password"
                                                        aria-invalid={!!validationErrors.password}
                                                        aria-describedby={validationErrors.password ? "password-error" : undefined}
                                                        autoComplete="current-password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        disabled={isSubmitting}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                            padding: '4px',
                                                            color: mutedTextColor,
                                                            transition: 'color 0.2s',
                                                        }}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                                {validationErrors.password && (
                                                    <p id="password-error" className="text-xs mt-1" style={{ color: '#ef4444' }}>
                                                        {validationErrors.password}
                                                    </p>
                                                )}
                                                {capsLockOn && (
                                                    <p className="text-xs mt-1" style={{ color: '#f59e0b' }}>
                                                        ⚠ {t[language].capsLockWarning}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Remember Me */}
                                            <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <Checkbox
                                                        checked={rememberMe}
                                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                                        disabled={isSubmitting}
                                                        aria-label="Remember me"
                                                    />
                                                    <span className="text-sm" style={{ color: mutedTextColor, fontFamily: "'Inter', 'Poppins', sans-serif", lineHeight: '1.5' }}>
                                                        {t[language].rememberMe}
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Sign In Button - Corporate Cyan Gradient */}
                                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                <motion.button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    style={{
                                                        padding: '16px',
                                                        width: '82%',
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        background: `linear-gradient(135deg, ${govCyan} 0%, ${govTeal} 100%)`,
                                                        color: '#ffffff',
                                                        fontFamily: "'Inter', 'Poppins', sans-serif",
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        letterSpacing: '0.5px',
                                                        textTransform: 'uppercase',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: isDarkMode 
                                                            ? `0 4px 12px ${govCyan}40` 
                                                            : `0 4px 12px ${govCyan}35`,
                                                    }}
                                                    whileHover={!isSubmitting ? { 
                                                        scale: 1.02,
                                                        background: `linear-gradient(135deg, #00D4F5 0%, #2DD4E8 100%)`,  // Brighter cyan on hover
                                                        boxShadow: `0 0 20px ${govCyan}60, 0 6px 20px ${govCyan}40`,  // Enhanced glow
                                                    } : {}}
                                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                                >
                                                    {isSubmitting ? t[language].signingIn : t[language].signIn}
                                                    
                                                    {/* Ripple effect on click */}
                                                    {!isSubmitting && (
                                                        <motion.span
                                                            style={{
                                                                position: 'absolute',
                                                                inset: 0,
                                                                background: 'rgba(255, 255, 255, 0.2)',
                                                                borderRadius: '12px',
                                                            }}
                                                            initial={{ scale: 0, opacity: 1 }}
                                                            whileTap={{ scale: 2, opacity: 0 }}
                                                            transition={{ duration: 0.6 }}
                                                        />
                                                    )}
                                                </motion.button>
                                            </div>

                                            {/* Alternative Sign In Option */}
                                    {/* Removed "Or sign in with OTP" section as requested */}
                                        </motion.form>
                                    )}

                                    {/* Token Verification Step */}
                                    {currentStep === 'token' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <AnimatePresence>
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        style={{ marginBottom: '20px' }}
                                                        role="alert"
                                                        aria-live="assertive"
                                                    >
                                                        <Alert variant="destructive">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <AlertDescription>{error}</AlertDescription>
                                                        </Alert>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Token Expiry Timer */}
                                            <div className="text-center" style={{ marginBottom: '24px' }}>
                                                <div className="flex items-center justify-center gap-2" style={{ marginBottom: '8px' }}>
                                                    <Clock className="h-5 w-5" style={{ color: tokenExpiry <= 10 ? '#ef4444' : govCyan }} />
                                                    <p 
                                                        className="text-sm"
                                                        style={{ 
                                                            color: tokenExpiry <= 10 ? '#ef4444' : mutedTextColor,
                                                            fontFamily: "'Inter', 'Poppins', sans-serif",
                                                            lineHeight: '1.5',
                                                        }}
                                                    >
                                                        {t[language].tokenExpiry}: <span style={{ fontWeight: '700', fontFamily: "'Poppins', monospace" }}>{formatTime(tokenExpiry)}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Token Input */}
                                            <div style={{ marginBottom: '24px' }}>
                                                <Label 
                                                    htmlFor="token-input" 
                                                    className="block text-center"
                                                    style={{ 
                                                        fontSize: '14px',
                                                        marginBottom: '16px',
                                                        color: textColor,
                                                        fontFamily: "'Inter', 'Poppins', sans-serif",
                                                        letterSpacing: '1px',
                                                        textTransform: 'uppercase',
                                                        lineHeight: '1.5',
                                                    }}
                                                >
                                                    {t[language].enterToken}
                                                </Label>
                                                <TokenInput
                                                    value={token}
                                                    onChange={setToken}
                                                    onComplete={handleTokenComplete}
                                                    disabled={isSubmitting || tokenExpiry === 0}
                                                    error={tokenError}
                                                    shake={shake}
                                                    ariaLabel="Enter 6-digit token"
                                                    isDarkMode={isDarkMode}
                                                />
                                            </div>

                                            {/* Resend Token */}
                                            <div className="text-center" style={{ marginTop: '24px' }}>
                                                {canResend ? (
                                                    <motion.button
                                                        type="button"
                                                        onClick={handleResendToken}
                                                        className="inline-flex items-center gap-2"
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: govCyan,
                                                            fontFamily: "'Inter', 'Poppins', sans-serif",
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            letterSpacing: '0.5px',
                                                            cursor: 'pointer',
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            lineHeight: '1.5',
                                                        }}
                                                        whileHover={{ 
                                                            scale: 1.05,
                                                            background: 'rgba(0, 184, 217, 0.1)',
                                                        }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        {t[language].resendToken}
                                                    </motion.button>
                                                ) : (
                                                    <p 
                                                        className="text-sm" 
                                                        style={{ 
                                                            color: mutedTextColor,
                                                            fontFamily: "'Inter', 'Poppins', sans-serif",
                                                            lineHeight: '1.5',
                                                        }}
                                                    >
                                                        {t[language].resendIn} <span style={{ fontWeight: '700', fontFamily: "'Poppins', monospace" }}>{formatTime(resendTimer)}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Back to Login */}
                                            <div className="text-center" style={{ marginTop: '20px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCurrentStep('credentials');
                                                        setToken("");
                                                        setError("");
                                                        setTokenError(false);
                                                    }}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: mutedTextColor,
                                                        fontFamily: "'Inter', 'Poppins', sans-serif",
                                                        fontSize: '13px',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline',
                                                        lineHeight: '1.5',
                                                    }}
                                                >
                                                    ← {t[language].backToLogin}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
