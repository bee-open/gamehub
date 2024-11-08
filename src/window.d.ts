// noinspection JSUnusedGlobalSymbols

import {BeeGameSDK} from "@/bee-game-sdk";
import Tracker from '@openreplay/tracker';

declare global {
    interface Window {
        BeeGameSDK: BeeGameSDK;
        env: string,
        release: string,
        API_BASE: string,
        tracker: Tracker,
    }
}