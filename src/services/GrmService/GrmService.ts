import { GrmService } from "../service";

const service = GrmService.enhanceEndpoints({}).injectEndpoints({
    endpoints: (build) => ({
        getUserAction: build.query<void, string>({
            query: (date) => {
                return {
                    url: `api/WN_groupAction${date}.csv`,
                    responseHandler: (responese) => responese.text(),
                };
            },
        }),
    }),
});

export const { useLazyGetUserActionQuery } = service;
