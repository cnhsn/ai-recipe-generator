'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ApiError {
  error: string;
  details?: string;
  type?: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');
  const [dietary, setDietary] = useState<string>('');
  const [mealType, setMealType] = useState<string>('');
  const [recipe, setRecipe] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      setError('En az bir malzeme girmelisiniz.');
      toast.error('En az bir malzeme girmelisiniz.');
      return;
    }

    setLoading(true);
    setError('');
    setRecipe('');
    
    try {
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
          cuisine: cuisine.trim(),
          dietary: dietary.trim(),
          mealType: mealType.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.error || 'Tarif oluşturulurken bir hata oluştu');
      }

      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid API response format:', data);
        throw new Error('API yanıtı beklenmeyen formatta');
      }

      const content = data.choices[0].message.content;
      
      if (typeof content !== 'string' || content.trim().length === 0) {
        throw new Error('API geçersiz içerik döndürdü');
      }

      setRecipe(content);
      setShowOptions(false);
      toast.success('Tarif başarıyla oluşturuldu!');
    } catch (error: any) {
      const errorMessage = error.message || 'Tarif oluşturulurken bir hata oluştu.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('API Error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    setter(e.target.value);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="chat-bubble ai-bubble">
            <p className="text-lg">Merhaba! Ben sizin kişisel şef asistanınızım. Size özel tarifler oluşturabilirim. 
            Malzemelerinizi ve tercihlerinizi girin, size uygun bir tarif hazırlayayım.</p>
          </div>

          {error && (
            <div className="chat-bubble bg-red-500/10 border border-red-500/20 text-red-500">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {recipe && (
            <div className="chat-bubble ai-bubble">
              <div className="prose prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {recipe}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-secondary p-4">
        <div className="max-w-4xl mx-auto">
          {showOptions ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">
                    Malzemeler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => handleInputChange(e, setIngredients)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="domates, soğan, zeytinyağı..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">
                    Mutfak Türü
                  </label>
                  <input
                    type="text"
                    value={cuisine}
                    onChange={(e) => handleInputChange(e, setCuisine)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="Türk, İtalyan, Çin..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">
                    Diyet Kısıtlamaları
                  </label>
                  <input
                    type="text"
                    value={dietary}
                    onChange={(e) => handleInputChange(e, setDietary)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="Vejetaryen, Vegan, Glutensiz..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground/80">
                    Öğün Türü
                  </label>
                  <input
                    type="text"
                    value={mealType}
                    onChange={(e) => handleInputChange(e, setMealType)}
                    className="w-full p-2 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="Kahvaltı, Öğle Yemeği, Akşam Yemeği..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowOptions(false)}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50 transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <span>Tarif Oluşturuluyor...</span>
                  ) : (
                    <>
                      <span>Tarif Oluştur</span>
                      <ChevronRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowOptions(true)}
              className="w-full p-3 rounded-lg bg-background border border-border text-foreground hover:bg-secondary transition-colors flex items-center justify-between"
            >
              <span className="text-foreground/80">Tarif oluşturmak için tıklayın...</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
} 