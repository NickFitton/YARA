import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  CreateRecipeSchema,
  createRecipeSchema,
} from './dto/create-recipe.dto';
import {
  UpdateRecipeSchema,
  updateRecipeSchema,
} from './dto/update-recipe.dto';
import { ReadRecipeDto } from './dto/read-recipe.dto';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { z } from 'zod';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRecipeSchema))
  create(@Body() recipe: CreateRecipeSchema): Promise<ReadRecipeDto> {
    return this.recipesService.create(recipe);
  }

  @Get()
  findAll(): Promise<ReadRecipeDto[]> {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReadRecipeDto> {
    return this.recipesService.findOne(id).then((recipe) => {
      if (!recipe) {
        throw new NotFoundException();
      }
      return recipe;
    });
  }

  @Patch(':id')
  @HttpCode(204)
  @UsePipes(
    new ZodValidationPipe(updateRecipeSchema, { id: z.string().uuid() }),
  )
  update(
    @Param('id') id: string,
    @Body() recipe: UpdateRecipeSchema,
  ): Promise<void> {
    return this.recipesService.update(id, recipe);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.recipesService.remove(id);
  }
}
