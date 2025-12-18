import { useState } from 'preact/hooks';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setStatus('sending');

    // Simulación de envío (aquí integrarías con tu backend o servicio de email)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {/* Nombre */}
      <div>
        <label for="name" class="form-label">
          Nombre completo *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onInput={handleChange}
          required
          class="form-input"
          placeholder="Tu nombre"
        />
      </div>

      {/* Email */}
      <div>
        <label for="email" class="form-label">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onInput={handleChange}
          required
          class="form-input"
          placeholder="tu@email.com"
        />
      </div>

      {/* Asunto */}
      <div>
        <label for="subject" class="form-label">
          Asunto *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onInput={handleChange}
          required
          class="form-input"
          placeholder="¿En qué podemos ayudarte?"
        />
      </div>

      {/* Mensaje */}
      <div>
        <label for="message" class="form-label">
          Mensaje *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onInput={handleChange}
          required
          rows={6}
          class="form-input resize-none"
          placeholder="Cuéntanos más sobre tu consulta..."
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={status === 'sending'}
        class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? (
          <span class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        ) : (
          'Enviar Mensaje'
        )}
      </button>

      {/* Mensajes de estado */}
      {status === 'success' && (
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <p class="font-semibold">✓ Mensaje enviado correctamente</p>
          <p class="text-sm">Te responderemos lo antes posible.</p>
        </div>
      )}

      {status === 'error' && (
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p class="font-semibold">✗ Error al enviar el mensaje</p>
          <p class="text-sm">Por favor, inténtalo de nuevo o contáctanos directamente por email.</p>
        </div>
      )}
    </form>
  );
}
