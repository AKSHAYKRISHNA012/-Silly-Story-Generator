
import React, { useState, useCallback } from 'react';
import { StoryIdeas } from './types';
import { generateSillyStory, generateRandomIdeas } from './services/geminiService';
import StoryInputForm from './components/StoryInputForm';
import StoryDisplay from './components/StoryDisplay';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<StoryIdeas>({
    name: '',
    place: '',
    activity: '',
  });
  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStory = useCallback(async (currentIdeas: StoryIdeas) => {
    if (!currentIdeas.name || !currentIdeas.place || !currentIdeas.activity) {
      setError("Please fill out all fields to create a story!");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStory('');

    try {
      const generatedStory = await generateSillyStory(currentIdeas.name, currentIdeas.place, currentIdeas.activity);
      setStory(generatedStory);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRandomize = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStory('');
    setIdeas({ name: '', place: '', activity: '' }); 
    try {
        const randomIdeas = await generateRandomIdeas();
        setIdeas(randomIdeas);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("An unknown error occurred while fetching ideas.");
        }
    } finally {
        setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
          <StoryInputForm
            ideas={ideas}
            setIdeas={setIdeas}
            onGenerate={handleGenerateStory}
            onRandomize={handleRandomize}
            isLoading={isLoading}
          />
          <StoryDisplay
            story={story}
            isLoading={isLoading}
            error={error}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
