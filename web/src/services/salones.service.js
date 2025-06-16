import { postData } from "../utils/api.utils";

export const postSalon = async (data) => await postData("/superuser/salones",  data);