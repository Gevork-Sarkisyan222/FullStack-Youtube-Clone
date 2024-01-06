import User from '../models/User.js';
import Video from '../models/Video.js';

export const update = async (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(403).json('You can update only your accaunt');
    }
  } else {
    res.status(403).json('You can update only your accaunt');
  }
};

export const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted');
    } catch (err) {
      res.status(403).json('You can delete only your accaunt');
    }
  } else {
    res.status(403).json('You can delete only your accaunt');
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json('Error getting User');
  }
};

export const subscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json('Subscription successfull.');
  } catch (err) {
    res.status(400).json('Error cannot subscribe');
  }
};
export const unsubscribe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json('Unsubscription successfull.');
  } catch (err) {
    res.status(400).json('Error cannot unsubscribe');
  }
};
export const like = async (req, res) => {
  const id = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json('Video has been liked');
  } catch (err) {
    res.status(400).json('Cant like a video');
  }
};
export const dislike = async (req, res) => {
  const id = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json('Video has been disliked');
  } catch (err) {
    res.status(400).json('Cant dislike a video');
  }
};
