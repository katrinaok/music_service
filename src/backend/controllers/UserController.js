import User from "../models/User.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  try {
    const {
      username, email, password
    } = req.body;
    
    const identifier = username || email;
    if (!identifier || !password) {
      return res.status(400).json({
        error: "Введіть логін та пароль"
      });
    }
    
    const user = await User.findByLogin(identifier);
    if (!user) {
      return res.status(401).json({
        error: "Неправильний логін або пароль"
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Неправильний логін або пароль"
      });
    }
    const {
      password: _, ...safeUser
    } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({
      message: "Користувач не знайдений"
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(201).json({
      id: result.id, ...req.body
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    await User.update(req.params.id, req.body);
    res.json({
      message: "Користувач оновлений"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({
      message: "Користувач видалений"
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};