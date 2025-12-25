const Profile = require("../models/Profile");

exports.createOrUpdateProfile = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { ...req.body, user: req.user.id },
    { new: true, upsert: true }
  );

  res.json(profile);
};

exports.getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate("user");
  res.json(profile);
};
