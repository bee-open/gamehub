// noinspection JSUnusedGlobalSymbols

import {withAsyncBlock} from "@/style";

type FinishGameCallback = (score: number) => Promise<boolean>;

export interface CommonResult {
    name: string;
    game: GameNode;
    user_game_daily: UserGameDailyInfo;
    user_game_log: UserGameLogInfo;
}

export interface ServerResponse<T> {
    ret: number;
    debug: string;
    error: string;
    result: T;
}

export function assert(condition: any, message?: string) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}


export class UserInfo {
    public avatar: string = "";
    public bonus: string = "";
    public nft_avatar_power_ratio: number = 0;
    public nft_total_power_ratio: number = 0;
    public open_id: string = "";
    public package_id: string = "";
    public verify_token: string = "";
    public message: string = "";
}

class UserData {
    public score = 0;
    public scoreEx? = 0;
}

export class UserGameLogInfo {
    public id = ""
    public daily = ""
    public game_id = ""
    public user_id = ""
    public created_at = 0
    public score = -1
    public reward = 0
    public ads_log = []
    public re_log = []
    public metadata = {}
    public updated_at = 0
    public trade_no = ""
}

export class UserGameDailyInfo {
    public game_id = ""
    public user_id = ""
    public date = ""
    public date_start_ts = 0
    public date_expire_ts = 0
    public reward = 0
    public ads_re = 0
    public item_re = 0
}

export class GameNode {
    public id = "";
    public gameName = "";
    public rewardRange = new Map<string, number>();
    public diamondRewardIndex = 0.0;
    public adRewardIndex = 0.0;
    public diamondReviveCost = 0;
    public maxPointsPerRound = 0;
    public dailyPointsLimit = 0;
    public maxDiamondRevives = 0;
    public maxAdRevives = 0;

}


export class BeeGameSDK {
    public static playCallback: Function;
    public static unmuteCallback: Function;
    public static muteCallback: Function;
    public static resumeCallback: Function;
    public static pauseCallback: Function;
    public static finishGameCallback: FinishGameCallback;
    private static gameReadyCallback: Function;
    private static showProgressCallback: (value: number) => void;
    public static scoreCallback: (userData: UserData) => void;
    private static gameId = "";
    public static auth = "";
    public static gameNode = new GameNode();
    public static userGameLogInfo = new UserGameLogInfo();
    public static userGameDailyInfo = new UserGameDailyInfo();
    public static progress = 0;

    public static hasAdsRe() {
        return BeeGameSDK.userGameDailyInfo.ads_re < 50;
    }

    private static async __api<T>(api: string, params: any, error?: (e: any, ret: ServerResponse<T>) => Promise<boolean>): Promise<T> {
        let ret = null;
        return withAsyncBlock("api", async () => {
            const res = await fetch(`${window.API_BASE}${api}`, {
                method: "POST",
                headers: {
                    "authorization": BeeGameSDK.auth,
                },
                body: JSON.stringify(params),
            });
            assert(res.status == 200, `server wrong[${res.status}]`);
            ret = (await res.json()) as ServerResponse<T>;
            console.info(`[api=${api}]`, JSON.stringify(params), "=>", JSON.stringify(ret));
            assert(ret.ret === 0, `server error[${ret.ret}:${ret.error}]`);
            const commonResult = ret.result as CommonResult;
            if (commonResult) {
                if (commonResult.user_game_daily) {
                    BeeGameSDK.userGameDailyInfo = commonResult.user_game_daily;
                }
                if (commonResult.user_game_log) {
                    BeeGameSDK.userGameLogInfo = commonResult.user_game_log;
                }
                if (commonResult.game) {
                    BeeGameSDK.gameNode = commonResult.game;
                }
            }
            return ret.result;
        }, {
            fail: true,
            async whenError(e) {
                console.error(`[api=${api}] Error`, JSON.stringify(params), e);
                if (error) {
                    const tmp = await error!(e, ret!);
                    if (tmp) {
                        return;
                    }
                }
                alert(e);
                return new Error("Server error");
            },
        });
    }


    public static async getUserInfo() {
        console.log("getUserInfo", "start");
        console.log("getUserInfo", "init");
        try {
            return {
                avatar: "https://resource.gamifydao.io/mini/avatar/0.png",
                bonus: "https://resource.gamifydao.io/mini/power_level/quality_1.png",
                nft_avatar_power_ratio: 0,
                nft_total_power_ratio: 0,
                open_id: "a603c2e8fc01b4280b3c1ee9f847583a",
                package_id: "10010",
                verify_token: "68a735672fe7cb3f91ab1a98ea0874ea",
            } as UserInfo
        } catch (e) {
            console.error(e);
            setTimeout(() => {
                alert(`get user info error need refresh [${e}]`);
                window.location.reload();
            }, 1000);
            throw new Error();
        }
    }


    public static async init(gameId: string, user: UserInfo) {
        BeeGameSDK.gameId = gameId;
        BeeGameSDK.auth = "Basic " + btoa(`${user.open_id}:${user.verify_token}`);
        await BeeGameSDK.getGameInfo();
        await BeeGameSDK.__api("/game/login", {
            metadata: user,
        });
    }

    public static async getGameInfo() {
        return (await BeeGameSDK.__api("/game/info", {
            game_id: BeeGameSDK.gameId,
        })) as GameNode;
    }

    public static async gameStart() {
        const pointsDetails = {
            state: 1,
            message: "",
            data: {
                today_server_acquired_point: 0, // 今日服务器已经发出的积分数
                today_server_max_point: 0, // 今日服务器最大获取积分数
                today_user_acquired: 0, // 今日用户已经获取积分数
                today_user_max_point: 0, // 今日用户最大获取积分数
            }
        }
        assert(pointsDetails.state == 1, pointsDetails.message || "#exception#");
        await BeeGameSDK.__api<CommonResult>("/game/start", {
            game_id: BeeGameSDK.gameId,
            ...pointsDetails.data,
        });
    }

    public static async gameAdsRe() {
        return await BeeGameSDK.__api<CommonResult>("/game/ads_re", {
            game_id: BeeGameSDK.gameId,
            user_game_log_id: BeeGameSDK.userGameLogInfo.id,
        });
    }

    public static async gameAdsReOver(name: string) {
        return await BeeGameSDK.__api<GameNode>("/game/ads_re_over", {
            name,
            game_id: BeeGameSDK.gameId,
            user_game_log_id: BeeGameSDK.userGameLogInfo.id,
        });
    }

    public static async gameItemRe(whenNotEnough: () => Promise<boolean>) {
        await BeeGameSDK.__api<CommonResult>("/game/item_re", {
            game_id: BeeGameSDK.gameId,
            user_game_log_id: BeeGameSDK.userGameLogInfo.id,
        }, async (e, ret) => {
            if (ret.ret === 10015 && ret.error.includes("Not enough diamonds")) {
                if (whenNotEnough) {
                    await whenNotEnough();
                    return true;
                }
            }
            return false;
        });
    }

    public static async gameComplete() {
        await BeeGameSDK.__api<CommonResult>("/game/complete", {
            game_id: BeeGameSDK.gameId,
            user_game_log_id: BeeGameSDK.userGameLogInfo.id,
        });
    }

    public static async gameOver(score: number) {
        await BeeGameSDK.__api<CommonResult>("/game/over", {
            score: score,
            game_id: BeeGameSDK.gameId,
            user_game_log_id: BeeGameSDK.userGameLogInfo.id,
        });
    }

    public static regShowProgress(callback: (value: number) => void) {
        BeeGameSDK.showProgressCallback = callback;
    }

    public static showProgress(value: number) {
        BeeGameSDK.progress = value;
        if (BeeGameSDK.showProgressCallback) {
            BeeGameSDK.showProgressCallback(BeeGameSDK.progress);
        }
    }

    public static regScoreCallback(callback: (userData: UserData) => void) {
        BeeGameSDK.scoreCallback = callback;
    }

    public static regGameReadyCallback(callback: Function) {
        BeeGameSDK.gameReadyCallback = callback;
    }

    public static async setUserData(data: UserData) {
        if (BeeGameSDK.scoreCallback) {
            BeeGameSDK.scoreCallback(data);
        }

    }

    public static async setPauseCallback(callback: Function) {
        BeeGameSDK.pauseCallback = callback;
    }

    public static async setResumeCallback(callback: Function) {
        BeeGameSDK.resumeCallback = callback;
    }

    public static async setMuteCallback(callback: Function) {
        BeeGameSDK.muteCallback = callback;
    }

    public static async setUnmuteCallback(callback: Function) {
        BeeGameSDK.unmuteCallback = callback;
    }

    public static async setPlayCallback(callback: Function) {
        console.log("game", "setPlayCallback");
        BeeGameSDK.playCallback = callback;
        if (BeeGameSDK.gameReadyCallback) {
            BeeGameSDK.gameReadyCallback();
        }
    }

    public static getUserData() {
        return {};
    }

    public static async gameLive(data: any) {
        if (BeeGameSDK.scoreCallback) {
            BeeGameSDK.scoreCallback({
                score: data.score,
            });
        }
    }

    public static async finishGame(score: number) {
        if (BeeGameSDK.finishGameCallback) {
            const ret = await BeeGameSDK.finishGameCallback(score);
            console.warn("finishGame", ret);
            return ret;
        } else {
            return false;
        }
    }

    public static regFinishGameCallback(callback: FinishGameCallback) {
        BeeGameSDK.finishGameCallback = callback;
    }
}
