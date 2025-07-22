// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }
}
