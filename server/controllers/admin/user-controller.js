const User = require("../../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found!",
      });
    }

    res.status(200).json({
      success: true,
      data: users,
    });
    console.log("Resposnse Users:",users);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
const getWeeklyUserStats = async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);

    // Users registered this week
    const thisWeekUsers = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo, $lte: now }
    });

    // Users registered last week
    const lastWeekUsers = await User.countDocuments({
      createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    // Calculate % change
    let percentChange = 0;
    if (lastWeekUsers === 0 && thisWeekUsers > 0) {
      percentChange = 100;
    } else if (lastWeekUsers > 0) {
      percentChange = ((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100;
    }

    res.status(200).json({
      success: true,
      data: {
        thisWeekUsers,
        lastWeekUsers,
        percentChange: percentChange.toFixed(2),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


module.exports = { getAllUsers,getWeeklyUserStats };
