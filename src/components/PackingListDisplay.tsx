import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { PackingCategory, PackingItem } from '../types';
import { 
  FileText, 
  ShoppingBag, 
  Smartphone, 
  Droplets, 
  Pill, 
  Briefcase, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Download,
  Printer
} from 'lucide-react';

// Component for individual packing item
const PackingItemComponent: React.FC<{
  item: PackingItem;
  onToggle: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
}> = ({ item, onToggle, onRemove }) => {
  return (
    <div className={`flex items-center py-2 border-b border-gray-100 group ${item.checked ? 'text-gray-400' : ''}`}>
      <button 
        onClick={() => onToggle(item.id, !item.checked)}
        className="mr-2 text-gray-500 hover:text-primary-600 focus:outline-none"
      >
        {item.checked ? (
          <CheckSquare size={18} className="text-primary-500" />
        ) : (
          <Square size={18} />
        )}
      </button>
      
      <div className={`flex-grow ${item.checked ? 'line-through' : ''}`}>
        <span className="font-medium">{item.name}</span>
        {item.quantity > 1 && (
          <span className="text-sm text-gray-500 ml-2">×{item.quantity}</span>
        )}
        {item.essential && (
          <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">
            Essential
          </span>
        )}
      </div>
      
      <button 
        onClick={() => onRemove(item.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-error-500 focus:outline-none transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const PackingListDisplay: React.FC = () => {
  const { packingList, updatePackingItem, addCustomItem, removeItem } = useTrip();
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingCategory>('clothing');
  const [addingItem, setAddingItem] = useState(false);

  if (!packingList) return null;

  const handleToggleItem = (itemId: string, checked: boolean) => {
    updatePackingItem(itemId, { checked });
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addCustomItem(newItemName.trim(), newItemCategory);
      setNewItemName('');
      setAddingItem(false);
    }
  };

  const getCategoryIcon = (category: PackingCategory) => {
    switch (category) {
      case 'documents':
        return <FileText size={18} className="text-accent-600" />;
      case 'clothing':
        return <ShoppingBag size={18} className="text-primary-600" />;
      case 'electronics':
        return <Smartphone size={18} className="text-secondary-600" />;
      case 'toiletries':
        return <Droplets size={18} className="text-blue-600" />;
      case 'medicine':
        return <Pill size={18} className="text-error-600" />;
      case 'accessories':
      case 'activity':
      default:
        return <Briefcase size={18} className="text-gray-600" />;
    }
  };

  const getCategoryTitle = (category: PackingCategory): string => {
    switch (category) {
      case 'documents':
        return 'Documents & ID';
      case 'clothing':
        return 'Clothing & Footwear';
      case 'electronics':
        return 'Electronics & Gadgets';
      case 'toiletries':
        return 'Toiletries & Personal Care';
      case 'medicine':
        return 'Medications & First Aid';
      case 'accessories':
        return 'Accessories';
      case 'activity':
        return 'Activity-specific Items';
      default:
        return 'Other Items';
    }
  };

  // Group items by category
  const itemsByCategory = packingList.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<PackingCategory, PackingItem[]>);

  // Calculate completion percentage
  const totalItems = packingList.items.length;
  const checkedItems = packingList.items.filter(item => item.checked).length;
  const completionPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const categoryOptions: { value: PackingCategory; label: string }[] = [
    { value: 'clothing', label: 'Clothing & Footwear' },
    { value: 'toiletries', label: 'Toiletries & Personal Care' },
    { value: 'electronics', label: 'Electronics & Gadgets' },
    { value: 'documents', label: 'Documents & ID' },
    { value: 'medicine', label: 'Medications & First Aid' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'activity', label: 'Activity-specific Items' },
  ];

  const handleExportList = () => {
    // In a real application, this would generate a PDF or CSV
    alert('This feature would export your packing list to PDF or CSV in a real application.');
  };

  const handlePrintList = () => {
    window.print();
  };

  return (
    <div>
      {/* Progress bar and actions */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-700">
            Packing progress: {checkedItems}/{totalItems} items
          </div>
          <div className="text-lg font-semibold text-primary-700">
            {completionPercentage}%
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleExportList}
          className="btn-outline text-sm flex items-center gap-1"
        >
          <Download size={16} />
          Export
        </button>
        
        <button
          onClick={handlePrintList}
          className="btn-outline text-sm flex items-center gap-1"
        >
          <Printer size={16} />
          Print
        </button>
      </div>

      {/* Items by category */}
      <div className="space-y-6">
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className="animate-fade-in">
            <h3 className="flex items-center gap-2 text-md font-medium mb-3 pb-1 border-b border-gray-200">
              {getCategoryIcon(category as PackingCategory)}
              {getCategoryTitle(category as PackingCategory)}
              <span className="text-sm text-gray-500 font-normal ml-auto">
                {items.filter(i => i.checked).length}/{items.length}
              </span>
            </h3>
            
            <div className="pl-1">
              {items.map(item => (
                <PackingItemComponent
                  key={item.id}
                  item={item}
                  onToggle={handleToggleItem}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add custom item */}
      {addingItem ? (
        <div className="mt-6 p-4 border border-gray-200 rounded-md animate-slide-up bg-gray-50">
          <h3 className="text-md font-medium mb-3">Add Custom Item</h3>
          
          <div className="space-y-3">
            <div>
              <label className="form-label">Item Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., Sunglasses"
                className="input-field"
                autoFocus
              />
            </div>
            
            <div>
              <label className="form-label">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as PackingCategory)}
                className="input-field"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="btn-primary text-sm flex-1"
                disabled={!newItemName.trim()}
              >
                Add Item
              </button>
              
              <button
                onClick={() => setAddingItem(false)}
                className="btn-outline text-sm flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingItem(true)}
          className="mt-6 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <Plus size={18} />
          Add Custom Item
        </button>
      )}
    </div>
  );
};

export default PackingListDisplay;