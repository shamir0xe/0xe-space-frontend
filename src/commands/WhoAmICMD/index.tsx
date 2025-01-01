import User from "@/models/user";

const WhoAmICMD = (user: User, ...args: string[]): JSX.Element => {
  console.log(args);
  return (
    <div className="text-left">
      <div>
        <span>Username: </span> {user.username}
      </div>
      {user.name ? (
        <div>
          <span>Name: </span> {user.name}
        </div>
      ) : (
        <div />
      )}
      {user.email ? (
        <div>
          <span>Email: </span> {user.email}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default WhoAmICMD;
