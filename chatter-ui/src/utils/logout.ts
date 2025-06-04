import router from "../components/Routes";
import client from "../constants/apollo-client";
import { authenticatedVar } from "../constants/authenticated";

export const onLogout = async () => {
    authenticatedVar(false);
    router.navigate("/login");
    await client.clearStore();
};