// Estado global dos empréstimos, gerenciado com useReducer.
// feedback: { type: 'success' | 'error', message: string } | null

export const ActionTypes = {
  LOANS_LOADED: 'LOANS_LOADED',
  LOANS_FAILED: 'LOANS_FAILED',
  SHOW_FEEDBACK: 'SHOW_FEEDBACK',
  CLEAR_FEEDBACK: 'CLEAR_FEEDBACK',
};

export const initialState = {
  loans: [],
  loading: true,
  feedback: null,
};

export function loansReducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOANS_LOADED:
      return { ...state, loans: action.payload, loading: false };

    case ActionTypes.LOANS_FAILED:
      return {
        ...state,
        loading: false,
        feedback: { type: 'error', message: action.payload },
      };

    case ActionTypes.SHOW_FEEDBACK:
      return { ...state, feedback: action.payload };

    case ActionTypes.CLEAR_FEEDBACK:
      return { ...state, feedback: null };

    default:
      return state;
  }
}
