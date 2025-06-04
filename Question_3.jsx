import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

const ListItem = React.memo(({ index, style, data }) => {
  const item = data.items[index];
  const {
    onEditStart,
    onEditCancel,
    onEditSave,
    onDelete,
    onSelect,
    selectedId,
    editingId,
    editName,
    setEditName,
  } = data;

  const isSelected = selectedId === item.id;
  const isEditing = editingId === item.id;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onEditSave(item.id);
    if (e.key === 'Escape') onEditCancel();
  };

  return (
    <div
      style={style}
      className={`flex flex-row-reverse items-center justify-between px-4 py-2 border-b text-sm ${
        isSelected ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
      } transition-colors`}
    >
      <div className="flex flex-col text-right w-full">
        {isEditing ? (
          <input
            className="border p-1 rounded text-sm w-full"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <>
            <span className="font-semibold">{item.name}</span>
            <span className="text-gray-500">ערך: {item.value}</span>
          </>
        )}
      </div>

      <div className="flex gap-2 mr-4">
        <button
          onClick={() => onSelect(item.id)}
          className={`p-1 rounded-full ${
            isSelected ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
          }`}
          title="בחר"
        >
          <CheckCircle size={18} />
        </button>
        {!isEditing && (
          <button
            onClick={() => onEditStart(item.id, item.name)}
            className="p-1 text-blue-500 hover:text-blue-700 rounded-full"
            title="ערוך"
          >
            <Pencil size={18} />
          </button>
        )}
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 text-red-500 hover:text-red-700 rounded-full"
          title="מחק"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
});

const MyOptimizedList = () => {
  const initialItems = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `פריט מספר ${i}`,
        value: Math.random().toFixed(2),
      })),
    []
  );

  const [dataItems, setDataItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const handleSelect = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleEditStart = useCallback((id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditName('');
  }, []);

  const handleEditSave = useCallback(
    (id) => {
      setDataItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, name: editName } : item
        )
      );
      setEditingId(null);
      setEditName('');
    },
    [editName]
  );

  const handleDelete = useCallback(
    (id) => {
      setDataItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedId === id) setSelectedId(null);
      if (editingId === id) {
        setEditingId(null);
        setEditName('');
      }
    },
    [selectedId, editingId]
  );

  const handleClearFilter = useCallback(() => {
    setInputValue('');
  }, []);

  const filteredItems = useMemo(() => {
    console.log('Filtering items based on:', searchQuery);
    if (!searchQuery) {
      return dataItems;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return dataItems.filter((item) =>
      item.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [dataItems, searchQuery]);

  const itemData = useMemo(
    () => ({
      items: filteredItems,
      onEditStart: handleEditStart,
      onEditCancel: handleEditCancel,
      onEditSave: handleEditSave,
      onDelete: handleDelete,
      onSelect: handleSelect,
      selectedId,
      editingId,
      editName,
      setEditName,
    }),
    [
      filteredItems,
      handleEditStart,
      handleEditCancel,
      handleEditSave,
      handleDelete,
      handleSelect,
      selectedId,
      editingId,
      editName,
    ]
  );

  return (
    <div dir="rtl" className="p-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          רשימה של {filteredItems.length} פריטים (מתוך {dataItems.length})
        </h2>

        <div className="relative flex items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="חפש פריט לפי שם..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
          {inputValue && (
            <button
              onClick={handleClearFilter}
              className="absolute left-2 text-gray-500 hover:text-red-500 p-1 rounded-full transition-colors"
              title="נקה פילטר"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg shadow border overflow-hidden">
        <List
          height={600}
          itemCount={filteredItems.length}
          itemSize={60}
          width="100%"
          itemData={itemData}
        >
          {ListItem}
        </List>
      </div>

      {selectedId !== null && (
        <div className="mt-4 text-green-600 text-sm">
          פריט נבחר: {selectedId}
        </div>
      )}
    </div>
  );
};

export default MyOptimizedList;
