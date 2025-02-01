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
      description:
        "Resends the code to the email address of the user if passes security questions",
    },
    {
      name: "confirm_code",
      description: "Code confirmation process of already registered user",
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
