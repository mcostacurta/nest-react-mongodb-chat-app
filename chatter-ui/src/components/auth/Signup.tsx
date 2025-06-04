import { Link } from "react-router-dom";
import { Link as MUILink, TextField } from "@mui/material"
import Auth from "./Auth"
import { useCreateUser } from "../../hooks/useCreateUser";
import { useState } from "react";
import extractErrorMessage from "../../utils/error";
import { useLogin } from "../../hooks/useLogin";
import { UNKNOWN_ERROR_MESSAGE } from "../../constants/errors";

const Signup = () => {
    const [createUser] = useCreateUser()
    const [username, setUserName] = useState("");
    const [error, setError] = useState("");
    const { login } = useLogin();

    return (
        <>
            <Auth submitLabel="SIGNUP" error={error} extraFields={[
                <TextField type="text" label="username" variant="outlined" value={username} onChange={(event) => setUserName(event.target.value)} error={!!error} helperText={error}/>
            ]} onSubmit={async ({email, password}) => {
                try{
                    await createUser({
                        variables: {
                            createUserInput: {
                                email,
                                username,
                                password
                            } 
                        }
                    });
                    await login({email, password});
                    setError("");
                } catch (err) {
                    const errorMessage = extractErrorMessage(err);
                    if (errorMessage){
                        setError(errorMessage);
                        return;
                    }
                    setError(UNKNOWN_ERROR_MESSAGE)
                }
                
            }}>
                <MUILink component={Link} to="/login" style={{ alignSelf: "center" }}>
                    Login
                </MUILink>
            </Auth>
        </>
)}

export default Signup;