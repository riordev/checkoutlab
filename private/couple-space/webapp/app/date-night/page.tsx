'use client'

import { useState, useEffect } from 'react'
import { Sparkles, RefreshCw, Heart, Star, Check, Dices, Bike, Coffee, Pizza, Mountain, Home } from 'lucide-react'

interface DateIdea {
  id: string
  title: string
  description: string
  category: 'active' | 'chill' | 'food' | 'adventure' | 'home'
  estimatedTime: string
  estimatedCost: '$' | '$$' | '$$$'
}

const dateIdeas: DateIdea[] = [
  { id: '1', title: 'Sunset Hike', description: 'Find a local trail and watch the sunset together', category: 'active', estimatedTime: '2-3 hours', estimatedCost: '$' },
  { id: '2', title: 'Cooking Challenge', description: 'Pick a cuisine and cook a 3-course meal together', category: 'home', estimatedTime: '2-4 hours', estimatedCost: '$$' },
  { id: '3', title: 'Board Game Night', description: 'Snacks, drinks, and competitive fun at home', category: 'home', estimatedTime: '2 hours', estimatedCost: '$' },
  { id: '4', title: 'Food Truck Crawl', description: 'Visit 3-4 food trucks and share everything', category: 'food', estimatedTime: '2 hours', estimatedCost: '$$' },
  { id: '5', title: 'Stargazing Picnic', description: 'Blanket, wine, and the night sky', category: 'chill', estimatedTime: '2-3 hours', estimatedCost: '$' },
  { id: '6', title: 'Pottery Class', description: 'Get messy and creative together', category: 'adventure', estimatedTime: '2 hours', estimatedCost: '$$$' },
  { id: '7', title: 'Bike Ride & Brunch', description: 'Morning ride followed by a cozy brunch', category: 'active', estimatedTime: '3-4 hours', estimatedCost: '$$' },
  { id: '8', title: 'Movie Marathon', description: 'Pick a trilogy and snuggle up', category: 'chill', estimatedTime: '4-5 hours', estimatedCost: '$' },
  { id: '9', title: 'Escape Room', description: 'Test your teamwork skills', category: 'adventure', estimatedTime: '1.5 hours', estimatedCost: '$$$' },
  { id: '10', title: 'Farmers Market + Picnic', description: 'Shop together, then enjoy your finds', category: 'food', estimatedTime: '3 hours', estimatedCost: '$$' },
  { id: '11', title: 'DIY Pizza Night', description: 'Make pizzas from scratch at home', category: 'home', estimatedTime: '2 hours', estimatedCost: '$$' },
  { id: '12', title: 'Kayaking', description: 'Paddle together on a nearby lake', category: 'active', estimatedTime: '2-3 hours', estimatedCost: '$$' },
  { id: '13', title: 'Rooftop Bar', description: 'Drinks with a view', category: 'food', estimatedTime: '2 hours', estimatedCost: '$$$' },
  { id: '14', title: 'Museum Date', description: 'Get cultured together', category: 'chill', estimatedTime: '2-3 hours', estimatedCost: '$$' },
  { id: '15', title: 'Rock Climbing', description: 'Indoor climbing for beginners', category: 'adventure', estimatedTime: '2 hours', estimatedCost: '$$' },
]

const categoryIcons = {
  active: Bike,
  chill: Coffee,
  food: Pizza,
  adventure: Mountain,
  home: Home,
}

const categoryColors = {
  active: 'bg-green-100 text-green-700 border-green-200',
  chill: 'bg-blue-100 text-blue-700 border-blue-200',
  food: 'bg-orange-100 text-orange-700 border-orange-200',
  adventure: 'bg-purple-100 text-purple-700 border-purple-200',
  home: 'bg-rose-100 text-rose-700 border-rose-200',
}

export default function DateNightPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentIdea, setCurrentIdea] = useState<DateIdea | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [completed, setCompleted] = useState<string[]>([])

  const categories = ['all', 'active', 'chill', 'food', 'adventure', 'home']

  const filteredIdeas = selectedCategory === 'all' 
    ? dateIdeas 
    : dateIdeas.filter(idea => idea.category === selectedCategory)

  const spinWheel = () => {
    if (isSpinning) return
    setIsSpinning(true)
    
    let spins = 0
    const maxSpins = 15
    const interval = setInterval(() => {
      const randomIdea = filteredIdeas[Math.floor(Math.random() * filteredIdeas.length)]
      setCurrentIdea(randomIdea)
      spins++
      
      if (spins >= maxSpins) {
        clearInterval(interval)
        setIsSpinning(false)
      }
    }, 100)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const toggleCompleted = (id: string) => {
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="text-stone-600 font-medium">Date Night Picker</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
          What Should We Do?
        </h1>
        <p className="text-stone-500">Spin the wheel or browse ideas for our next date</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              selectedCategory === cat
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-100'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Spin Wheel Section */}
      <div className="glass-card p-8 text-center">
        <div className="max-w-md mx-auto">
          {/* Result Display */}
          <div className={`mb-8 p-8 rounded-2xl border-2 border-dashed transition-all ${
            currentIdea ? 'bg-white border-rose-300' : 'bg-rose-50/50 border-rose-200'
          }`}>
            {currentIdea ? (
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[currentIdea.category]}`}>
                  {(() => {
                    const Icon = categoryIcons[currentIdea.category]
                    return <Icon className="w-4 h-4" />
                  })()}
                  {currentIdea.category.charAt(0).toUpperCase() + currentIdea.category.slice(1)}
                </div>
                <h3 className="text-2xl font-bold text-stone-800">{currentIdea.title}</h3>
                <p className="text-stone-600">{currentIdea.description}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-stone-500">
                  <span>⏱️ {currentIdea.estimatedTime}</span>
                  <span>💰 {currentIdea.estimatedCost}</span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => toggleFavorite(currentIdea.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      favorites.includes(currentIdea.id)
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-stone-100 text-stone-600 hover:bg-pink-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(currentIdea.id) ? 'fill-pink-500' : ''}`} />
                    {favorites.includes(currentIdea.id) ? 'Favorited' : 'Save'}
                  </button>
                  <button
                    onClick={() => toggleCompleted(currentIdea.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      completed.includes(currentIdea.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-stone-100 text-stone-600 hover:bg-green-50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {completed.includes(currentIdea.id) ? 'Done' : 'Did It!'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-stone-400">
                <Dices className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Click the button below to get a date idea!</p>
              </div>
            )}
          </div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-full text-lg font-bold transition-all ${
              isSpinning
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <RefreshCw className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
          <div className="text-sm text-stone-500">Favorites</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completed.length}</div>
          <div className="text-sm text-stone-500">Completed</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-rose-600">{dateIdeas.length}</div>
          <div className="text-sm text-stone-500">Total Ideas</div>
        </div>
      </div>

      {/* Browse All Ideas */}
      <section>
        <h2 className="section-title flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500" />
          Browse All Ideas
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => {
            const Icon = categoryIcons[idea.category]
            return (
              <div
                key={idea.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                  completed.includes(idea.id)
                    ? 'bg-green-50/50 border-green-200'
                    : 'bg-white border-rose-100'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${categoryColors[idea.category].split(' ')[0]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleFavorite(idea.id)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.includes(idea.id) ? 'text-pink-500' : 'text-stone-300 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(idea.id) ? 'fill-pink-500' : ''}`} />
                    </button>
                  </div>
                </div>
                <h3 className={`font-semibold mb-1 ${completed.includes(idea.id) ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                  {idea.title}
                </h3>
                <p className="text-sm text-stone-500 mb-3">{idea.description}</p>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>{idea.estimatedTime}</span>
                  <span>{idea.estimatedCost}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
