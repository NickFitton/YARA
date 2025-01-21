import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import {
  createFromDbEntity,
  createToDbEntity,
  updateToDbEntity,
} from './recipes.transformer';
import {
  ReadRecipeDto,
  CreateRecipeDto,
  UpdateRecipeDto,
} from '@yara/api/recipe';

const include = {
  instructions: true,
  ingredients: true,
};
@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  create(recipe: CreateRecipeDto, userId: string): Promise<ReadRecipeDto> {
    return this.prisma.recipe
      .create({ data: createToDbEntity(recipe, userId), include })
      .then(createFromDbEntity);
  }

  findAll(userId: string): Promise<ReadRecipeDto[]> {
    return this.prisma.recipe
      .findMany({ include, where: { owner: { id: userId } } })
      .then((results) => results.map(createFromDbEntity));
  }

  findOne(id: string, userId: string): Promise<ReadRecipeDto | null> {
    return this.prisma.recipe
      .findFirst({ include, where: { id, owner: { id: userId } } })
      .then((result) => (result ? createFromDbEntity(result) : result));
  }

  update(id: string, recipe: UpdateRecipeDto, userId: string): Promise<void> {
    return this.prisma.recipe
      .update({
        where: { id, owner: { id: userId } },
        data: updateToDbEntity(recipe),
      })
      .then();
  }

  remove(id: string, userId: string): Promise<void> {
    return this.prisma.recipe
      .delete({ where: { id, owner: { id: userId } } })
      .then();
  }
}
