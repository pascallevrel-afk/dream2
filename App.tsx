import React, { useState, useCallback } from 'react';
import { Upload, Layout, Image as ImageIcon, Wand2, ArrowRight } from 'lucide-react';
import { ComparisonSlider } from './components/ComparisonSlider';
import { StyleSelector } from './components/StyleSelector';
import { ChatArea } from './components/ChatArea';
import { BEDROOM_STYLES } from './constants';
import { DesignStyle, ChatMessage } from './types';
import { generateBedroomDesign, generateChatDesign } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setGeneratedImage(null);
        setSelectedStyle(null);
        setMessages([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Style Generation
  const handleStyleSelect = async (style: DesignStyle) => {
    if (!originalImage || isProcessing) return;

    setSelectedStyle(style.id);
    setIsProcessing(true);
    setError(null);

    try {
      const newImage = await generateBedroomDesign(originalImage, style.prompt);
      setGeneratedImage(newImage);
      
      // Add system message about the style change
      const sysMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        text: `I've reimagined your room in the ${style.name} style. How does it look?`,
      };
      setMessages([sysMsg]);
    } catch (err) {
      setError("Failed to generate design. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Surprise Me
  const handleSurprise = () => {
    if(BEDROOM_STYLES.length < 2) return;
    const style1 = BEDROOM_STYLES[Math.floor(Math.random() * BEDROOM_STYLES.length)];
    let style2 = BEDROOM_STYLES[Math.floor(Math.random() * BEDROOM_STYLES.length)];
    while(style1.id === style2.id) {
        style2 = BEDROOM_STYLES[Math.floor(Math.random() * BEDROOM_STYLES.length)];
    }

    const mixedStyle: DesignStyle = {
        id: `mixed-${Date.now()}`,
        name: `${style1.name} + ${style2.name}`,
        prompt: `A creative fusion of ${style1.name} and ${style2.name} interior design styles. ${style1.prompt}. ${style2.prompt}.`,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    };

    handleStyleSelect(mixedStyle);
  };

  // Handle Chat Interaction
  const handleSendMessage = async (text: string) => {
    if (!originalImage) return;

    // Optimistic User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // Create context from previous messages for better continuity
      const historyText = messages.map(m => `${m.role}: ${m.text}`).join('\n');
      
      const { textResponse, imageBase64 } = await generateChatDesign(
        originalImage, 
        historyText, 
        text
      );

      if (imageBase64) {
        setGeneratedImage(imageBase64);
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: textResponse,
        image: imageBase64 || undefined
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      setError("Failed to process your request.");
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: "I'm sorry, I encountered an error trying to redesign the room. Please try again.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Layout size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              DreamSpace AI
            </h1>
          </div>
          {originalImage && (
            <button 
                onClick={() => {
                    setOriginalImage(null);
                    setGeneratedImage(null);
                    setMessages([]);
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
                New Project <ArrowRight size={12} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {!originalImage ? (
          /* Empty State / Upload */
          <div className="h-[70vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4 max-w-lg">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Reimagine your <br/>
                <span className="text-purple-500">Bedroom</span> in seconds.
              </h2>
              <p className="text-slate-400 text-lg">
                Upload a photo and let AI transform your space into 10+ stunning interior design styles.
              </p>
            </div>

            <div className="w-full max-w-md">
              <label 
                htmlFor="upload-input"
                className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-700 border-dashed rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                    <Upload className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="mb-2 text-sm text-slate-300 font-medium">Click to upload photo</p>
                  <p className="text-xs text-slate-500">JPEG, PNG up to 5MB</p>
                </div>
                
                {/* Decorative background gradients */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all"></div>
                
                <input 
                    id="upload-input" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        ) : (
          /* Main Interface */
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Visuals (Col span 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Image Display Area */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl min-h-[300px] border border-slate-800">
                {isProcessing && !generatedImage && (
                    <div className="absolute inset-0 z-30 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <Wand2 className="w-12 h-12 text-purple-500 animate-bounce mb-4" />
                        <p className="font-medium animate-pulse">Dreaming up your new room...</p>
                    </div>
                )}
                
                {generatedImage ? (
                  <ComparisonSlider 
                    beforeImage={originalImage} 
                    afterImage={generatedImage} 
                  />
                ) : (
                  <img 
                    src={originalImage} 
                    alt="Original Bedroom" 
                    className="w-full h-auto object-cover max-h-[600px]"
                  />
                )}
              </div>

              {/* Style Carousel */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                 <StyleSelector 
                    onSelectStyle={handleStyleSelect} 
                    onSurprise={handleSurprise}
                    selectedStyleId={selectedStyle}
                    disabled={isProcessing}
                 />
              </div>
            </div>

            {/* Right Column: Interaction (Col span 1) */}
            <div className="space-y-6">
                
                {/* Info Card */}
                {!generatedImage && !isProcessing && (
                    <div className="bg-gradient-to-br from-purple-900/50 to-slate-900 border border-purple-500/30 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <ImageIcon size={20} className="text-purple-400"/> 
                            Ready to design?
                        </h3>
                        <p className="text-slate-300 text-sm">
                            Select a style below to see the magic happen, or use the chat to give specific instructions.
                        </p>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Chat Interface */}
                <ChatArea 
                    messages={messages} 
                    onSendMessage={handleSendMessage}
                    isLoading={isProcessing}
                />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
