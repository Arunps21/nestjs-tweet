import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  public async create(createRoleDto: CreateRoleDto) {
    const { role } = createRoleDto;
    const extRole = await this.roleRepository.findOne({
      where: { role: ILike(role) },
    });
    if (extRole) {
      throw new ConflictException('Role already exists');
    }
    const newRole = this.roleRepository.create({ role: role.toLowerCase() });
    await this.roleRepository.save(newRole);
    return {
      message: 'Role created successfully',
      role: newRole,
    };
  }

  findAll() {
    return this.roleRepository.find({ where: {} });
  }

  async update(role: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(role, updateRoleDto);
    return {
      message: 'Role updated successfully',
      role: await this.roleRepository.findOne({ where: { role } }),
    };
  }

  async remove(id: number) {
    await this.roleRepository.delete(id);
    return {
      message: 'Role deleted successfully',
      role: await this.roleRepository.find(),
    };
  }
}
