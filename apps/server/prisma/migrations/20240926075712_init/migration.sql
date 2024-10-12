-- CreateTable
CREATE TABLE "Recipe" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "quantity" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeInstruction" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "step" TEXT NOT NULL,

    CONSTRAINT "RecipeInstruction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeInstruction" ADD CONSTRAINT "RecipeInstruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
