type User = {
	id: string;
	username: string;
	name: string | null;
	email: string | null;
	is_admin: boolean | null;
};

export default User;
