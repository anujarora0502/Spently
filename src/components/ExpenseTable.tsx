import React from 'react';
import { Card } from './Card';
import { Expense } from '@/types/expense';
import { Trash2, CopyPlus } from 'lucide-react';

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete?: (id: string) => void;
  onCopy?: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onDelete, onCopy }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
          No expenses found for this month.
        </div>
      </Card>
    );
  }

  return (
    <Card className="mobile-p-4" style={{ paddingLeft: 0, paddingRight: 0, overflow: 'hidden' }}>
      <div className="mobile-table-container" style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 500, fontSize: '0.875rem' }}>Date</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 500, fontSize: '0.875rem' }}>Item</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 500, fontSize: '0.875rem' }}>Category</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: 500, fontSize: '0.875rem', textAlign: 'right' }}>Amount</th>
              {(onDelete || onCopy) && <th style={{ padding: '1.25rem 1rem', fontWeight: 500, fontSize: '0.875rem', width: '80px', textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr 
                key={expense.id} 
                className="expense-row"
                style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}
              >
                <td style={{ padding: '1rem', whiteSpace: 'nowrap', fontSize: '0.95rem' }}>
                  {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{expense.item}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    padding: '4px 12px', 
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)'
                  }}>
                    {expense.category}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--success)' }}>
                  ₹{Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {(onDelete || onCopy) && (
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {onCopy && (
                        <button
                          onClick={() => onCopy(expense)}
                          className="copy-btn"
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--text-secondary)', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px'
                          }}
                          title="Copy to today"
                        >
                          <CopyPlus size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="delete-btn"
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--text-secondary)', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px'
                          }}
                          title="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .expense-row:hover { background: rgba(255, 255, 255, 0.03); }
        .expense-row:last-child { border-bottom: none !important; }
        .delete-btn:hover { color: var(--danger) !important; }
        .copy-btn:hover { color: var(--success) !important; }
      `}} />
    </Card>
  );
}
