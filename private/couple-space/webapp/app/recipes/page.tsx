'use client'

import { useState } from 'react'
import { ChefHat, Clock, Users, Star, Plus, Heart, Search, Filter, Check, Calendar } from 'lucide-react'

interface Recipe {
  id: string
  title: string
  description: string
  image?: string
  cuisine: string
  difficulty: 'easy' | 'medium' | 'hard'
  time: string
  servings: number
  ingredients: string[]
  instructions: string[]
  rating?: number
  weMadeThis?: {
    date: string
    rating: number
  }
}

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Homemade Margherita Pizza',
    description: 'Classic Italian pizza with fresh basil and mozzarella',
    cuisine: 'Italian',
    difficulty: 'medium',
    time: '1.5 hours',
    servings: 2,
    ingredients: ['Pizza dough', 'San Marzano tomatoes', 'Fresh mozzarella', 'Fresh basil', 'Olive oil', 'Salt'],
    instructions: ['Preheat oven to 475°F', 'Stretch the dough', 'Add sauce and toppings', 'Bake for 12-15 minutes'],
    rating: 5,
    weMadeThis: { date: '2024-02-14', rating: 5 }
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    description: 'Creamy, spiced Indian curry with tender chicken',
    cuisine: 'Indian',
    difficulty: 'medium',
    time: '45 min',
    servings: 4,
    ingredients: ['Chicken breast', 'Yogurt', 'Garam masala', 'Tomato puree', 'Cream', 'Garlic', 'Ginger', 'Rice'],
    instructions: ['Marinate chicken in yogurt and spices', 'Grill chicken pieces', 'Make curry sauce', 'Combine and simmer'],
    rating: 4
  },
  {
    id: '3',
    title: 'Avocado Toast with Poached Egg',
    description: 'Simple, healthy breakfast or brunch option',
    cuisine: 'American',
    difficulty: 'easy',
    time: '15 min',
    servings: 2,
    ingredients: ['Sourdough bread', 'Ripe avocados', 'Eggs', 'Lemon juice', 'Red pepper flakes', 'Salt', 'Pepper'],
    instructions: ['Toast the bread', 'Mash avocado with seasonings', 'Poach eggs', 'Assemble and serve']
  },
  {
    id: '4',
    title: 'Beef Tacos',
    description: 'Authentic Mexican street tacos with all the toppings',
    cuisine: 'Mexican',
    difficulty: 'easy',
    time: '30 min',
    servings: 4,
    ingredients: ['Ground beef', 'Corn tortillas', 'Onion', 'Cilantro', 'Lime', 'Cumin', 'Chili powder', 'Salsa'],
    instructions: ['Brown the beef with spices', 'Warm tortillas', 'Dice onions and cilantro', 'Assemble tacos'],
    rating: 5
  },
  {
    id: '5',
    title: 'Mushroom Risotto',
    description: 'Creamy, comforting Italian rice dish',
    cuisine: 'Italian',
    difficulty: 'hard',
    time: '45 min',
    servings: 4,
    ingredients: ['Arborio rice', 'Mushrooms', 'Vegetable broth', 'White wine', 'Parmesan cheese', 'Butter', 'Onion', 'Garlic'],
    instructions: ['Sauté mushrooms', 'Toast rice', 'Add wine and stir', 'Gradually add broth', 'Finish with butter and cheese'],
    weMadeThis: { date: '2024-01-20', rating: 4 }
  },
  {
    id: '6',
    title: 'Thai Green Curry',
    description: 'Fragrant, spicy curry with vegetables and coconut milk',
    cuisine: 'Thai',
    difficulty: 'medium',
    time: '35 min',
    servings: 4,
    ingredients: ['Green curry paste', 'Coconut milk', 'Thai basil', 'Bell peppers', 'Bamboo shoots', 'Chicken or tofu', 'Fish sauce', 'Palm sugar'],
    instructions: ['Fry curry paste', 'Add coconut milk', 'Add vegetables and protein', 'Simmer and season'],
    rating: 4
  }
]

const cuisineFilters = ['All', 'Italian', 'Indian', 'Mexican', 'Thai', 'American']

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine
    return matchesSearch && matchesCuisine
  })

  const toggleMadeThis = (recipeId: string) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        if (recipe.weMadeThis) {
          return { ...recipe, weMadeThis: undefined }
        } else {
          return { 
            ...recipe, 
            weMadeThis: { 
              date: new Date().toISOString().split('T')[0], 
              rating: 5 
            } 
          }
        }
      }
      return recipe
    }))
  }

  const rateRecipe = (recipeId: string, rating: number) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId ? { ...recipe, rating } : recipe
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full mb-4">
          <ChefHat className="w-5 h-5 text-orange-500" />
          <span className="text-stone-600 font-medium">Our Recipe Collection</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
          Recipes We Love
        </h1>
        <p className="text-stone-500">Track what we've cooked and what to try next</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{recipes.length}</div>
          <div className="text-sm text-stone-500">Recipes</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {recipes.filter(r => r.weMadeThis).length}
          </div>
          <div className="text-sm text-stone-500">Made</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-rose-600">
            {recipes.filter(r => !r.weMadeThis).length}
          </div>
          <div className="text-sm text-stone-500">To Try</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-cozy pl-12"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {cuisineFilters.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCuisine === cuisine
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-stone-600 hover:bg-orange-50 border border-rose-100'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="glass-card overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
          >
            {/* Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center relative">
              <ChefHat className="w-12 h-12 text-orange-300" />
              {recipe.weMadeThis && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Made
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[recipe.difficulty]}`}>
                  {recipe.difficulty}
                </span>
                <span className="text-xs text-stone-500">{recipe.cuisine}</span>
              </div>

              <h3 className="font-bold text-stone-800 mb-1 group-hover:text-orange-600 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-sm text-stone-500 line-clamp-2">{recipe.description}</p>

              <div className="flex items-center gap-4 mt-4 text-sm text-stone-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recipe.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {recipe.servings}
                </span>
              </div>

              {recipe.weMadeThis && (
                <div className="mt-3 pt-3 border-t border-rose-100">
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Calendar className="w-4 h-4" />
                    <span>Made on {recipe.weMadeThis.date}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= recipe.weMadeThis!.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header Image */}
            <div className="aspect-video bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center relative">
              <ChefHat className="w-16 h-16 text-orange-300" />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[selectedRecipe.difficulty]}`}>
                      {selectedRecipe.difficulty}
                    </span>
                    <span className="text-sm text-stone-500">{selectedRecipe.cuisine}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-800">{selectedRecipe.title}</h2>
                </div>
                <button
                  onClick={() => toggleMadeThis(selectedRecipe.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    selectedRecipe.weMadeThis
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone-100 text-stone-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {selectedRecipe.weMadeThis ? 'Made It!' : 'Mark as Made'}
                </button>
              </div>

              <p className="text-stone-600 mb-6">{selectedRecipe.description}</p>

              <div className="flex items-center gap-6 mb-6 text-sm text-stone-500">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedRecipe.time}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {selectedRecipe.servings} servings
                </span>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <p className="text-sm font-medium text-stone-600 mb-2">Your Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => rateRecipe(selectedRecipe.id, star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (selectedRecipe.rating || 0)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-200 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-bold text-stone-800 mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-stone-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-bold text-stone-800 mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </span>
                      <p className="text-stone-600">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
