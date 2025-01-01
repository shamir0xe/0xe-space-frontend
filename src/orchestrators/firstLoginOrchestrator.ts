import APICall from "@/facades/apiCall";
import AuthContext from "@/facades/authContext";
import User from "@/models/user";

const firstLoginOrchestrator = async (
	setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
	/**
	 * Read cookies for retrieveing the user
	 * if the cookie have been found, try to
	 * login using that token
	 * **/
	if (AuthContext.readToken() == null) {
		return;
	}
	// We have a token
	APICall.userInfo()
		.then((user) => {
			setUser(user);
		})
		.catch((error) => {
			console.log(`error occured while try to login the user: ${error}`);
		});
};

export default firstLoginOrchestrator;
