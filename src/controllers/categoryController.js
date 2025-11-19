import categoryModel from "../models/category.model.js";

/**
 * @desc Create a new category
 * @route POST/api/category
 * @access Public
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, colorCode } = req.body;
    const newCategory = await categoryModel.create({
      name,
      description,
      colorCode,
    });

    res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log(err.message);
      return res
        .status(400)
        .json({ message: `Validation Error ${err.message}` });
    }

    console.error(`Error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: `Error occured ${err.message}`,
    });
  }
};

/**
 * @desc Get category
 * @route GET /api/category
 * @access Public
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      message: "Success finding categories",
    });
  } catch (err) {
    console.error(`Error occured ${err.message}`);
    res
      .status(500)
      .json({ success: false, message: `Failed to retrive categories` });
  }
};

/**
 * @desc Get a category by Id
 * @route GET /api/category
 * @access Public
 */
export const getACategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);

    if (!category) {
      console.log(`Category not found`);
      return res.status(404).json(`Category ${categoryId} not found`);
    }
    res.status(200).json({
      sucess: true,
      data: category,
      message: "Success finding category",
    });
  } catch (err) {
    console.error(`Error occured ${err.message}`);
    res.status(500).json({
      success: false,
      message: `Error occured ${err.message}`,
    });
  }
};

/**
 * @desc Update a category
 * @route PUT /api/category
 * @route PATCH /api/category
 * @access Public
 */
export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const updateData = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: `Task Not Found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Success Updating`,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: `Invalid Category Id format` });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "validation Error",
        error: err.message,
      });
    }
    console.error(`Error occured ${err.message}`);
    res.status(500).json({});
  }
};

/**
 * @desc Delete category
 * @route DELETE /api/category
 * @access Public
 */
export const deleteCategories = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category not found`,
      });
    }

    res.status(204).json({
      success: true,
      message: `Success Deleting`,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Invalid Category Id format`,
      });
    }
  }
};
