import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language based on selection
      const langMap = {
        english: 'en-IN',
        hindi: 'hi-IN',
        telugu: 'te-IN'
      };
      recognitionRef.current.lang = langMap[selectedLanguage];

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
    }
  }, [selectedLanguage]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      // This will connect to your backend modules later
      console.log('User Problem:', userInput);
      console.log('Language:', selectedLanguage);
      alert(`Problem submitted: "${userInput}" in ${selectedLanguage}`);
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    // Update speech recognition language
    if (recognitionRef.current) {
      const langMap = {
        english: 'en-IN',
        hindi: 'hi-IN',
        telugu: 'te-IN'
      };
      recognitionRef.current.lang = langMap[lang];
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🏛️ Legal AI Assistant</h1>
          <p>Get instant legal guidance in simple language</p>
        </header>

        <div className="language-selector">
          <h3>Select Language / भाषा चुनें / భాష ఎంచుకోండి</h3>
          <div className="language-buttons">
            <button 
              className={selectedLanguage === 'english' ? 'active' : ''}
              onClick={() => handleLanguageChange('english')}
            >
              English
            </button>
            <button 
              className={selectedLanguage === 'hindi' ? 'active' : ''}
              onClick={() => handleLanguageChange('hindi')}
            >
              हिंदी
            </button>
            <button 
              className={selectedLanguage === 'telugu' ? 'active' : ''}
              onClick={() => handleLanguageChange('telugu')}
            >
              తెలుగు
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-section">
            <label htmlFor="problem-input">
              {selectedLanguage === 'english' && 'Describe your legal problem:'}
              {selectedLanguage === 'hindi' && 'अपनी कानूनी समस्या बताएं:'}
              {selectedLanguage === 'telugu' && 'మీ చట్టపరమైన సమస్యను వివరించండి:'}
            </label>
            
            <div className="input-container">
              <textarea
                id="problem-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={
                  selectedLanguage === 'english' ? 'Example: Police stopped me and asking for phone password...' :
                  selectedLanguage === 'hindi' ? 'उदाहरण: पुलिस ने मुझे रोका और फोन का पासवर्ड मांग रहे हैं...' :
                  'ఉదాహరణ: పోలీసులు నన్ను ఆపి ఫోన్ పాస్‌వర్డ్ అడుగుతున్నారు...'
                }
                rows="4"
                className="problem-textarea"
              />
              
              {isSupported && (
                <button
                  type="button"
                  className={`voice-button ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopListening : startListening}
                  title="Voice input"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              )}
            </div>
            
            {isListening && (
              <p className="listening-text">
                {selectedLanguage === 'english' && '🎤 Listening... Speak now'}
                {selectedLanguage === 'hindi' && '🎤 सुन रहा हूं... अब बोलें'}
                {selectedLanguage === 'telugu' && '🎤 వింటున్నాను... ఇప్పుడు మాట్లాడండి'}
              </p>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={!userInput.trim()}>
            {selectedLanguage === 'english' && 'Get Legal Guidance'}
            {selectedLanguage === 'hindi' && 'कानूनी सलाह पाएं'}
            {selectedLanguage === 'telugu' && 'చట్టపరమైన మార్గదర్శకత్వం పొందండి'}
          </button>
        </form>

        <div className="examples">
          <h4>
            {selectedLanguage === 'english' && 'Common Problems:'}
            {selectedLanguage === 'hindi' && 'सामान्य समस्याएं:'}
            {selectedLanguage === 'telugu' && 'సాధారణ సమస్యలు:'}
          </h4>
          <div className="example-buttons">
            <button 
              onClick={() => setUserInput(
                selectedLanguage === 'english' ? 'Police asking for phone password' :
                selectedLanguage === 'hindi' ? 'पुलिस फोन का पासवर्ड मांग रहे हैं' :
                'పోలీసులు ఫోన్ పాస్‌వర్డ్ అడుగుతున్నారు'
              )}
              className="example-btn"
            >
              📱 Phone Privacy
            </button>
            <button 
              onClick={() => setUserInput(
                selectedLanguage === 'english' ? 'Got arrested without warrant' :
                selectedLanguage === 'hindi' ? 'बिना वारंट के गिरफ्तार किया गया' :
                'వారెంట్ లేకుండా అరెస్ట్ చేశారు'
              )}
              className="example-btn"
            >
              🚔 Arrest Issues
            </button>
            <button 
              onClick={() => setUserInput(
                selectedLanguage === 'english' ? 'Need to file FIR for theft' :
                selectedLanguage === 'hindi' ? 'चोरी के लिए FIR दर्ज करना है' :
                'దొంగతనం కోసం FIR దాఖలు చేయాలి'
              )}
              className="example-btn"
            >
              📝 File FIR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
