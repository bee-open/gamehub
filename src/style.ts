// noinspection JSUnusedGlobalSymbols,UnnecessaryLocalVariableJS


export type BlockFunction<W, T> = (value: W) => T;
export type AsyncBlockFunction<W, T> = (value: W) => Promise<T>;

export function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}

export async function WaitingWhen(title: string, func: CallableFunction, finallyFunc?: CallableFunction) {
    let start = new Date().getTime();
    let expire = start + 3000;
    while (func()) {
        await sleep(100);
        if (new Date().getTime() > expire) {
            console.warn(`waiting [${title}]`)
            expire += 3000;
        }
    }
    if (finallyFunc) {
        finallyFunc();
    }
}

export function Get(url: string): Promise<Response> {
    return new Promise((resolve, reject) => {
        fetch(url).then(rsp => {
            if (rsp.status == 200) {
                resolve(rsp)
            } else {
                reject(new Error(`load error [${rsp.statusText}] ${url}`));
            }
        }).catch(reject);
    })
}

export async function GetText(url: string) {
    const rsp = await Get(url)
    return await rsp.text();
}

export function Fail(msg: string): never {
    window.alert(msg);
    throw new Error(msg);
}

export interface BlockOption<T> {
    fail?: boolean;
    defaultValue?: T;
    whenError?: (e: any) => Promise<any | void>;
}

const defaultBlockOption: BlockOption<any> = {
    fail: true,
    defaultValue: null,
};

export function withAsyncBlock<W, T>(nameOrExpr: W, block: AsyncBlockFunction<W, T>, option?: BlockOption<T>): Promise<T> {
    const _option = {...defaultBlockOption, ...option};
    return new Promise<T>(async (resolve, reject) => {
        if (nameOrExpr === null || nameOrExpr === undefined) {
            resolve(_option.defaultValue);
            return;
        }
        let name;
        if (typeof nameOrExpr === "string") {
            name = nameOrExpr;
        } else {
            name = typeof nameOrExpr;
        }
        // Sentry.startSpanManual({
        //     name: name,
        // }, async (span, finish) => {
        try {
            const ret = await block(nameOrExpr);
            // span.setStatus({
            //     code: 1,
            //     message: 'ok',
            // })
            resolve(ret);
        } catch (e) {
            // span.setStatus({
            //     code: 2,
            //     message: 'internal_error',
            // });
            if (_option.whenError) {
                try {
                    const tmp = await _option.whenError(e);
                    if (tmp) {
                        e = tmp;
                    }
                } catch (ee) {
                    if (_option.fail) {
                        reject(new Error(`[${name} - whenError] ${ee}`));
                    } else {
                        resolve(_option.defaultValue);
                    }
                    return;
                }
            }
            if (_option.fail) {
                reject(new Error(`[${name}] ${e}`));
            } else {
                resolve(_option.defaultValue);
            }
        } finally {
            // finish()
        }
    })
    // })
}

export function withBlock<W, T>(nameOrExpr: W, block: BlockFunction<W, T>, option?: BlockOption<T>): T {
    const _option = {...defaultBlockOption, ...option};
    if (nameOrExpr === null || nameOrExpr === undefined) {
        return _option.defaultValue;
    }
    let name;
    if (typeof nameOrExpr === "string") {
        name = nameOrExpr;
    } else {
        name = typeof nameOrExpr;
    }
    // return Sentry.startSpan({
    //     name: name,
    // }, (span) => {
    try {
        const ret = block(nameOrExpr);
        // span.setStatus({
        //     code: 1,
        //     message: 'ok',
        // })
        return ret;
    } catch (e) {
        // span.setStatus({
        //     code: 2,
        //     message: 'internal_error',
        // });
        if (_option.fail) {
            throw new Error(`[${name}] ${e}`);
        } else {
            return _option.defaultValue;
        }
    }
    // })
}