import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Code, Zap } from 'lucide-react';

export default function HackTransition() {
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();

  const steps = [
    { text: 'ESTABLISHING SECURE CONNECTION...', delay: 400 },
    { text: 'CODE TRANSFER PROTOCOL ACTIVATED', delay: 600 },
    { text: 'ACCESS GRANTED', delay: 500 }
  ];

  const finalText = 'CODE_TRANSFER_HACK';

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].delay);

      return () => clearTimeout(timer);
    } else {
      // Start typing final text after all steps
      const timer = setTimeout(() => {
        typeText();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const typeText = () => {
    let index = 0;
    const typing = setInterval(() => {
      if (index <= finalText.length) {
        setTypedText(finalText.slice(0, index));
        index++;
      } else {
        clearInterval(typing);
        // Navigate to hack page after typing is complete
        setTimeout(() => {
          navigate('/hack-main');
        }, 400);
      }
    }, 60);
  };

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono flex items-center justify-center overflow-hidden">
      {/* Simple animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-green-500 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto p-8">
        {/* Header with icons */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Terminal className="h-10 w-10 animate-pulse" />
          <Code className="h-8 w-8 animate-bounce" />
          <Zap className="h-6 w-6 animate-ping" />
        </div>

        {/* Status messages */}
        <div className="space-y-3 mb-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`text-lg transition-all duration-500 ${
                index <= currentStep ? 'opacity-100 text-green-400' : 'opacity-30 text-gray-600'
              }`}
            >
              {index <= currentStep && (
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>{step.text}</span>
                  {index === currentStep && (
                    <span className="w-2 h-4 bg-green-400 animate-pulse ml-1">|</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final typing animation */}
        {currentStep >= steps.length && (
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold mb-3 tracking-wider">
              <span className="text-green-400 drop-shadow-lg glow-text">
                {typedText}
              </span>
              {showCursor && <span className="animate-pulse">|</span>}
            </div>
            
            <div className="text-lg text-green-300 opacity-75">
              Secure Code Transfer
            </div>

            {/* Simple loading indicator */}
            {typedText.length < finalText.length && (
              <div className="mt-4 text-green-400 animate-pulse">
                Loading...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global styles */}
      <style>{`
        .glow-text {
          text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
        }
      `}</style>
    </div>
  );
}