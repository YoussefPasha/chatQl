const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.error(error);
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { userName, email, password, confirmPassword } = args;
      let errors = {};
      try {
        //TODO: Validate input data

        if (email.trim() === "") errors.email = "Email must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm Password must not be empty";
        if (userName.trim() === "")
          errors.userName = "Username must not be empty";
        //TODO: Check if userName / email exists

        // const userByUserName = await User.findOne({ where: { userName } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUserName) errors.userName = "Username is taken ";
        // if (userByEmail) errors.email = "email is taken ";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        //TODO: Check password and confirmation password

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match";

        //TODO: Hash password

        password = await bcrypt.hash(password, 6);
        //TODO: Create user

        const user = await User.create({
          userName,
          email,
          password,
        });
        //TODO: Return user

        return user;
      } catch (error) {
        console.error(error);
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach(
            (e) => (errors[e.path] = `${e.path.split(".")[1]} is already taken`)
          );
        } else if (error.name === "SequelizeValidationError") {
          error.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad request ", { errors });
      }
    },
  },
};
