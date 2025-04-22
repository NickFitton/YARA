import { getRecipe } from "@/lib/api";
import { cookies } from "next/headers";
import { RecipePageData } from "../types";
import { ReadRecipeDto } from "@yara/api/recipe";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChefHat,
  FileText,
  ImageIcon,
  Leaf,
  Tag,
  Utensils,
} from "lucide-react";
import BasicInformation from "./BasicInformation";
import Ingredients from "./Ingredients";
import Instructions from "./Instructions";
import RecipeTags from "./RecipeTags";
import Nutrition from "./Nutrition";
import Media from "./Media";
import { Toaster } from "@/components/ui/toaster";

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

function HeroSection({ recipe }: RecipePageData) {
  return <div />;
}
function EditTabs({ children }: React.PropsWithChildren<object>) {
  return (
    <Tabs defaultValue="basic" className="w-full pl-6 pr-6">
      <div className="sticky top-0 z-10 bg-gray-50 pt-4 pb-2">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span>Ingredients</span>
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            <span>Instructions</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Categories & Tags</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span>Nutrition</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Media</span>
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}

export default async function EditRecipePage({
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
    <>
      <Toaster />
      <div className="min-h-screen w-full bg-gray-50 pb-12">
        <section id="hero">
          <HeroSection recipe={recipe} />
          <EditTabs>
            <BasicInformation recipe={recipe} />
            <Ingredients />
            <Instructions />
            <RecipeTags />
            <Nutrition />
            <Media />
          </EditTabs>
        </section>
      </div>
    </>
  );
}
