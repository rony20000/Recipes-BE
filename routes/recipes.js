import express from "express";
import { recipeValidations } from "../middleware/errorHandling.js";
const router = express.Router();
import {
  getAllRecipes,
  createRecipe,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesBySearch,
} from "../controllers/recipes.js";
router.get("/", getAllRecipes);
router.get("/recipe/:id", getSingleRecipe);
router.get("/search", getRecipesBySearch);
router.post("/recipes", recipeValidations(), createRecipe);
router.put("/recipe/:id", recipeValidations(), updateRecipe);
router.delete("/recipe/:id", deleteRecipe);

export default router;
