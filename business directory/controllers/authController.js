const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;

  try {
    // Check if the username or email already exists
    const userByUsername = await prisma.user.findUnique({
      where: { username: username },
    });
    const userByEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userByUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    if (userByEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
        firstname,
        lastname,
      },
    });

    // Create a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
