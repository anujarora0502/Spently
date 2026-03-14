'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface AddExpenseFormProps {
  onAdd: (expense: { amount: number, date: string, category: string, item: string }) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  userCategories: string[];
}

export function AddExpenseForm({ onAdd, onClose, isOpen, userCategories }: AddExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isAddingNewCategory ? newCategory : category;
    if (!amount || !item || !finalCategory || !date) return;
    
    setLoading(true);
    try {

      await onAdd({
        amount: parseFloat(amount),
        item,
        category: finalCategory,
        date
      });
      // Reset form on success
      setAmount('');
      setItem('');
      setCategory('');
      setNewCategory('');
      setIsAddingNewCategory(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="450px">
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }} className="heading-gradient">Add Manual Expense</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Input 
          label="Amount (₹)" 
          type="number" 
          step="0.01" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="e.g. 150.50"
          required 
        />
        
        <Input 
          label="Item" 
          type="text" 
          value={item} 
          onChange={(e) => setItem(e.target.value)} 
          placeholder="e.g. Filter Coffee"
          required 
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Category</label>
          {!isAddingNewCategory ? (
            <div style={{ position: 'relative' }}>
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === 'add_new') {
                    setIsAddingNewCategory(true);
                    setCategory('');
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--rounded-md)',
                  background: 'var(--surface-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  appearance: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <option value="" disabled>Select a category</option>
                {userCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="add_new" style={{ fontWeight: 'bold' }}>+ Add New Category</option>
              </select>
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Input
                  label=""
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category Name"
                  containerStyle={{ marginBottom: 0 }}
                  required
                />
              </div>
              <Button type="button" variant="secondary" onClick={() => setIsAddingNewCategory(false)} style={{ padding: '0.75rem 1rem', height: '100%' }}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Date</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--rounded-md)',
                background: 'var(--surface-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              // This CSS hides the default calendar icon so we can replace it.
              className="custom-date-input"
            />
            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} style={{ flex: 1, padding: '12px' }}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} style={{ flex: 1, padding: '12px' }}>
            {loading ? 'Saving...' : 'Save Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
