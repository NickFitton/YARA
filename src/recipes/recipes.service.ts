import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
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

  create(createRecipeDto: CreateRecipeDto): Promise<ReadRecipeDto> {
    return this.prisma.recipe
      .create({ data: createToDbEntity(createRecipeDto), include })
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

  update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<void> {
    return this.prisma.recipe
      .update({
        where: { id },
        data: updateToDbEntity(updateRecipeDto),
      })
      .then();
  }

  async remove(id: string): Promise<void> {
    const newLocal = await this.prisma.recipe.delete({ where: { id } }).then();
    console.log(newLocal);
  }
}
