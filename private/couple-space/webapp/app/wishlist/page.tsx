'use client'

import { useState } from 'react'
import { Gift, Heart, Plus, ExternalLink, Trash2, Check, Lock, Unlock, Star } from 'lucide-react'

interface WishlistItem {
  id: string
  title: string
  description?: string
  link?: string
  price?: string
  priority: 'low' | 'medium' | 'high'
  bought: boolean
  boughtBy?: string
}

interface Wishlist {
  userId: string
  userName: string
  items: WishlistItem[]
}

const initialWishlists: Wishlist[] = [
  {
    userId: 'user1',
    userName: 'Your Wishlist',
    items: [
      { id: '1', title: 'Wireless Headphones', description: 'Sony WH-1000XM5', price: '$350', priority: 'high', bought: false },
      { id: '2', title: 'Cooking Class', description: 'Italian cuisine weekend course', price: '$200', priority: 'medium', bought: true, boughtBy: 'Partner' },
      { id: '3', title: 'Hiking Boots', link: 'https://example.com/boots', price: '$180', priority: 'low', bought: false },
    ]
  },
  {
    userId: 'user2',
    userName: 'Partner\'s Wishlist',
    items: [
      { id: '4', title: 'Art Supplies Set', description: 'Professional watercolor kit', price: '$120', priority: 'medium', bought: false },
      { id: '5', title: 'Spa Day', description: 'Full day spa package', price: '$250', priority: 'high', bought: true, boughtBy: 'You' },
      { id: '6', title: 'Kindle Paperwhite', price: '$140', priority: 'low', bought: false },
    ]
  }
]

const priorityColors = {
  low: 'bg-stone-100 text-stone-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-rose-100 text-rose-600',
}

const priorityLabels = {
  low: 'Nice to have',
  medium: 'Would love',
  high: 'Dream gift',
}

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>(initialWishlists)
  const [activeTab, setActiveTab] = useState<'yours' | 'theirs'>('yours')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState<Partial<WishlistItem>>({
    priority: 'medium',
  })

  const currentWishlist = wishlists.find(w => 
    activeTab === 'yours' ? w.userId === 'user1' : w.userId === 'user2'
  )

  const otherWishlist = wishlists.find(w => 
    activeTab === 'yours' ? w.userId === 'user2' : w.userId === 'user1'
  )

  const addItem = () => {
    if (!newItem.title) return
    
    const item: WishlistItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      link: newItem.link,
      price: newItem.price,
      priority: newItem.priority || 'medium',
      bought: false,
    }

    setWishlists(prev => prev.map(w => 
      w.userId === (activeTab === 'yours' ? 'user1' : 'user2')
        ? { ...w, items: [...w.items, item] }
        : w
    ))
    
    setNewItem({ priority: 'medium' })
    setShowAddModal(false)
  }

  const deleteItem = (itemId: string) => {
    setWishlists(prev => prev.map(w => 
      w.userId === (activeTab === 'yours' ? 'user1' : 'user2')
        ? { ...w, items: w.items.filter(i => i.id !== itemId) }
        : w
    ))
  }

  const toggleBought = (itemId: string) => {
    setWishlists(prev => prev.map(w => ({
      ...w,
      items: w.items.map(i => 
        i.id === itemId 
          ? { ...i, bought: !i.bought, boughtBy: i.bought ? undefined : 'You' }
          : i
      )
    })))
  }

  const renderWishlist = (wishlist: Wishlist | undefined, isOwn: boolean) => {
    if (!wishlist) return null

    return (
      <div className="space-y-4">
        {wishlist.items.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <Gift className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">
              {isOwn ? 'Your wishlist is empty' : 'Their wishlist is empty'}
            </p>
          </div>
        ) : (
          wishlist.items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.bought 
                  ? 'bg-stone-50 border-stone-200 opacity-60' 
                  : 'bg-white border-rose-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Priority Indicator */}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[item.priority]}`}>
                  {priorityLabels[item.priority]}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${item.bought ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-stone-500 mt-1">{item.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3">
                    {item.price && (
                      <span className="text-sm font-medium text-rose-600">{item.price}</span>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    )}
                    {item.bought && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Bought by {item.boughtBy}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isOwn && (
                    <button
                      onClick={() => toggleBought(item.id)}
                      className={`p-2 rounded-full transition-colors ${
                        item.bought 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-stone-100 text-stone-400 hover:bg-green-50 hover:text-green-500'
                      }`}
                      title={item.bought ? 'Mark as not bought' : 'Mark as bought'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {isOwn && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-stone-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 bg-rose-100 px-6 py-3 rounded-full mb-4">
          <Gift className="w-5 h-5 text-rose-500" />
          <span className="text-stone-600 font-medium">Gift Wishlists</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
          What We Want
        </h1>
        <p className="text-stone-500">Keep track of gift ideas for each other</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white rounded-full p-1 shadow-md border border-rose-100 flex">
          <button
            onClick={() => setActiveTab('yours')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'yours' 
                ? 'bg-rose-500 text-white' 
                : 'text-stone-600 hover:bg-rose-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Your Wishlist
            </span>
          </button>
          <button
            onClick={() => setActiveTab('theirs')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'theirs' 
                ? 'bg-rose-500 text-white' 
                : 'text-stone-600 hover:bg-rose-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Their Wishlist
            </span>
          </button>
        </div>
      </div>

      {/* Tab Info */}
      <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
        {activeTab === 'yours' ? (
          <>
            <Unlock className="w-4 h-4" />
            <span>You can edit this list</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>You can view and mark items as bought</span>
          </>
        )}
      </div>

      {/* Add Button (only for own list) */}
      {activeTab === 'yours' && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add to Your Wishlist
          </button>
        </div>
      )}

      {/* Wishlist Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'yours' 
          ? renderWishlist(currentWishlist, true)
          : renderWishlist(otherWishlist, false)
        }
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">Add to Wishlist</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={newItem.title || ''}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="What do you want?"
                  className="input-cozy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Description</label>
                <input
                  type="text"
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Details, brand, size, etc."
                  className="input-cozy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Price</label>
                  <input
                    type="text"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="e.g. $50"
                    className="input-cozy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as WishlistItem['priority'] })}
                    className="input-cozy"
                  >
                    <option value="low">Nice to have</option>
                    <option value="medium">Would love</option>
                    <option value="high">Dream gift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Link (optional)</label>
                <input
                  type="url"
                  value={newItem.link || ''}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  placeholder="https://..."
                  className="input-cozy"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="flex-1 btn-primary"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
