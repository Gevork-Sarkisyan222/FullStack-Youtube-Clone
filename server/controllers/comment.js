import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

export const addComment = async (req, res) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });

  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(400).json('Error adding comment');
  }
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  const video = await Video.findById(req.params.id);

  try {
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json('Comment has been deleted!');
    } else {
      return res.status(403).json('You can delete only your comment!');
    }
  } catch (err) {
    res.status(400).json('Error deleting message');
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(400).json('Cannot get video');
  }
};
