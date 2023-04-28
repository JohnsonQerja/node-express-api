const DataLoader = require("dataloader");
const { map } = require("ramda");

const User = require("../../model/user");
const Photo = require("../../model/photo");
const Like = require("../../model/like");
const Comment = require("../../model/comment");

const usersLoader = new DataLoader((usersId) => {
  return users(usersId);
});

const photosLoader = new DataLoader((photsId) => {
  return photos(photsId);
});

const likesLoader = new DataLoader((likesId) => {
  return likes(likesId);
});

const commentsLoader = new DataLoader((threadsId) => {
  return comments(threadsId);
});

const user = async (userId) => {
  // console.log("query user");
  try {
    const user = await User.findById(userId);
    return transformUser(user);
  } catch (error) {
    throw error;
  }
};

const users = async (usersId) => {
  try {
    const users = await User.find({ _id: { $in: usersId } });
    return map((user) => {
      return transformUser(user);
    }, users);
  } catch (error) {
    throw error;
  }
};

const photo = async (photoId) => {
  // console.log("query photo");
  try {
    const photo = await Photo.findById(photoId);
    return transformPhoto(photo);
  } catch (error) {
    throw error;
  }
};

const photos = async (photosId) => {
  try {
    const photos = await Photo.find({ _id: { $in: photosId } });
    return map((photo) => {
      return transformPhoto(photo);
    }, photos);
  } catch (error) {
    throw error;
  }
};

const likes = async (likesId) => {
  try {
    const likes = await Like.find({ _id: { $in: likesId } });
    return map((like) => {
      return transformLike(like);
    }, likes);
  } catch (error) {
    throw error;
  }
};

const comments = async (threadsId) => {
  try {
    const comments = await Comment.find({ _id: { $in: threadsId } });
    return map((comment) => {
      return transformComment(comment);
    }, comments);
  } catch (error) {
    throw error;
  }
};

const transformUser = (user) => {
  return {
    ...user._doc,
    password: null,
    created_at: new Date(user._doc.created_at).toISOString(),
  };
};

const transformPhoto = async (photo) => {
  return {
    ...photo._doc,
    user: usersLoader.load(photo._doc.user.toString()),
    likes: () => likesLoader.loadMany(photo._doc.likes),
    comments: () => commentsLoader.loadMany(photo._doc.comments),
    created_at: new Date(photo._doc.created_at).toISOString(),
  };
};

const transformLike = (like) => {
  return {
    ...like._doc,
    photo: like._doc.photo && photosLoader.load(like._doc.photo.toString()),
    comment:
      like._doc.comment && commentsLoader.load(like._doc.comment.toString()),
    user: usersLoader.load(like._doc.user.toString()),
  };
};

const transformComment = (comment) => {
  return {
    ...comment._doc,
    photo: comment._doc.photo
      ? photosLoader.load(comment._doc.photo.toString())
      : null,
    user: usersLoader.load(comment._doc.user.toString()),
    reply: () => commentsLoader.loadMany(comment._doc.reply),
    likes: () => likesLoader.loadMany(comment._doc.likes),
  };
};

exports.transformUser = transformUser;
exports.transformPhoto = transformPhoto;
exports.transformLike = transformLike;
exports.transformComment = transformComment;
