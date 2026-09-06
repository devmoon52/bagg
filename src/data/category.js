// IMAGES
import electronic from "../assets/category-images/electronic.png";
import fashion from "../assets/category-images/fashion.png";
import homeAndKitchen from "../assets/category-images/home-and-kitchen.jpg";
import watches from "../assets/category-images/watches.jpg";
import beautyAndPersonalCare from "../assets/category-images/beauty-and-personal-care.jpg";
import sportsAndFitness from "../assets/category-images/sports-and-fitness.jpg";
import books from "../assets/category-images/books.png";
import toyAndGames from "../assets/category-images/toy-and-games.png";
import grocery from "../assets/category-images/fruit-and-vegetable.jpg";
import jewelry from "../assets/category-images/jewelry.png";
import bagsAndAccessories from "../assets/category-images/bags-and-accessories.png";
import petSupplies from "../assets/category-images/pet-supplies.png";

// ICONS
import { CookingPot, LaptopMinimal, Shirt, Watch, Dumbbell, BookCopy, Gamepad2, LeafyGreen, Gem, BriefcaseBusiness, PawPrint, WandSparkles } from "lucide-react";

export const categories = [
  {
    id: 1,
    categoryName: "Electronics",
    categoryImage: electronic,
    category: "electronics",
    qParam: 'electronic',
    Icon: LaptopMinimal,
  },
  {
    id: 2,
    categoryName: "Fashion",
    categoryImage: fashion,
    category: "fashion",
    qParam: 'fashion',
    Icon: Shirt
  },
  {
    id: 3,
    categoryName: "Home & Kitchen",
    categoryImage: homeAndKitchen,
    category: "home&Kitchen",
    qParam: 'homeKitchen',
    Icon: CookingPot
  },
  {
    id: 4,
    categoryName: "Watches",
    categoryImage: watches,
    category: "watches",
    qParam: 'watches',
    Icon: Watch
  },
  {
    id: 5,
    categoryName: "Beauty & Personal Care",
    categoryImage: beautyAndPersonalCare,
    category: "beauty&personal-care",
    qParam: 'beauty',
    Icon: WandSparkles
  },
  {
    id: 6,
    categoryName: "Sports & Fitness",
    categoryImage: sportsAndFitness,
    category: "sports&fitness",
    qParam: 'sportsFitness',
    Icon: Dumbbell
  },
  {
    id: 7,
    categoryName: "Books",
    categoryImage: books,
    category: "books",
    qParam: 'books',
    Icon: BookCopy
  },
  {
    id: 8,
    categoryName: "Toys & Games",
    categoryImage: toyAndGames,
    category: "toy&games",
    qParam: 'toyGames',
    Icon: Gamepad2
  },
  {
    id: 9,
    categoryName: "Grocery",
    categoryImage: grocery,
    category: "grocery",
    qParam: 'grocery',
    Icon: LeafyGreen
  },
  {
    id: 10,
    categoryName: "Jewelry",
    categoryImage: jewelry,
    category: "jewelry",
    qParam: 'jewelry',
    Icon: Gem
  },
  {
    id: 11,
    categoryName: "Bags & Accessories",
    categoryImage: bagsAndAccessories,
    category: "bags&accessories",
    qParam: 'bagsAccessories',
    Icon: BriefcaseBusiness
  },
  {
    id: 12,
    categoryName: "Pet Supplies",
    categoryImage: petSupplies,
    category: "pet-suppilies",
    qParam: 'petSupplies',
    Icon: PawPrint
  },
];
