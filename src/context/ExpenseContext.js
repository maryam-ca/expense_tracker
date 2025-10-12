import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ExpenseContext = createContext();

// Action Types
const ACTION_TYPES = {
  SET_EXPENSES: 'SET_EXPENSES',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  CLEAR_EXPENSES: 'CLEAR_EXPENSES',
  SET_GOALS: 'SET_GOALS',
  ADD_GOAL: 'ADD_GOAL',
  DELETE_GOAL: 'DELETE_GOAL',
  SET_BUDGET: 'SET_BUDGET',
  SET_CURRENCY: 'SET_CURRENCY'
};

// Reducer
const expenseReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_EXPENSES:
      return { ...state, expenses: action.payload };
    
    case ACTION_TYPES.ADD_EXPENSE:
      return { ...state, expenses: [action.payload, ...state.expenses] };
    
    case ACTION_TYPES.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(exp => 
          exp.id === action.payload.id ? action.payload : exp
        )
      };
    
    case ACTION_TYPES.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    
    case ACTION_TYPES.CLEAR_EXPENSES:
      return { ...state, expenses: [] };
    
    case ACTION_TYPES.SET_GOALS:
      return { ...state, goals: action.payload };
    
    case ACTION_TYPES.ADD_GOAL:
      return { ...state, goals: [action.payload, ...state.goals] };
    
    case ACTION_TYPES.DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload)
      };
    
    case ACTION_TYPES.SET_BUDGET:
      return { ...state, budget: action.payload };
    
    case ACTION_TYPES.SET_CURRENCY:
      return { ...state, currency: action.payload };
    
    default:
      return state;
  }
};

const initialState = {
  expenses: [],
  goals: [],
  budget: 5000,
  currency: '₹',
  categories: [
    { value: 'food', label: '🍕 Food', color: '#48bb78', icon: '🍕' },
    { value: 'transport', label: '🚗 Transport', color: '#4299e1', icon: '🚗' },
    { value: 'shopping', label: '🛍️ Shopping', color: '#ed8936', icon: '🛍️' },
    { value: 'entertainment', label: '🎬 Entertainment', color: '#9f7aea', icon: '🎬' },
    { value: 'bills', label: '📄 Bills', color: '#ecc94b', icon: '📄' },
    { value: 'health', label: '🏥 Health', color: '#fc8181', icon: '🏥' },
    { value: 'education', label: '📚 Education', color: '#38b2ac', icon: '📚' },
    { value: 'travel', label: '✈️ Travel', color: '#ed64a6', icon: '✈️' },
    { value: 'grocery', label: '🛒 Grocery', color: '#68d391', icon: '🛒' },
    { value: 'investment', label: '📈 Investment', color: '#81e6d9', icon: '📈' },
    { value: 'other', label: '📦 Other', color: '#a0aec0', icon: '📦' }
  ],
  currencies: [
    { symbol: '₹', name: 'Indian Rupee' },
    { symbol: '$', name: 'US Dollar' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'British Pound' },
    { symbol: '¥', name: 'Japanese Yen' }
  ]
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedGoals = localStorage.getItem('goals');
    const savedBudget = localStorage.getItem('budget');
    const savedCurrency = localStorage.getItem('currency');
    
    if (savedExpenses) {
      dispatch({ type: ACTION_TYPES.SET_EXPENSES, payload: JSON.parse(savedExpenses) });
    }
    if (savedGoals) {
      dispatch({ type: ACTION_TYPES.SET_GOALS, payload: JSON.parse(savedGoals) });
    }
    if (savedBudget) {
      dispatch({ type: ACTION_TYPES.SET_BUDGET, payload: parseFloat(savedBudget) });
    }
    if (savedCurrency) {
      dispatch({ type: ACTION_TYPES.SET_CURRENCY, payload: savedCurrency });
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(state.expenses));
    localStorage.setItem('goals', JSON.stringify(state.goals));
    localStorage.setItem('budget', JSON.stringify(state.budget));
    localStorage.setItem('currency', state.currency);
  }, [state.expenses, state.goals, state.budget, state.currency]);

  // Actions
  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: ACTION_TYPES.ADD_EXPENSE, payload: newExpense });
  };

  const updateExpense = (expense) => {
    dispatch({ type: ACTION_TYPES.UPDATE_EXPENSE, payload: expense });
  };

  const deleteExpense = (id) => {
    dispatch({ type: ACTION_TYPES.DELETE_EXPENSE, payload: id });
  };

  const clearExpenses = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_EXPENSES });
  };

  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      current: 0,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: ACTION_TYPES.ADD_GOAL, payload: newGoal });
  };

  const deleteGoal = (id) => {
    dispatch({ type: ACTION_TYPES.DELETE_GOAL, payload: id });
  };

  const setBudget = (budget) => {
    dispatch({ type: ACTION_TYPES.SET_BUDGET, payload: budget });
  };

  const setCurrency = (currency) => {
    dispatch({ type: ACTION_TYPES.SET_CURRENCY, payload: currency });
  };

  const value = {
    // State
    ...state,
    
    // Expense Actions
    addExpense,
    updateExpense,
    deleteExpense,
    clearExpenses,
    
    // Goal Actions
    addGoal,
    deleteGoal,
    
    // Settings Actions
    setBudget,
    setCurrency
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
};