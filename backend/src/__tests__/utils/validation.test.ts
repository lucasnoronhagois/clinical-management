import { validateCPF, validateEmail, validatePhone } from '../../utils';

describe('Validation Utils', () => {
  describe('validateCPF', () => {
    it('deve validar CPF válido', () => {
      // Arrange
      const validCPFs = [
        '123.456.789-09',
        '111.444.777-35'
      ];

      // Act & Assert
      validCPFs.forEach(cpf => {
        expect(validateCPF(cpf)).toBe(true);
      });
    });

    it('deve rejeitar CPF inválido', () => {
      // Arrange
      const invalidCPFs = [
        '123.456.789-10',
        '111.111.111-11',
        '000.000.000-00',
        '123.456.789-0',
        'abc.def.ghi-jk',
        '',
        '1234567890'
      ];

      // Act & Assert
      invalidCPFs.forEach(cpf => {
        expect(validateCPF(cpf)).toBe(false);
      });
    });

    it('deve aceitar CPF com ou sem formatação', () => {
      // Arrange
      const cpfWithFormat = '123.456.789-09';
      const cpfWithoutFormat = '12345678909';

      // Act & Assert
      expect(validateCPF(cpfWithFormat)).toBe(true);
      expect(validateCPF(cpfWithoutFormat)).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('deve validar emails válidos', () => {
      // Arrange
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      // Act & Assert
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('deve rejeitar emails inválidos', () => {
      // Arrange
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user@example..com',
        '',
        'user name@example.com'
      ];

      // Act & Assert
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePhone', () => {
    it('deve validar telefones válidos', () => {
      // Arrange
      const validPhones = [
        '(11) 99999-9999',
        '(11) 9999-9999',
        '11999999999',
        '1199999999'
      ];

      // Act & Assert
      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });
    });

    it('deve rejeitar telefones muito curtos', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });

    it('deve rejeitar telefones muito longos', () => {
      expect(validatePhone('999999999999999')).toBe(false);
    });

    it('deve rejeitar telefones com DDD inválido', () => {
      expect(validatePhone('(00) 99999-9999')).toBe(false);
      expect(validatePhone('(20) 99999-9999')).toBe(false); // DDD 20 não existe
      expect(validatePhone('(30) 99999-9999')).toBe(false); // DDD 30 não existe
    });

    it('deve rejeitar telefones com formato inválido', () => {
      expect(validatePhone('abc-def-ghij')).toBe(false);
    });

    it('deve aceitar telefone com ou sem formatação', () => {
      // Arrange
      const phoneWithFormat = '(11) 99999-9999';
      const phoneWithoutFormat = '11999999999';

      // Act & Assert
      expect(validatePhone(phoneWithFormat)).toBe(true);
      expect(validatePhone(phoneWithoutFormat)).toBe(true);
    });
  });
});
