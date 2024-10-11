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
  UseGuards,
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
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/auth/auth.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createRecipeSchema))
  create(
    @Body() recipe: CreateRecipeSchema,
    @UserId() userId: string,
  ): Promise<ReadRecipeDto> {
    return this.recipesService.create(recipe, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@UserId() userId: string): Promise<ReadRecipeDto[]> {
    return this.recipesService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Param('id') id: string,
    @UserId() userId: string,
  ): Promise<ReadRecipeDto> {
    return this.recipesService.findOne(id, userId).then((recipe) => {
      if (!recipe) {
        throw new NotFoundException();
      }
      return recipe;
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @UsePipes(
    new ZodValidationPipe(updateRecipeSchema, { id: z.string().uuid() }),
  )
  update(
    @Param('id') id: string,
    @Body() recipe: UpdateRecipeSchema,

    @UserId() userId: string,
  ): Promise<void> {
    return this.recipesService.update(id, recipe, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(
    @Param('id') id: string,

    @UserId() userId: string,
  ): Promise<void> {
    return this.recipesService.remove(id, userId);
  }
}
