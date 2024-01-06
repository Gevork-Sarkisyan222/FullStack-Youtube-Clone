import Video from '../models/Video.js';
import User from '../models/User.js';

export const addVideo = async (req, res) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    res.status(400).json('Error adding video');
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json('Video not found');

    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      );
      res.status(200).json(updatedVideo);
    } else {
      return res.status(403).json('You can update only your video');
    }
  } catch (err) {
    res.status(400).json('Error find video');
  }
};
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json('Video not found');

    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json('Video deleted successfully');
    } else {
      return res.status(403).json('You can delete only your video');
    }
  } catch (err) {
    res.status(400).json('Error delete video');
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    res.status(404).json('Video not found');
  }
};

export const addView = async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json('The view has been increased.');
  } catch (err) {
    res.status(404).json('Video not found');
  }
};

export const random = async (req, res) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    res.status(404).json('Videos not found');
  }
};

export const trend = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(404).json('Videos not found');
  }
};

export const sub = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      }),
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(404).json('Videos not found');
  }
};

export const getByTag = async (req, res) => {
  const tags = req.query.tags.split(',');

  try {
    const videosWithTags = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videosWithTags);
  } catch (err) {
    res.status(404).json('Videos with this tags not found');
  }
};

export const search = async (req, res) => {
  const query = req.query.q;

  try {
    const videos = await Video.find({ title: { $regex: query, $options: 'i' } }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    res.status(404).json('No video found for your query');
  }
};
