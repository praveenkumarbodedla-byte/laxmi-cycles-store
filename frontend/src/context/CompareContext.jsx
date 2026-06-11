import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext(null);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (cycle) => {
    if (compareList.length >= 2) {
      toast.error('You can compare up to 2 cycles only');
      return;
    }
    if (compareList.find((c) => c._id === cycle._id)) {
      toast('Already in compare list', { icon: 'ℹ️' });
      return;
    }
    setCompareList((prev) => [...prev, cycle]);
    toast.success(`${cycle.name} added to compare`);
  };

  const removeFromCompare = (cycleId) => {
    setCompareList((prev) => prev.filter((c) => c._id !== cycleId));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (cycleId) => compareList.some((c) => c._id === cycleId);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
