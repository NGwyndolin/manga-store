import { useState } from 'preact/hooks';

interface EventButtonProps {
  initialParticipants: number;
  maxParticipants: number | null;
}

export default function EventButton({ initialParticipants, maxParticipants }: EventButtonProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [participants, setParticipants] = useState(initialParticipants);

  const handleToggle = () => {
    if (isRegistered) {
      // Desapuntarse
      setIsRegistered(false);
      setParticipants(prev => prev - 1);
    } else {
      // Apuntarse
      setIsRegistered(true);
      setParticipants(prev => prev + 1);
    }
  };

  return (
    <div class="flex flex-col items-end gap-2">
      <button 
        onClick={handleToggle}
        class={`py-3 px-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
          isRegistered 
            ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
            : 'bg-secondary-500 hover:bg-secondary-600 text-white border-2 border-transparent'
        }`}
      >
        {isRegistered ? (
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            ¡Apuntado!
          </span>
        ) : (
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Apuntarme
          </span>
        )}
      </button>
      
      {/* Mostrar participantes actualizados */}
      <span class="text-xs text-dark-600 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {participants} {maxParticipants ? `/ ${maxParticipants}` : ''} participantes
      </span>
    </div>
  );
}
