import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { markAsReturned, removeLoan, subscribeLoans } from '../services/loansService';
import { ActionTypes, initialState, loansReducer } from './loansReducer';

const LoansContext = createContext(null);

// Deve ficar dentro da área logada: a lista é a do usuário autenticado.
export function LoansProvider({ children }) {
  const [state, dispatch] = useReducer(loansReducer, initialState);

  useEffect(() => {
    const failed = () =>
      dispatch({
        type: ActionTypes.LOANS_FAILED,
        payload: 'Não foi possível carregar os empréstimos.',
      });

    try {
      // Atualiza a lista global sozinha sempre que algo muda no Firestore
      const unsubscribe = subscribeLoans(
        (list) => dispatch({ type: ActionTypes.LOANS_LOADED, payload: list }),
        failed
      );
      return unsubscribe;
    } catch (error) {
      failed();
      return undefined;
    }
  }, []);

  const showFeedback = useCallback(
    (type, message) =>
      dispatch({ type: ActionTypes.SHOW_FEEDBACK, payload: { type, message } }),
    []
  );

  const clearFeedback = useCallback(() => dispatch({ type: ActionTypes.CLEAR_FEEDBACK }), []);

  const returnLoan = useCallback(
    async (loan) => {
      try {
        await markAsReturned(loan.id);
        showFeedback('success', 'Marcado como devolvido.');
      } catch (error) {
        showFeedback('error', 'Não foi possível atualizar o empréstimo.');
      }
    },
    [showFeedback]
  );

  const deleteLoan = useCallback(
    async (loan) => {
      try {
        await removeLoan(loan.id);
        showFeedback('success', 'Empréstimo excluído.');
      } catch (error) {
        showFeedback('error', 'Não foi possível excluir o empréstimo.');
      }
    },
    [showFeedback]
  );

  const value = useMemo(
    () => ({
      loans: state.loans,
      loading: state.loading,
      feedback: state.feedback,
      returnLoan,
      deleteLoan,
      showFeedback,
      clearFeedback,
    }),
    [state, returnLoan, deleteLoan, showFeedback, clearFeedback]
  );

  return <LoansContext.Provider value={value}>{children}</LoansContext.Provider>;
}

export function useLoans() {
  const context = useContext(LoansContext);
  if (!context) {
    throw new Error('useLoans deve ser usado dentro de um <LoansProvider>.');
  }
  return context;
}
