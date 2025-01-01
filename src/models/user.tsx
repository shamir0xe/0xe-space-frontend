type User = {
  id: string;
  username: string;
  token: string | null;
  name: string | null;
  email: string | null;
  is_admin: boolean | null;
};

export default User;
