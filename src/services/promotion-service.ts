import axios from "axios";
import { buildPromotionSiteUrl } from "../helpers/url-helper";

export const getExistPromotionTournamentNotification = async (params: { sessionId: string; username: string }) => {
    try {
        return (await getPromotionAPI(params, `/notification/exist-promotion-tournament-notification`)) as boolean;
    } catch (error) {
        console.error(`Get promotion tournament failed: ${error.message}`);
    }
    return false;
};

export const getNewOrRunningPromotionTournament = async (params: { sessionId: string; username: string }) => {
    try {
        return (await getPromotionAPI(params, `/notification/exist-new-or-running-promotion-tournament`)) as boolean;
    } catch (error) {
        console.error(`Get promotion tournament failed: ${error.message}`);
    }

    return false;
};
type params = { sessionId: string; username: string };
const getPromotionAPI = async (params: params, path: string) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => params[key] !== undefined && searchParams.append(key, params[key]));
    const url = `${buildPromotionSiteUrl()}${path}?${searchParams.toString()}`;
    const response = await axios.get(url);
    return response.data;
};
