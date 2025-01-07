import { BadRequestError } from 'src/shared/errors/bad-request.error';
import { CreateUserDto } from '../dto/create-user.dto';

export interface CreateUserStrategy {
  validate(createUserDto: any): void;
}

export class FirstNameValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    if (!createUserDto.first_name) {
      throw new BadRequestError('First name is required');
    }

    if (typeof createUserDto.first_name !== 'string') {
      throw new BadRequestError('First name must be a string');
    }

    if (createUserDto.first_name.length < 2) {
      throw new BadRequestError('First name must be at least 2 characters');
    }
  }
}

export class LastNameValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    if (createUserDto.last_name.length < 2) {
      throw new Error('First name must be at least 2 characters');
    }
  }
}

export class EmailValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    const validateEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!validateEmailRegex.test(createUserDto.email)) {
      throw new Error('Email is invalid');
    }
  }
}

export class PasswordValidation implements CreateUserStrategy {
  validate(createUserDto: CreateUserDto): void {
    if (createUserDto.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
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
