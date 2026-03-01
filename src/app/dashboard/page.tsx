'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ExpenseTable } from '@/components/ExpenseTable';
import { AddExpenseForm } from '@/components/AddExpenseForm';
import { VoiceInput } from '@/components/VoiceInput';
import { AIGraphs } from '@/components/AIGraphs';
import { AIQueryModal } from '@/components/AIQueryModal';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { expenseService } from '@/lib/expenseService';
import { Expense } from '@/types/expense';
import { Plus, BarChart2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [graphPrompt, setGraphPrompt] = useState<string>('');
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [queryPrompt, setQueryPrompt] = useState<string>('');
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (expenseData: { amount: number, date: string, category: string, item: string }) => {
    try {
      await expenseService.addExpense(expenseData);
      await fetchExpenses(); // Refresh list
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleCopyExpense = async (expense: Expense) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const todayString = d.toISOString().split('T')[0];
    
    try {
      // Create a duplicate with today's date
      await expenseService.addExpense({
        amount: Number(expense.amount),
        date: todayString,
        category: expense.category,
        item: expense.item
      });
      // Optionally jump to current month to see the copied expense
      setCurrentViewMonth(new Date()); 
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    
    try {
      await expenseService.deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
      await fetchExpenses(); // Refresh list to update UI and graphs
    } catch (err: any) {
      setError(err.message);
    }
  };

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentViewMonth.getMonth() && d.getFullYear() === currentViewMonth.getFullYear();
  });

  const viewMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  const displayMonthString = currentViewMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const isPresentMonth = currentViewMonth.getMonth() === new Date().getMonth() && currentViewMonth.getFullYear() === new Date().getFullYear();
    
  const handleGraphRequest = (prompt: string) => {
    setGraphPrompt(prompt);
    setShowGraphs(true);
  };

  const handleQueryRequest = (prompt: string) => {
    setQueryPrompt(prompt);
    setShowQueryModal(true);
  };

  const prevMonth = () => {
    const d = new Date(currentViewMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentViewMonth(d);
  };

  const nextMonth = () => {
    const d = new Date(currentViewMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentViewMonth(d);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in mobile-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
        <div className="mobile-text-center mobile-w-full">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>You've spent <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{viewMonthTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> in {isPresentMonth ? 'this month' : displayMonthString}.</p>
        </div>
        
        <div className="mobile-w-full" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => { setGraphPrompt(''); setShowGraphs(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '120px', justifyContent: 'center' }}>
            <BarChart2 size={20} style={{ flexShrink: 0 }} /> <span style={{ whiteSpace: 'nowrap' }}>Analytics</span>
          </Button>
          <Button onClick={() => setShowAddForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '120px', justifyContent: 'center' }}>
            <Plus size={22} strokeWidth={2.5} style={{ flexShrink: 0 }} /> <span style={{ whiteSpace: 'nowrap' }}>Add Expense</span>
          </Button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--rounded-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Modals */}
      <AddExpenseForm isOpen={showAddForm} onAdd={handleAddExpense} onClose={() => setShowAddForm(false)} />
      <AIGraphs expenses={expenses} isOpen={showGraphs} onClose={() => setShowGraphs(false)} initialPrompt={graphPrompt} />
      <AIQueryModal expenses={currentMonthExpenses} isOpen={showQueryModal} onClose={() => setShowQueryModal(false)} initialPrompt={queryPrompt} />
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!expenseToDelete} onClose={() => setExpenseToDelete(null)} width="400px">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--danger)' }}>
            <AlertCircle size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Delete Expense</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
            Are you sure you want to delete this expense? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
            <Button variant="secondary" onClick={() => setExpenseToDelete(null)} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              style={{ flex: 1, background: 'var(--danger)', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)' }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="animate-fade-in animate-delay-1">
          <div className="mobile-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <h2 className="mobile-text-center" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Expenses</h2>
            
            <div className="mobile-w-full" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '999px', padding: '8px 16px' }}>
               <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ChevronLeft size={18} /></button>
               <span style={{ fontSize: '0.9rem', fontWeight: 500, minWidth: '110px', textAlign: 'center' }}>{displayMonthString}</span>
               <button onClick={nextMonth} disabled={isPresentMonth} style={{ background: 'none', border: 'none', color: isPresentMonth ? 'var(--border-color)' : 'var(--text-secondary)', cursor: isPresentMonth ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}><ChevronRight size={18} /></button>
            </div>
          </div>
          
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', padding: '2rem 0', textAlign: 'center' }}>Loading expenses...</div>
          ) : (
            <ExpenseTable expenses={currentMonthExpenses} onDelete={(id) => setExpenseToDelete(id)} onCopy={handleCopyExpense} />
          )}
        </div>
      </div>

      {/* Mic Button Component */}
      <VoiceInput onParsedExpense={handleAddExpense} onGraphRequest={handleGraphRequest} onAnswerRequest={handleQueryRequest} />
    </DashboardLayout>
  );
}
