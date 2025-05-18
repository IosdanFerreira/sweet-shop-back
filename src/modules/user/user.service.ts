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

  /**
   * Updates a user by their ID and returns a formatted response.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data to update the user with.
   * @returns A promise with the formatted response indicating success.
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<IDefaultResponse<UserEntity>> {
    // Retrieve the user to ensure they exist
    await this._get(id);

    // Check if there is any data to update
    if (Object.keys(updateUserDto).length === 0) {
      // If no data is provided, throw an error
      throw new BadRequestError('Erro ao atualizar dados do usuário', [
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    // Update the user
    const updatedUser = await this.userRepository.update(id, updateUserDto);

    // Format the response
    const formattedUser = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Dados do usuário atualizado',
      data: updatedUser,
      pagination: null,
    };

    // Return the formatted response
    return formattedUser;
  }

  /**
   * Deletes a user by their ID and returns a formatted response.
   * @param id - The ID of the user to delete.
   * @returns A promise with the formatted response indicating success.
   */
  async deleteUser(id: number): Promise<IDefaultResponse<null>> {
    // Retrieve the user to ensure they exist
    await this._get(id);

    // Remove the user from the repository
    await this.userRepository.remove(id);

    // Format the successful deletion response
    const formattedResponse = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário excluído com sucesso',
      data: null,
      pagination: null,
    };

    // Return the formatted response
    return formattedResponse;
  }

  /**
   * Method to get a user by id, and returns the formatted response.
   * @param id The id of the user to get.
   * @returns The formatted response with the user entity.
   */
  protected async _get(id: number): Promise<IDefaultResponse<UserEntity>> {
    /**
     * Try to find the user in the database.
     */
    const foundedUser = await this.userRepository.findById(id);

    if (!foundedUser) {
      /**
       * If the user is not found, throw a NotFoundError.
       */
      throw new NotFoundError('Erro ao buscar usuário', [
        {
          property: null,
          message: 'Usuário não encontrado',
        },
      ]);
    }

    /**
     * Format the response with the user entity.
     */
    const formattedUser: IDefaultResponse<UserEntity> = {
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
