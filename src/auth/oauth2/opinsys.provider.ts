import { Injectable } from "@nestjs/common";
import { SocialUser } from "../types";
import { Oauth2Provider } from "./provider.implementation";

@Injectable()
export class OpinsysOauth implements Oauth2Provider {
    getAuthorizationUri(): string {
        throw new Error("Method not implemented.");
    }
    async getUser({ code }: { code: string; }): Promise<SocialUser> {
        throw new Error("Method not implemented. code: " + code);
    }
}