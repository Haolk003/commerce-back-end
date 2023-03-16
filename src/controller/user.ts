import { Request, Response, NextFunction } from "express";
import user from "../models/auth";
import { createError } from "../middlewares/errorHandle";
import { validateMongoDbId } from "../utils/validateId";
import { Types } from "mongoose";
interface Search {
  search: string;
}
//get all users
const getAllUSer = async (req: Request, res: Response, next: NextFunction) => {
  const { search } = req.query;
  try {
    let getUsers;
    if (search && search !== "") {
      getUsers = await user.find({
        $or: [
          { mobile: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      getUsers = await user.find();
    }

    res.status(200).json(getUsers);
  } catch (err: any) {
    next(err);
  }
};
//get a user
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await user.findById(id);
    res.status(200).json(getUser);
  } catch (err: any) {
    next(err);
  }
};
//delete user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await user.findByIdAndDelete(id);
    res.status(200).json("successfully deleted");
  } catch (err: any) {
    next(err);
  }
};
//update User
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  validateMongoDbId(id);
  try {
    const getUser = await user
      .findByIdAndUpdate(
        id,
        {
          firstName: req.body?.firstName,
          lastName: req.body?.lastName,
          address: req.body?.address,
          image: req.body?.image,
          mobile: req.body?.mobile,
        },
        { new: true }
      )
      .populate("wishList");
    res.status(200).json(getUser);
  } catch (err: any) {
    next(err);
  }
};
//save address
const saveAddress = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { address } = req.body;
  validateMongoDbId(id);
  try {
    const getUser = await user.findByIdAndUpdate(
      id,
      { address: address },
      { new: true }
    );
    res.status(200).json(getUser);
  } catch (err) {
    next(err);
  }
};
//Block User
const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockUser = await user.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.status(200).json(blockUser);
  } catch (err: any) {
    next(err);
  }
};
const unBlockUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unBlockUser = await user.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.status(200).json(unBlockUser);
  } catch (err: any) {
    next(err);
  }
};
const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findWishList = await user
      .findById(id, {
        firstName: 1,
        lastName: 1,
        email: 1,
        cart: 1,
        wishList: 1,
      })
      .populate({
        path: "wishList",
      });
    res.status(200).json(findWishList);
  } catch (err) {
    next(err);
  }
};
interface userRequest extends Request {
  user: {
    id: string;
    isAdmin: boolean;
  };
}
const addWishlist = async (req: userRequest, res: Response, next: Function) => {
  const { id } = req.user;
  const { proId } = req.body;
  validateMongoDbId(proId);
  try {
    const User = await user.findById(id);
    if (!User) {
      throw createError(400, "You are not authentication");
    }
    const alreadyadded = User.wishList.find(
      (item: Types.ObjectId) => item.toString() === proId.toString()
    );
    if (alreadyadded) {
      let User = await user
        .findByIdAndUpdate(
          id,
          {
            $pull: { wishList: proId },
          },
          { new: true }
        )
        .populate("wishList");
      res.status(200).json(User);
    } else {
      let User = await user
        .findByIdAndUpdate(
          id,
          {
            $push: { wishList: proId },
          },
          { new: true }
        )
        .populate("wishList");
      res.status(200).json(User);
    }
  } catch (err) {
    next(err);
  }
};
const removerWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  const { proId } = req.body;
  validateMongoDbId(id);
  try {
    const updateUser = await user
      .findByIdAndUpdate(id, { $pull: { wishList: proId } }, { new: true })
      .populate("wishList");
    res.status(200).json(updateUser);
  } catch (err) {
    next(err);
  }
};
export {
  getAllUSer,
  updateUser,
  deleteUser,
  getUser,
  addWishlist,
  blockUser,
  unBlockUser,
  getWishlist,
  saveAddress,
  removerWishlist,
};
