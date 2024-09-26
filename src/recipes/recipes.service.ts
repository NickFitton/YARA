import { Injectable } from '@nestjs/common';
import { CreateRecipeSchema } from './dto/create-recipe.dto';
import { UpdateRecipeSchema } from './dto/update-recipe.dto';
import { PrismaService } from '../services/prisma.service';
import {
  createFromDbEntity,
  createToDbEntity,
  updateToDbEntity,
} from './recipes.transformer';
import { ReadRecipeDto } from './dto/read-recipe.dto';

const include = {
  instructions: true,
  ingredients: true,
};
@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  create(recipe: CreateRecipeSchema): Promise<ReadRecipeDto> {
    return this.prisma.recipe
      .create({ data: createToDbEntity(recipe), include })
      .then(createFromDbEntity);
  }

  findAll(): Promise<ReadRecipeDto[]> {
    return this.prisma.recipe
      .findMany({ include })
      .then((results) => results.map(createFromDbEntity));
  }

  findOne(id: string): Promise<ReadRecipeDto | null> {
    return this.prisma.recipe
      .findFirst({ where: { id }, include })
      .then((result) => (result ? createFromDbEntity(result) : result));
  }

  update(id: string, recipe: UpdateRecipeSchema): Promise<void> {
    return this.prisma.recipe
      .update({
        where: { id },
        data: updateToDbEntity(recipe),
      })
      .then();
  }

  remove(id: string): Promise<void> {
    return this.prisma.recipe.delete({ where: { id } }).then();
  }
}
