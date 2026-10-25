const contents = {
  txts: {
    body: "It's a vi-based terminal website! If you are not sure what to do just press 'i' and start typing.",
    commandTitle: "Here is the list of commands:",
  },
  commands: [
    {
      name: "cv",
      options: {
        pdf: "Downloads the CV as pdf",
        starwars: "Just RUN IT :)",
      },
      description: "Shows my CV",
    },
    {
      name: "blog",
      description: "Navigate to blog0xe for it's awesome contents :[",
    },
    {
      name: "post",
      options: {
        "ls [page]": "Lists the blog posts",
        "comments <id> [page]": "Shows the comments of a post",
        "comment <id>": "Adds a comment to a post (login required)",
        "uncomment <comment-id>": "Deletes one of your comments",
        "rate <id> <1-5>": "Rates a post (login required)",
        "unrate <id>": "Removes your rating of a post",
      },
      description: "Blog posts, comments and ratings from the terminal",
    },
    {
      name: "socials",
      description: "My social networks list",
    },
    // {
    //   name: "twitter",
    //   description: "Twitter",
    // },
    // {
    //   name: "youtube",
    //   description: "Youtube",
    // },
    // {
    //   name: "codeforces",
    //   description: "Codeforces",
    // },
    // {
    //   name: "leetcode",
    //   description: "Leetcode",
    // },
    // {
    //   name: "github",
    //   description: "Github",
    // },
    // {
    //   name: "topcoder",
    //   description: "Topcoder",
    // },
    {
      name: "about_me",
      description: "Brief information about me",
    },
    {
      name: "help",
      description: "Shows this help",
    },
    {
      name: "reload",
      description: "Reloads the page",
    },
    {
      name: "clear",
      description: "Clears the screen",
    },
    {
      name: "login",
      description: "Login process",
    },
    {
      name: "register",
      description: "Register process for this website",
    },
    {
      name: "resend_code",
      description: "Sends a new verification code to your email address",
    },
    {
      name: "confirm_code",
      description: "Verifies your email with the received code and logs you in",
    },
    {
      name: "forgot_password",
      description: "Emails you a password reset code",
    },
    {
      name: "reset_password",
      description: "Sets a new password with the reset code",
    },
    {
      name: "logout",
      description: "Logout",
    },
    {
      name: "whoami",
      description: "Outputs who actually u are",
    },
  ],
};

export default contents;
