
module.exports = {
  Query: {
    getUsers: () => {
      const users = [
        { userName: "john", email: "john@gmail.com" },
        { userName: "jane", email: "jane@gmail.com" },
      ];
      return users;
    },
  },
};
