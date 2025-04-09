import { getRecipe } from "@/lib/api";
import { ReadRecipeDto } from "@yara/api/recipe";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecipePageData } from "@/app/recipes/[id]/types";
import CookingSteps from "./CookingSteps";
import { Metadata } from "next";

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

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const authToken = (await cookies()).get("accessToken")!.value;
  const { id } = await params;
  const recipe = await getRecipe(authToken, id);

  return {
    title: `Cooking: ${recipe.name} | Yara`,
    description: `Step-by-step cooking guide for ${recipe.name}`,
  };
}

export default async function CookingPage({
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
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
        <div className="w-screen grid grid-cols-[1fr_auto_1fr] p-4">
          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/recipes/${id}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Exit Cooking Mode
              </Link>
            </Button>
          </div>
          <h1 className="truncate text-lg text-center font-semibold">
            {recipe.name}
          </h1>
          <div></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="w-full px-4 py-6">
        <CookingSteps recipe={recipe} />
      </main>
    </div>
  );
}
