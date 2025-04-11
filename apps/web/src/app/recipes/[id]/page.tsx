import { getRecipe } from "@/lib/api";
import { ReadRecipeDto } from "@yara/api/recipe";
import { ChevronLeft, Pencil } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecipeOverview from "./RecipeOverview";
import { RecipePageData } from "./types";
import RecipeContent from "./RecipeContent";

const missingData: Omit<RecipePageData["recipe"], keyof ReadRecipeDto> = {
  totalTime: 60,
  prepTime: 20,
  cookTime: 40,
  servings: 4,
  difficulty: 3,
  calories: 420,
  keyIngredients: [
    { id: "123443121234-4312-1234-4312-12344321", name: "Beef mince" },
  ],
  equipment: ["Frying pan"],
  dietaryLabels: [
    { label: "Flexitarian", status: "okay" },
    { label: "May contain nuts", status: "warning" },
  ],
};

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const accessToken = (await cookies()).get("accessToken")!;
  const recipe = {
    ...(await getRecipe(accessToken.value, id)),
    ...missingData,
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="relative h-[40vh] min-h-[400px] bg-black">
        <Image
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.name}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <Button
              variant="ghost"
              className="mb-4 text-white hover:text-white/80"
              asChild
            >
              <Link href="/recipes">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Recipes
              </Link>
            </Button>
            <div className="absolute right-6 top-6">
              <Button
                variant="default"
                className="bg-orange-500 hover:bg-orange-600"
                asChild
              >
                <Link href={`/recipes/${id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Recipe
                </Link>
              </Button>
            </div>
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
              {recipe.name}
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Recipe Overview - At a Glance Section */}
        <div className="mb-8">
          <RecipeOverview recipe={recipe} />
        </div>

        {/* Main Content */}
        <RecipeContent recipe={recipe} />
      </div>
    </div>
  );
}
