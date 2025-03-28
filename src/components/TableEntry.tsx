// src/components/TableEntry.tsx
import React from 'react';

interface TableEntryProps {
  name: string;
  numeric: string | number;
  status: boolean | string;
  note: string;
  containerStyles?: string;
  textStyles?: string;
}

const TableEntry: React.FC<TableEntryProps> = ({
  name,
  numeric,
  status,
  note,
  containerStyles = '',
  textStyles = ''
}) => {
  const isStatusBoolean = typeof status === 'boolean';

  return (
    <div className={`flex items-center justify-between py-3 border-b ${containerStyles}`}>
      <div className={`w-1/4 ${textStyles}`}>{name}</div>
      <div className={`w-1/4 text-center ${textStyles}`}>{numeric}</div>
      <div className={`w-1/4 flex justify-center ${textStyles}`}>
        {isStatusBoolean ? (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {status ? 'Active' : 'Inactive'}
          </span>
        ) : (
          <span>{status}</span>
        )}
      </div>
      <div className={`w-1/4 text-right ${textStyles}`}>{note}</div>
    </div>
  );
};

export default TableEntry;