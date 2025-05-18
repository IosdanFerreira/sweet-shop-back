import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { UserRepositoryInterface } from './interfaces/user.repository.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async getUserById(id: number): Promise<IDefaultResponse<UserEntity>> {
    return await this._get(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // Busca o usuário no banco pelo ID informado
    await this._get(id);

    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestError('Erro ao atualizar dados do usuário', [
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    // Atualiza os dados do usuário
    const updatedUser = await this.userRepository.update(id, updateUserDto);

    // Formata a resposta no formato padrão
    const formattedUser = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Dados do usuário atualizado',
      data: updatedUser,
      pagination: null,
    };

    return formattedUser;
  }

  async deleteUser(id: number): Promise<IDefaultResponse<null>> {
    // Busca o usuário no banco pelo ID informado
    await this._get(id);

    // Exclui o usuário
    await this.userRepository.remove(id);

    // Formata a resposta no formato padrão
    const formattedResponse = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário excluído',
      data: null,
      pagination: null,
    };

    return formattedResponse;
  }

  protected async _get(id: number): Promise<IDefaultResponse<UserEntity>> {
    // Busca o usuário no banco pelo ID informado
    const foundedUser = await this.userRepository.findById(id);

    // Se o usuário nao for encontrado, retorna um erro
    if (!foundedUser) {
      throw new NotFoundError('Erro ao buscar usuário', [
        {
          property: null,
          message: 'Usuário não encontrado',
        },
      ]);
    }

    // Formata a resposta no formato padrão
    const formattedUser = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário encontrado',
      data: foundedUser,
      pagination: null,
    };

    return formattedUser;
  }
}
