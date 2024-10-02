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
import {
  BookOpen,
  Home,
  Search,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cookies } from "next/headers";

export default function Dashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  console.log("accessToken",accessToken);
  const recipes = [
    {
      id: 1,
      name: "Spaghetti Carbonara",
      cuisine: "Italian",
      prepTime: "20 mins",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Chicken Tikka Masala",
      cuisine: "Indian",
      prepTime: "30 mins",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Caesar Salad",
      cuisine: "American",
      prepTime: "15 mins",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Beef Stroganoff",
      cuisine: "Russian",
      prepTime: "25 mins",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Sushi Rolls",
      cuisine: "Japanese",
      prepTime: "40 mins",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-muted p-4 hidden md:block">
        <div className="flex items-center mb-8">
          <BookOpen className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">MyRecipeVault</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Discover
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <header className="bg-background border-b p-4 sticky top-0 z-10">
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
        <ScrollArea className="h-[calc(100vh-73px)] p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{recipe.name}</CardTitle>
                  <CardDescription>
                    {recipe.cuisine} • {recipe.prepTime}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                  <Button size="sm">
                    View Recipe
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
