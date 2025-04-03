import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { getRecipes } from "@/lib/api";

export default async function Recipes() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")!;
  const recipes = await getRecipes(accessToken.value);

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Top Navigation */}
      <header className="bg-background border-b p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Input placeholder="Search recipes..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prep Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="quick">Quick (0-15 mins)</SelectItem>
                <SelectItem value="medium">Medium (15-30 mins)</SelectItem>
                <SelectItem value="long">Long (30+ mins)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Recipe List */}
      <ScrollArea className="h-[calc(100vh-73px)] p-4 z-0 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
              <Card className="overflow-hidden">
                <CardHeader className="p-0">
                  <img alt="Recipe image" src="https://placehold.co/300x150" />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{recipe.name}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <CardTitle>Create a recipe</CardTitle>
              {recipes.length === 0 ? (
                <CardDescription>
                  Start building out your personal recipe book today.
                </CardDescription>
              ) : null}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Link href="/recipes/create">
                <Button size="sm">
                  Create
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </ScrollArea>
    </main>
  );
}
