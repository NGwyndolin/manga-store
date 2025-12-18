import type { ContactFormData, FormValidationResult } from '@/types';

/**
 * Valida si un email tiene formato correcto
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si un string no está vacío (después de trim)
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Valida la longitud mínima de un string
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Valida la longitud máxima de un string
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Valida un formulario de contacto completo
 */
export function validateContactForm(data: ContactFormData): FormValidationResult {
  const errors: FormValidationResult['errors'] = {};
  let isValid = true;

  // Validar nombre
  if (!isNotEmpty(data.name)) {
    errors.name = 'El nombre es obligatorio';
    isValid = false;
  } else if (!hasMinLength(data.name, 2)) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (!hasMaxLength(data.name, 50)) {
    errors.name = 'El nombre no puede exceder 50 caracteres';
    isValid = false;
  }

  // Validar email
  if (!isNotEmpty(data.email)) {
    errors.email = 'El email es obligatorio';
    isValid = false;
  } else if (!isValidEmail(data.email)) {
    errors.email = 'El email no tiene un formato válido';
    isValid = false;
  }

  // Validar asunto
  if (!isNotEmpty(data.subject)) {
    errors.subject = 'El asunto es obligatorio';
    isValid = false;
  } else if (!hasMinLength(data.subject, 5)) {
    errors.subject = 'El asunto debe tener al menos 5 caracteres';
    isValid = false;
  } else if (!hasMaxLength(data.subject, 100)) {
    errors.subject = 'El asunto no puede exceder 100 caracteres';
    isValid = false;
  }

  // Validar mensaje
  if (!isNotEmpty(data.message)) {
    errors.message = 'El mensaje es obligatorio';
    isValid = false;
  } else if (!hasMinLength(data.message, 10)) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
    isValid = false;
  } else if (!hasMaxLength(data.message, 1000)) {
    errors.message = 'El mensaje no puede exceder 1000 caracteres';
    isValid = false;
  }

  return { isValid, errors };
}

/**
 * Sanitiza input de texto removiendo caracteres peligrosos
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
