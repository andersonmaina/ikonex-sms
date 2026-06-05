import React, { useState } from 'react';

interface CreateStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; code: string; capacity: number }) => void;
  isLoading: boolean;
}

export const CreateStreamModal: React.FC<CreateStreamModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [capacity, setCapacity] = useState('40');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, code, capacity: parseInt(capacity) || 40 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-on-surface/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">Create New Stream</h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error-container/20">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-lg space-y-md">
          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Stream Name</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Form 1A" 
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            />
          </div>
          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Unique Code</label>
            <input 
              required
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. f1-a" 
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            />
          </div>
          <div>
            <label className="block text-label-md font-bold text-on-surface-variant mb-1">Capacity</label>
            <input 
              required
              type="number" 
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            />
          </div>
          
          <div className="pt-md mt-lg border-t border-outline-variant flex justify-end gap-sm">
            <button 
              type="button" 
              onClick={onClose}
              className="px-lg py-2 rounded-lg font-label-md text-primary hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-lg py-2 rounded-lg font-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {isLoading && <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>}
              Create Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
