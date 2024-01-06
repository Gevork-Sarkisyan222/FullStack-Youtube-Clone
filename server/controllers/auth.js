import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user' });
  }
};

export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) {
      return res.status(400).json({
        message: 'Wrong Credentials',
      });
    }

    const { password, ...others } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '30d' });

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    res.status(400).json({ message: 'Error cannot get user' });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '30d' });
      res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT, { expiresIn: '30d' });
      res
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    res.status(400).then('Cannot enter with google');
  }
};
