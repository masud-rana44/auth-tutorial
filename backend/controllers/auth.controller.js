import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("Please provide all fields");
    }

    // 1. Check if user already exists
    const isUserAlreadyExists = await User.findOne({ email });

    if (isUserAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(Math.random() * 900000) + 100000;

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() * 24 * 60 * 60 * 1000,
    });

    // 3. Save user to the database
    await user.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
