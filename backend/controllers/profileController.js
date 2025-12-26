const Profile = require("../models/Profile");

exports.createOrUpdateProfile = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { ...req.body, user: req.user._id },
    { new: true, upsert: true }
  );

  res.json(profile);
};

exports.getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate("user");
  res.json(profile);
};
