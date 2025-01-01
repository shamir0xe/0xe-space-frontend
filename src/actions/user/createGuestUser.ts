import User from "@/models/user";

const createGuestUser = (): User => {
	let id = Math.round(Math.random() * 1e4).toString();
	return { username: `guest-${id}`, id: id } as User;
};

export default createGuestUser;
