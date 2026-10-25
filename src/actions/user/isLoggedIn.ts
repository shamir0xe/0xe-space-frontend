import User from "@/models/user";

/** Whether the user is logged in (guests have no token). */
const isLoggedIn = (user: User): boolean => Boolean(user.token);

export default isLoggedIn;
