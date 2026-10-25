type User = {
  id: string;
  username: string;
  token: string | null;
  name: string | null;
  email: string | null;
  is_admin: boolean | null;
  is_email_confirmed?: boolean | null;
};

export default User;
