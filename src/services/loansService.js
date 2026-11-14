import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Os empréstimos ficam dentro do usuário logado: users/{uid}/loans
function loansCollection() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuário não autenticado');
  }
  return collection(db, 'users', user.uid, 'loans');
}

export async function addLoan({ itemType, itemName, borrowerName, amount, dueDate }) {
  const data = {
    itemType,
    itemName,
    borrowerName,
    amount: itemType === 'dinheiro' ? amount : null,
    dueDate: dueDate || null,
    returned: false,
    returnedAt: null,
    createdAt: new Date().toISOString(),
  };
  const ref = await addDoc(loansCollection(), data);
  return ref.id;
}

// Chama onChange com a lista atualizada. Devolve a função para parar de escutar.
export function subscribeLoans(onChange, onError) {
  const q = query(loansCollection(), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onChange(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

export async function markAsReturned(loanId) {
  await updateDoc(doc(loansCollection(), loanId), {
    returned: true,
    returnedAt: new Date().toISOString(),
  });
}

export async function removeLoan(loanId) {
  await deleteDoc(doc(loansCollection(), loanId));
}