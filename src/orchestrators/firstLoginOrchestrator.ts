import APICall from "@/facades/apiCall";
import AuthContext from "@/facades/authContext";
import User from "@/models/user";

const firstLoginOrchestrator = async (
	setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
	/**
	 * Read cookies for retrieving the user
	 * if the cookie have been found, try to
	 * login using that token
	 * **/
	if (AuthContext.readToken() == null) {
		return;
	}
	// We have a token
	console.log(`Stored token: ${AuthContext.readToken()}`);
	APICall.userInfo()
		.then((user) => {
			console.log(`We already have a user: ${user.username}`);
			setUser(user);
		})
		.catch((error) => {
			console.log(`error occurred while try to login the user: ${error}`);
		});
};

export default firstLoginOrchestrator;
