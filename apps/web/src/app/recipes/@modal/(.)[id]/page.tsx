import { getRecipe } from "@/lib/api";
import { ReadRecipeDto } from "@yara/api/recipe";
import { ChefHat, Clock, Maximize2, PencilLine, Users } from "lucide-react";
import { cookies } from "next/headers";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type MissingData = {
  totalTime: string;
  servings: number;
  difficulty: number;
  calories: number;
  image?: string;
};

const complexityScore = 2;
export default async function RecipeModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")!;
  const recipe = {
    ...(await getRecipe(accessToken.value, id)),
    totalTime: "4h 20m",
    servings: 4,
    difficulty: 3,
    calories: 420,
  } as ReadRecipeDto & MissingData;

  return (
    <DialogContent className="max-w-3xl p-0 sm:max-h-[90vh] sm:overflow-auto">
      <VisuallyHidden>
        <DialogTitle>{recipe.name}</DialogTitle>
      </VisuallyHidden>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-64 md:h-full">
          <Image
            src={recipe.image || "./placeholder.svg"}
            alt={recipe.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white md:hidden">
            <h2 className="text-xl font-bold">{recipe.name}</h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="hidden md:block">
            <h2 className="mb-2 text-2xl font-bold">{recipe.name}</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              {recipe.description}
            </p>
          </div>

          <div className="mb-4 md:hidden">
            <p className="text-sm text-muted-foreground">
              {recipe.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center rounded-lg bg-orange-50 p-2">
              <Clock className="mb-1 h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Total Time</span>
              <span className="text-sm font-medium">{recipe.totalTime}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-orange-50 p-2">
              <Users className="mb-1 h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Servings</span>
              <span className="text-sm font-medium">{recipe.servings}</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-orange-50 p-2">
              <ChefHat className="mb-1 h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Difficulty</span>
              <span className="text-sm font-medium">{recipe.difficulty}</span>
            </div>
          </div>

          {/* Complexity */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Complexity</span>
              <span className="text-xs text-muted-foreground">
                {complexityScore <= 1
                  ? "Very Simple"
                  : complexityScore === 2
                    ? "Simple"
                    : complexityScore === 3
                      ? "Moderate"
                      : complexityScore === 4
                        ? "Complex"
                        : "Very Complex"}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-full rounded-full ${i < complexityScore ? "bg-orange-500" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </div>

          {/* Key Ingredients */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium">Key Ingredients:</h3>
            <div className="flex flex-wrap gap-1.5">
              {recipe.ingredients.slice(1, 4).map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant="outline"
                  className="bg-orange-50"
                >
                  {ingredient.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dietary Info */}
          {/* {recipe.dietary && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium">Dietary Information:</h3>
              <div className="grid grid-cols-2 gap-1">
                {recipe.dietary.map((diet: string) => (
                  <div key={diet} className="flex items-center gap-1.5">
                    {diet.toLowerCase().includes("contains") ? (
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    ) : (
                      <Check className="h-3 w-3 text-green-500" />
                    )}
                    <span className="text-xs">{diet}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          <Separator className="my-4" />

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant={"default"} asChild className={`w-full col-span-2`}>
              <a
                href={`/recipes/${recipe.id}`}
                className="flex flex-row justify-center items-center gap-2"
              >
                View Full Recipe
                <Maximize2 className="mr-2 h-4 w-4" />
              </a>
            </Button>
            <IconLink Icon={ChefHat} href={`/cook/${recipe.id}`}>
              Cook
            </IconLink>
            <IconLink Icon={PencilLine} href={`/recipes/${recipe.id}/edit`}>
              Edit
            </IconLink>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

const IconLink = ({
  Icon,
  children,
  href,
}: {
  Icon: (props: { className: string }) => React.ReactNode;
  children: string;
  href: string;
}) => {
  return (
    <Button variant="outline" asChild className={`w-full`}>
      <Link
        href={href}
        className="flex flex-row justify-center items-center gap-2"
      >
        {children}
        <Icon className="mr-2 h-4 w-4" />
      </Link>
    </Button>
  );
};
