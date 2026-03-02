'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Expense } from '@/types/expense';
import { Loader2, Sparkles } from 'lucide-react';
import { authFetch } from '@/lib/authFetch';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';

interface AIGraphsProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string; // If triggered by voice
  selectedMonth?: Date; // Month to show in default pie chart
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AIGraphs({ expenses, isOpen, onClose, initialPrompt = '', selectedMonth }: AIGraphsProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartConfig, setChartConfig] = useState<any>(null);

  // Reset chart when modal closes so it regenerates for the correct month on reopen
  useEffect(() => {
    if (!isOpen) {
      setChartConfig(null);
      setPrompt('');
      setError(null);
    }
  }, [isOpen]);

  // Set default generic chart if opened without a voice prompt
  useEffect(() => {
    if (isOpen && !initialPrompt && !chartConfig) {
      const viewMonth = selectedMonth || new Date();
      const monthName = viewMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
      setChartConfig({
        type: 'pie',
        title: `${monthName} by Category`,
        data: expenses
          .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === viewMonth.getMonth() && d.getFullYear() === viewMonth.getFullYear();
          })
          .reduce((acc: any[], exp) => {
            const existing = acc.find(item => item.name === exp.category);
            if (existing) {
              existing.value += Number(exp.amount);
            } else {
              acc.push({ name: exp.category, value: Number(exp.amount) });
            }
            return acc;
          }, [])
      });
    }
  }, [isOpen, initialPrompt, expenses, chartConfig, selectedMonth]);

  // If opened via voice prompt, auto-trigger the generation
  useEffect(() => {
    if (isOpen && initialPrompt) {
      setPrompt(initialPrompt);
      generateGraphFromPrompt(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  const generateGraphFromPrompt = async (searchQuery: string) => {
    if (!searchQuery.trim() || expenses.length === 0) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await authFetch('/api/generate-graph', {
        method: 'POST',
        body: JSON.stringify({ prompt: searchQuery, expenses })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate graph');
      }

      const rawConfig = await response.json();
      
      // Basic validation of AI output
      if (!['bar', 'pie', 'line'].includes(rawConfig.type) || !Array.isArray(rawConfig.data)) {
         throw new Error('AI returned an invalid graph format. Try rephrasing.');
      }

      setChartConfig(rawConfig);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartConfig?.data || chartConfig.data.length === 0) {
      return <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No data available for this query.</div>;
    }

    const { type, data } = chartConfig;

    return (
      <ResponsiveContainer width="100%" height={300}>
        {type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} width={40} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : type === 'pie' ? (
          <PieChart>
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} width={40} />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-secondary)', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} className="heading-gradient" />
          {chartConfig?.title || 'Expense Analytics'}
        </h2>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ width: '100%', height: '300px', flex: 1, minHeight: '300px' }}>
          {renderChart()}
        </div>
      )}
      
      {/* Legend for Pie Chart specifically */}
      {!loading && chartConfig?.type === 'pie' && chartConfig.data && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem', paddingTop: '1rem' }}>
          {chartConfig.data.map((entry: any, index: number) => (
            <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </Modal>
  );
}
