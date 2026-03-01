'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface AddExpenseFormProps {
  onAdd: (expense: { amount: number, date: string, category: string, item: string }) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export function AddExpenseForm({ onAdd, onClose, isOpen }: AddExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !item || !category || !date) return;
    
    setLoading(true);
    try {
      await onAdd({
        amount: parseFloat(amount),
        item,
        category,
        date
      });
      // Reset form on success
      setAmount('');
      setItem('');
      setCategory('');
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
        
        <Input 
          label="Category" 
          type="text" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="e.g. Food & Dining"
          required 
        />
        
        <Input 
          label="Date" 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />

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
