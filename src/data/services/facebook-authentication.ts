import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "../contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import {
  LoadUserAccountRepository,
  SaveFacebookUserAccountRepository,
} from "../contracts/repos";
import { AccessToken, FacebookAccount } from "@/domain/models";
import { TokenGenerator } from "../contracts/crypto";
export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
      SaveFacebookUserAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser({
      token: params.token,
    });
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({
        email: fbData.email,
      });
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount);
      const token = await this.crypto.generateToken({
        key: id,
        expirationInMs: AccessToken.expirationInMs,
      });
      return new AccessToken(token);
    }
    return new AuthenticationError();
  }
}
