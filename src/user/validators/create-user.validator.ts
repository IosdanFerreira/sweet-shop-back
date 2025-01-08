import { CreateUserDto } from '../dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

export interface CreateUserStrategy {
  validate(createUserDto: any): void;
}

export class FirstNameValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    if (!createUserDto.first_name) {
      throw new BadRequestException('first_name é obrigatório');
    }

    if (typeof createUserDto.first_name !== 'string') {
      throw new BadRequestException('first_name deve ser do tipo string');
    }

    const isValidNameRegex = /^[A-Z][a-zA-Z]{2,}$/;

    if (!isValidNameRegex.test(createUserDto.first_name)) {
      throw new BadRequestException(
        'first_name deve ter pelo menos 2 caracteres',
      );
    }
  }
}

export class LastNameValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    if (!createUserDto.last_name) {
      throw new BadRequestException('last_name é obrigatório');
    }

    if (typeof createUserDto.last_name !== 'string') {
      throw new BadRequestException('last_name deve ser do tipo string');
    }

    const isValidNameRegex = /^[A-Z][a-zA-Z]{2,}$/;

    if (!isValidNameRegex.test(createUserDto.last_name)) {
      throw new BadRequestException(
        'last_name deve ter pelo menos 2 caracteres',
      );
    }
  }
}

export class EmailValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    if (!createUserDto.email) {
      throw new BadRequestException('Email é obrigatório');
    }
    const validateEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!validateEmailRegex.test(createUserDto.email)) {
      throw new Error('Email inválido');
    }
  }
}

export class PasswordValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    if (!createUserDto.password) {
      throw new BadRequestException('Senha é obrigatória');
    }
    const isValidPassword =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!isValidPassword.test(createUserDto.password)) {
      throw new BadRequestException(
        'A senha deve conter ao menos 8 caracteres, uma letra maiúscula, um número e um carácter especial',
      );
    }
  }
}

export class CreateUserValidator {
  strategies: CreateUserStrategy[] = [];

  constructor() {
    this.strategies = [
      new FirstNameValidation(),
      new LastNameValidation(),
      new EmailValidation(),
      new PasswordValidation(),
    ];
  }
  validate(createUserDto: CreateUserDto): void {
    this.strategies.forEach((strategy) => strategy.validate(createUserDto));
  }
}

export class CreateUserValidatorFactory {
  static create(): CreateUserValidator {
    return new CreateUserValidator();
  }
}
