import RecipeModel from "../models/recipe.js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
import {
  expectedErrorHandling,
  validationErrors,
  serverSideErrorHandling,
} from "../middleware/errorHandling.js";
export const getAllRecipes = async (req, res, next) => {
  try {
    const allRecipes = await RecipeModel.find();
    res.json(allRecipes);
  } catch (error) {
    serverSideErrorHandling(error, next);
  }
};
export const getSingleRecipe = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const recipe = await RecipeModel.findById(_id);
    res.json(recipe);
  } catch (error) {
    serverSideErrorHandling(error, next);
  }
};
export const getRecipesBySearch = async (req, res, next) => {
  const { searchQuery, ingredients } = req.query;
  console.log(req.query);
  try {
    const title = new RegExp(searchQuery, "i");

    let recipes = await RecipeModel.find({
      $or: [{ title }, { ingredients: { $in: ingredients.split(",") } }],
    });
    res.status(200).json({ data: recipes });
  } catch (error) {
    serverSideErrorHandling(error, next);
  }
};
export const createRecipe = async (req, res, next) => {
  validationErrors(req, next);
  const { title, ingredients, instructions } = req.body;
  const sIngrediens = ingredients.split(",");
  try {
    if (!req.file) {
      expectedErrorHandling("No image added to file", 404);
    }
    const imageUrl = req.file.path.replace("\\", "/");
    if (!title || !ingredients || !instructions) {
      clearImage(imageUrl);
    }
    const newRecipe = new RecipeModel({
      title: title,
      imageUrl: imageUrl,
      ingredients: sIngrediens,
      instructions: instructions,
    });

    const result = await newRecipe.save();
    res.status(201).json(result);
  } catch (error) {
    serverSideErrorHandling(error, next);
  }
};
export const updateRecipe = async (req, res, next) => {
  const { id: _id } = req.params;
  validationErrors(req, next);
  const { title, ingredients, instructions, image } = req.body;
  const sIngrediens = ingredients.split(",");
  try {
    let updatedImagUrl = image;
    if (req.file) {
      updatedImagUrl = req.file.path.replace("\\", "/");
    }

    const updatedRecipe = await RecipeModel.findById(_id);
    if (!updateRecipe) {
      expectedErrorHandling("no recipe found", 404);
    }
    if (updateRecipe.imageUrl !== updatedImagUrl) {
      clearImage(updatedRecipe.imageUrl);
    }

    updatedRecipe.title = title;
    updatedRecipe.ingredients = ingredients;
    updatedRecipe.instructions = instructions;
    updatedRecipe.imageUrl = updatedImagUrl;

    const result = await updatedRecipe.save();
    res.status(201).json(result);
  } catch (error) {
    serverSideErrorHandling(error, next);
  }
};
export const deleteRecipe = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const dRecipe = await RecipeModel.findById(_id);
    if (!dRecipe) {
      expectedErrorHandling("no recipe found", 404);
    }
    clearImage(dRecipe.imageUrl);

    await RecipeModel.findByIdAndRemove(_id);
    res.status(200).json({ message: "recipe deleted successfully" });
  } catch (error) {
    serverSideErrorHandling(error, next);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
