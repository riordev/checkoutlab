'use client'

import { useState } from 'react'
import { Plus, Trash2, Check, CheckCircle2, Circle, MoreHorizontal, Film, Tv, Utensils, ShoppingCart, Plane, Sparkles, X } from 'lucide-react'

interface ListItem {
  id: string
  text: string
  completed: boolean
  note?: string
}

interface List {
  id: string
  title: string
  icon: string
  items: ListItem[]
  color: string
}

const templates = [
  { name: 'Movies', icon: Film, color: 'from-purple-400 to-pink-400' },
  { name: 'Shows', icon: Tv, color: 'from-blue-400 to-cyan-400' },
  { name: 'Restaurants', icon: Utensils, color: 'from-orange-400 to-red-400' },
  { name: 'Groceries', icon: ShoppingCart, color: 'from-green-400 to-emerald-400' },
  { name: 'Travel Ideas', icon: Plane, color: 'from-sky-400 to-indigo-400' },
]

const initialLists: List[] = [
  {
    id: '1',
    title: '🎬 Movies to Watch',
    icon: 'Film',
    color: 'purple',
    items: [
      { id: '1', text: 'The Notebook', completed: false },
      { id: '2', text: 'La La Land', completed: true },
      { id: '3', text: 'Eternal Sunshine', completed: false, note: 'For rainy Sunday' },
    ],
  },
  {
    id: '2',
    title: '🍝 Date Night Restaurants',
    icon: 'Utensils',
    color: 'orange',
    items: [
      { id: '1', text: 'That cozy Italian place', completed: false, note: 'Reservation needed' },
      { id: '2', text: 'Rooftop bar downtown', completed: false },
      { id: '3', text: 'Sushi spot', completed: true },
    ],
  },
]

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>(initialLists)
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const [newItemText, setNewItemText] = useState('')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  const toggleItem = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : list
      )
    )
  }

  const addItem = (listId: string) => {
    if (!newItemText.trim()) return
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: [
                ...list.items,
                { id: Date.now().toString(), text: newItemText, completed: false },
              ],
            }
          : list
      )
    )
    setNewItemText('')
  }

  const deleteItem = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      )
    )
  }

  const createFromTemplate = (template: (typeof templates)[0]) => {
    const newList: List = {
      id: Date.now().toString(),
      title: template.name,
      icon: template.name,
      color: template.color.split('-')[1],
      items: [],
    }
    setLists([...lists, newList])
    setShowTemplateModal(false)
  }

  const createCustomList = () => {
    if (!newListTitle.trim()) return
    const newList: List = {
      id: Date.now().toString(),
      title: newListTitle,
      icon: 'Sparkles',
      color: 'rose',
      items: [],
    }
    setLists([...lists, newList])
    setNewListTitle('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Our Lists</h1>
          <p className="text-stone-500 mt-1">Keep track of everything together</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New List
        </button>
      </div>

      {/* Lists Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {lists.map((list) => (
          <div key={list.id} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-800">{list.title}</h3>
              <button className="text-stone-400 hover:text-stone-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {list.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                    item.completed ? 'bg-stone-50' : 'bg-white border border-rose-100'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(list.id, item.id)}
                    className="mt-0.5"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-rose-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-rose-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        item.completed ? 'line-through text-stone-400' : 'text-stone-700'
                      }`}
                    >
                      {item.text}
                    </p>
                    {item.note && (
                      <p className="text-xs text-stone-400 mt-1">{item.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteItem(list.id, item.id)}
                    className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Item */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add an item..."
                value={selectedList?.id === list.id ? newItemText : ''}
                onChange={(e) => {
                  setSelectedList(list)
                  setNewItemText(e.target.value)
                }}
                onKeyPress={(e) => e.key === 'Enter' && addItem(list.id)}
                className="input-cozy text-sm py-2"
              />
              <button
                onClick={() => addItem(list.id)}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-800">Create New List</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-stone-100 rounded-full"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Templates */}
            <div className="mb-6">
              <p className="text-sm text-stone-500 mb-3">Choose a template:</p>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => {
                  const Icon = template.icon
                  return (
                    <button
                      key={template.name}
                      onClick={() => createFromTemplate(template)}
                      className="p-4 rounded-2xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 transition-all flex flex-col items-center gap-2"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-stone-700">{template.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom List */}
            <div className="border-t border-stone-100 pt-6">
              <p className="text-sm text-stone-500 mb-3">Or create a custom list:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="List name..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createCustomList()}
                  className="input-cozy flex-1"
                />
                <button
                  onClick={createCustomList}
                  className="btn-primary"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
