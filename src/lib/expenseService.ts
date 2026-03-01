import { supabase } from './supabase';
import { Expense } from '@/types/expense';

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addExpense(expense: { amount: number, date: string, category: string, item: string }): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: user.id,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          item: expense.item
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteExpense(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Add user check for extra security

    if (error) throw error;
  }
};
