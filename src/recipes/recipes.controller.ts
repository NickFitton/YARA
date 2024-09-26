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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { ReadRecipeDto } from './dto/read-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto): Promise<ReadRecipeDto> {
    return this.recipesService.create(createRecipeDto);
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
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ): Promise<void> {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.recipesService.remove(id);
  }
}
