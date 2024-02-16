import { Callback, Context, Handler } from 'aws-lambda';

// @ts-ignore

import * as app from '../../dist/main';

let server: Handler;


export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
  ) => {
    server = server ?? (await app.bootstrap());
    return server(event, context, callback);
};