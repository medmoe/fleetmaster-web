// src/pages/DeletionConfirmation.js
import { useLocation } from 'react-router-dom';

export function DeletionConfirmation() {
  // Extract confirmation code from URL query params
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const code = params.get('code');

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Deletion Complete</h1>
      <p>Your account and associated data have been deleted.</p>
      {code && <p className="mt-2">Confirmation code: <strong>{code}</strong></p>}
    </div>
  );
}

export default DeletionConfirmation;