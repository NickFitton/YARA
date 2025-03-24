import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRecipe } from "@/lib/api";
import { ReadRecipeDto } from "@yara/api/recipe";
import {
  ChefHat,
  ChevronLeft,
  Clock,
  LucideProps,
  Scale,
  Users,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react";

type MissingData = {
  totalTime: string;
  servings: number;
  difficulty: number;
  calories: number;
};

type Icon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

function InfoCard({
  Icon,
  title,
  children,
}: PropsWithChildren<{ title: string; Icon: Icon }>) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-4">
        <Icon className="mb-2 h-6 w-6 text-orange-500" />
        <p className="text-sm text-muted-foreground">{title}</p>
        {children}
      </CardContent>
    </Card>
  );
}
function ActionCard({ Icon, title }: { title: string; Icon: Icon }) {
  return (
    <Card className="border-orange-400 bg-orange-50">
      <CardContent className="flex flex-col items-center justify-center p-4">
        <Icon className="mb-2 h-6 w-6 text-orange-500" />
        <p className="text-sm text-muted-foreground text-orange-700">{title}</p>
      </CardContent>
    </Card>
  );
}

function QuickInfo({
  recipe: { totalTime, servings, difficulty, calories },
}: {
  recipe: ReadRecipeDto & MissingData;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-5 w-full">
      <InfoCard Icon={Clock} title="Total Time">
        <p className="font-semibold">{totalTime}</p>
      </InfoCard>
      <InfoCard Icon={Users} title="Servings">
        <div className="flex items-center gap-2">
          <button className="text-lg font-bold text-orange-500 hover:text-orange-600">
            -
          </button>
          <span className="font-semibold">{servings}</span>
          <button className="text-lg font-bold text-orange-500 hover:text-orange-600">
            +
          </button>
        </div>
      </InfoCard>
      <InfoCard Icon={ChefHat} title="Difficulty">
        <p className="font-semibold">{difficulty}</p>
      </InfoCard>
      <InfoCard Icon={Scale} title="Calories">
        <p className="font-semibold">{calories}</p>
      </InfoCard>
      <ActionCard Icon={ChefHat} title="Let's cook!" />
    </div>
  );
}

function Header({ recipe: { name, description } }: { recipe: ReadRecipeDto }) {
  return (
    <div className="relative h-[20vh] min-h-[300px] bg-black">
      <img
        alt={name}
        src={"https://placehold.co/300x150"}
        className="object-cover opacity-80 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 p-0"
            asChild
          >
            <Link href="/recipes">
              <ChevronLeft className="h-4 w-4" />
              Back to Recipes
            </Link>
          </Button>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
            {name}
          </h1>
          <p className="max-w-2xl text-lg text-white/90">{description}</p>
        </div>
      </div>
    </div>
  );
}

function RecipeContent({ recipe }: { recipe: ReadRecipeDto }) {
  return (
    <main className="flex flex-col gap-2 mt-4 mb-4">
      <section id="ingredients">
        <h2 className="mb-4 text-2xl font-bold">Ingredients</h2>
        <Card className="p-4">
          <CardContent className="pb-0">
            <ul className="flex flex-col gap-2">
              {recipe.ingredients.map((ingredient) => {
                return (
                  <li
                    key={ingredient.id}
                    className="list-disc marker:text-orange-500"
                  >
                    {ingredient.quantity} - {ingredient.name}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>
      <section id="instructions">
        <h2 className="mb-4 text-2xl font-bold">Instructions</h2>
        <Card className="p-4">
          <CardContent className="pb-0">
            <ol className="flex flex-col gap-2">
              {recipe.instructions.map((instruction) => {
                return (
                  <li
                    key={instruction.id}
                    className="list-decimal marker:text-orange-500"
                  >
                    {instruction.step}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")!;
  console.log(accessToken.value);
  const recipe = {
    ...(await getRecipe(accessToken.value, id)),
    totalTime: "4h 20m",
    servings: 4,
    difficulty: 3,
    calories: 420,
  } as ReadRecipeDto & MissingData;
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Hero Section */}
      <Header recipe={recipe} />

      <div className="container w-full mx-auto px-4 py-8">
        <QuickInfo recipe={recipe} />
        <RecipeContent recipe={recipe} />
      </div>
    </div>
  );
}
